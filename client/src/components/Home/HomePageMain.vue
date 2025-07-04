<template>
  <!-- The Three.js container -->
  <div id="three-container" ref="threeContainer" />

  <!-- The popup overlay -->
  <div class="popup-overlay">
    <div
      v-for="(popup, index) in costPopups"
      :key="index"
      class="cost-popup"
      :style="getPopupStyle(popup)"
    >
      {{ popup.amount >= 0 ? '+' : '-' }}${{ Math.abs(popup.amount).toFixed(2) }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits, defineExpose, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import concreteTexture from '@/assets/textures/square-outline-textured.png'

const threeContainer = ref(null)
let camera, scene, renderer, controls
let plane
let pointer, raycaster, isShiftDown = false, isCtrlDown = false
let rollOverMesh, rollOverMaterial
let cubeGeo, cubeMaterial
const objects = []
let isMouseDown = false
let lastPlacedPosition = new THREE.Vector3()
const placedKeys = new Set()
const costPopups = ref([])

const props = defineProps({
  isOpen: Boolean,
  blockSqFt: {
    type: Number,
    default: 1
  },
  foundationThickness: {
    type: Number,
    default: 8
  }
})

const emit = defineEmits(['block-added', 'block-removed'])

onMounted(() => {
  init()
  render()
})

watch([() => props.foundationThickness, () => props.blockSqFt], ([newThickness, newBlockSqFt]) => {
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(concreteTexture)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  // Calculate scaled thickness proportional to block size
  const scaledThickness = newThickness * Math.sqrt(1 / newBlockSqFt)

  // Recreate cube geometry with scaled thickness
  cubeGeo = new THREE.BoxGeometry(50, scaledThickness, 50)

  // Update existing cubes' geometry
  objects.forEach(obj => {
    if (obj !== plane) {
      obj.geometry.dispose()
      obj.geometry = cubeGeo

      // Reposition to keep on ground
      obj.position.y = scaledThickness / 2
    }
  })

  // Recreate material to ensure consistency
  cubeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.1
  })
})

function init() {
  // Camera setup
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set(500, 800, 1300)
  camera.lookAt(0, 0, 0)

  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // Setup orbit controls
  controls = new OrbitControls(camera, threeContainer.value)
  controls.enableDamping = true // Optional, but makes movement smoother
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.enabled = false // Disabled by default, enabled when CTRL is pressed
  controls.maxPolarAngle = Math.PI / 2 // Prevent camera from going below the ground plane

  // Calculate scaled thickness for initial setup
  const scaledThickness = props.foundationThickness * Math.sqrt(1 / props.blockSqFt)

  // Roll-over helpers
  const rollOverGeo = new THREE.BoxGeometry(50, scaledThickness, 50)
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true
  })
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
  scene.add(rollOverMesh)

  // Cubes
  // Load texture
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(concreteTexture)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  // Create cube material with texture
  cubeGeo = new THREE.BoxGeometry(50, scaledThickness, 50)
  cubeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.1
  })

  // Grid
  const gridHelper = new THREE.GridHelper(1000, 20)
  scene.add(gridHelper)

  // Raycaster and pointer setup
  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  // Plane
  const geometry = new THREE.PlaneGeometry(1000, 1000)
  geometry.rotateX(-Math.PI / 2)
  plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }))
  scene.add(plane)
  objects.push(plane)

  // Lights
  const ambientLight = new THREE.AmbientLight(0x606060, 3)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
  directionalLight.position.set(1, 0.75, 0.5).normalize()
  scene.add(directionalLight)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  threeContainer.value.appendChild(renderer.domElement)

  // Event listeners
  window.addEventListener('resize', onWindowResize)
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('keydown', onDocumentKeyDown)
  document.addEventListener('keyup', onDocumentKeyUp)

  // Start animation loop
  animate()
}

function positionKey(position) {
  // Always use grid units to build the key, matching snapToGrid()
  const x = Math.floor(position.x / 50)
  const z = Math.floor(position.z / 50)
  return `${x}_${z}`
}

function animate() {
  requestAnimationFrame(animate)
  if (controls.enabled) {
    controls.update()
  }
  render()
}

function onPointerMove(event) {
  // Skip if controls are active (CTRL is pressed)
  if (controls.enabled) return

  pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(objects, false)
  if (intersects.length > 0) {
    const intersect = intersects[0]
    const position = snapToGrid(
      new THREE.Vector3().copy(intersect.point).add(intersect.face.normal)
    )

    position.y = props.foundationThickness / 2

    // Only show rollover mesh if position is valid
    if (isValidPlacement(position)) {
      rollOverMesh.visible = true
      rollOverMesh.position.copy(position)
    } else {
      rollOverMesh.visible = false
    }

    // If mouse is down and not holding shift or ctrl, try to place a block
    if (isMouseDown && !isShiftDown && !isCtrlDown) {
      // Check if we're at a new position
      if (!position.equals(lastPlacedPosition)) {
        placeBlock(position)
        lastPlacedPosition.copy(position)
      }
    }
  }
}

function addCostPopup(x, z, amount, color) {
  // Use the actual world position of the block (including proper Y coordinate)
  const scaledThickness = props.foundationThickness * Math.sqrt(1 / props.blockSqFt)
  const worldPosition = new THREE.Vector3(x * 50 + 25, scaledThickness, z * 50 + 25)

  // Project to normalized device coordinates
  const vector = worldPosition.clone()
  vector.project(camera)

  // Convert to screen coordinates
  const rect = renderer.domElement.getBoundingClientRect()
  const screenX = (vector.x * 0.5 + 0.5) * rect.width
  const screenY = (-vector.y * 0.5 + 0.5) * rect.height

  costPopups.value.push({
    x: screenX,
    y: screenY,
    amount: amount,
    opacity: 1,
    float: 0,
    color: color
  })

  // Animate the popup
  const popup = costPopups.value[costPopups.value.length - 1]
  const interval = setInterval(() => {
    popup.float += 2
    popup.opacity -= 0.015
    if (popup.opacity <= 0) {
      clearInterval(interval)
      costPopups.value.splice(costPopups.value.indexOf(popup), 1)
    }
  }, 16) // ~60fps
}

function getPopupStyle(popup) {
  return {
    left: `${popup.x}px`,
    top: `${popup.y - popup.float}px`,
    transform: 'translate(-50%, -50%)',
    opacity: popup.opacity,
    color: popup.color,
  }
}

function snapToGrid(pos) {
  const adjusted = new THREE.Vector3()
    .copy(pos)
    .divideScalar(50)
    .floor()
    .multiplyScalar(50)
    .addScalar(25)

  adjusted.y = props.foundationThickness * Math.sqrt(1 / props.blockSqFt) / 2
  return adjusted
}

function onPointerDown(event) {
  // Skip if controls are active (CTRL is pressed)
  if (controls.enabled) return

  isMouseDown = true
  pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(objects, false)
  if (intersects.length > 0) {
    const intersect = intersects[0]
    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object)
        objects.splice(objects.indexOf(intersect.object), 1)

        const key = positionKey(intersect.object.position)
        placedKeys.delete(key)

        const [x, z] = key.split('_').map(Number)
        emit('block-removed', x, z)
      }
    } else if (!isCtrlDown) {
      // Place initial block
      const position = snapToGrid(
        new THREE.Vector3().copy(intersect.point).add(intersect.face.normal)
      )

      placeBlock(position)
      lastPlacedPosition.copy(position)
    }
  }
}

function onPointerUp() {
  isMouseDown = false
}

function isValidPlacement(position) {
  const key = positionKey(position)
  return !placedKeys.has(key) && position.y <= 25
}

function placeBlock(position) {
  const scaledThickness = props.foundationThickness * Math.sqrt(1 / props.blockSqFt)

  if (isValidPlacement(position)) {
    const voxel = new THREE.Mesh(cubeGeo, cubeMaterial)
    voxel.position.set(position.x, scaledThickness / 2, position.z)
    scene.add(voxel)
    objects.push(voxel)

    const key = positionKey(position)
    placedKeys.add(key)

    const [x, z] = key.split('_').map(Number)
    emit('block-added', x, z)
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function onDocumentKeyDown(event) {
  if (event.keyCode === 16) isShiftDown = true
  if (event.keyCode === 17) {
    isCtrlDown = true
    controls.enabled = true
    rollOverMesh.visible = false // Hide rollover mesh while rotating
  }
}

function onDocumentKeyUp(event) {
  if (event.keyCode === 16) isShiftDown = false
  if (event.keyCode === 17) {
    isCtrlDown = false
    controls.enabled = false
    controls.update() // Ensure final position is rendered
  }
}

function render() {
  renderer.render(scene, camera)
}

defineExpose({ addCostPopup });
</script>

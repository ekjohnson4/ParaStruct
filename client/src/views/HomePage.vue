<template>
  <header class="navbar navbar-default">
    <nav class="container-fluid d-flex align-items-center justify-content-between">
      <div class="navbar-header d-flex align-items-center">
        <button class="openbtn" @click.stop="toggleNav" @pointerdown.stop>
          <font-awesome-icon
            icon="bars"
            class="icon-transition"
            :class="{ 'icon-hidden': isOpen }"
          />
          <font-awesome-icon
            icon="times"
            class="icon-transition"
            :class="{ 'icon-hidden': !isOpen }"
          />
        </button>
        <router-link to="/" class="navbar-brand">
          <img class="logo" src="../assets/ParaStruct_Logo_New.webp" />
        </router-link>
      </div>
      <div class="settings-btn ms-auto">
        <router-link to="/settings" class="btn btn-outline-light no-border">
          <font-awesome-icon icon="cog"/>
        </router-link>
      </div>
    </nav>
  </header>

  <div id="mySidebar" class="sidebar" :style="{ width: sidebarWidth }" @pointerdown.stop @click.stop>
    <div class="sidebar-body">
      <div class="config-container">
        <div class="config-item">
          <span class="config-label">SqFt per Block:</span>
          <input
            v-model.number="calculations.blockSqFt.value"
            type="number"
            min="1"
            placeholder="Enter sq ft per block"
            class="input-field"
          >
        </div>
        <div class="config-item">
          <span class="config-label">Thickness (inches):</span>
          <input
            v-model.number="calculations.foundationThickness.value"
            type="number"
            min="6"
            max="12"
            placeholder="Thickness (6-12 inches)"
            class="input-field"
          >
        </div>
        <div class="accordion" id="accordionConcrete">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseConcrete" aria-expanded="true" aria-controls="collapseConcrete">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Concrete Settings</div>
                  <div class="accordion-header-subtext">{{ calculations.concreteBagWeight.value }} lb bags</div>
                </div>
              </button>
              <!-- <input
                class="form-check-input me-2"
                type="checkbox"
                v-model="materialToggles.concrete"
                id="toggleConcrete"
              /> -->
            </h2>
            <div id="collapseConcrete" class="accordion-collapse collapse" data-bs-parent="#accordionConcrete">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Bag Weight (lbs):</span>
                  <select v-model.number="calculations.concreteBagWeight.value" class="input-field">
                    <option :value="50">50 lbs</option>
                    <option :value="60">60 lbs</option>
                    <option :value="80">80 lbs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion" id="accordionRebar">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRebar" aria-expanded="true" aria-controls="collapseRebar">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Rebar Settings</div>
                  <div class="accordion-header-subtext">{{ calculations.poleLength.value }} ft. {{calculations.rebarSize.value}}</div>
                </div>
              </button>
            </h2>
            <div id="collapseRebar" class="accordion-collapse collapse" data-bs-parent="#accordionRebar">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Spacing (inches):</span>
                  <input
                    v-model.number="calculations.rebarSpacing.value"
                    type="number"
                    min="6"
                    max="24"
                    step="1"
                    placeholder="Spacing (e.g., 12)"
                    class="input-field"
                  >
                </div>
                <div class="config-item">
                  <span class="config-label">Length (feet):</span>
                  <input
                    v-model.number="calculations.poleLength.value"
                    type="number"
                    min="5"
                    max="40"
                    step="1"
                    placeholder="e.g., 10"
                    class="input-field"
                  >
                </div>
                <div class="config-item">
                  <span class="config-label">Size:</span>
                  <select v-model="calculations.rebarSize.value" class="input-field">
                    <option value="#3">#3 (3/8")</option>
                    <option value="#4">#4 (1/2")</option>
                    <option value="#5">#5 (5/8")</option>
                    <option value="#6">#6 (3/4")</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion" id="accordionWood">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWood" aria-expanded="true" aria-controls="collapseWood">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Wood Settings</div>
                  <div class="accordion-header-subtext">{{calculations.woodSize.value}}"x{{calculations.woodLength.value}}''</div>
                </div>
              </button>
            </h2>
            <div id="collapseWood" class="accordion-collapse collapse" data-bs-parent="#accordionWood">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Size:</span>
                  <select v-model="calculations.woodSize.value" class="input-field">
                    <option value="2x4">2x4</option>
                    <option value="2x6">2x6</option>
                    <option value="2x8">2x8</option>
                  </select>
                </div>
                <div class="config-item">
                  <span class="config-label">Length (ft):</span>
                  <input
                    v-model.number="calculations.woodLength.value"
                    type="number"
                    min="6"
                    max="16"
                    step="2"
                    class="input-field"
                    placeholder="e.g., 10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion" id="accordionGravel">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGravel" aria-expanded="true" aria-controls="collapseGravel">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Gravel Settings</div>
                  <div class="accordion-header-subtext">{{calculations.gravelDepth.value}} in. deep</div>
                </div>
              </button>
            </h2>
            <div id="collapseGravel" class="accordion-collapse collapse" data-bs-parent="#accordionGravel">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Depth (inches):</span>
                  <input
                    v-model.number="calculations.gravelDepth.value"
                    type="number"
                    min="4"
                    max="12"
                    step="1"
                    placeholder="e.g., 6"
                    class="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-container">
        <div class="config-item">
          <span class="config-label">Area:</span>
          <span class="config-value">{{ calculations.foundationArea.value }} sq ft</span>
        </div>
        <div class="config-item">
          <span class="config-label">Estimated Cost:</span>
          <span class="config-value">${{ materials.estimatedCost.value }}</span>
        </div>
      </div>
      <button
        @click.stop="toggleMaterialsSidebar"
        @pointerdown.stop
        class="btn btn-primary materials-button d-flex justify-content-center align-items-center gap-2"
      >
        <font-awesome-icon
          icon="cart-shopping"
        />
        <span v-if="isMaterialsOpen">Close Materials</span>
        <span v-else>Materials</span>
      </button>
    </div>
  </div>

  <div
    id="myMaterialsSidebar"
    class="materials-sidebar"
    :style="{ width: materialsSidebarWidth }"
    @pointerdown.stop
    @click.stop
  >
      <div class="materials-container">
        <div class="materials-wrapper">
          <div v-if="loadingMaterials" class="spinner"></div>
          <div
            v-else
            class="item"
            v-for="(material, index) in materials.filteredMaterials.value"
            :key="index"
          >
            <img
              class="item-img"
              :src="getMaterialImage(material.type)"
              :alt="material.type + ' image'"
            />
            <a class="item-title" :href="material.link" target="_blank">
              <strong>{{ material.title }}</strong>
            </a>
            <div class="item-price">
              {{ material.displayPrice }}
              <span
                v-if="material.bulkPricing && !material.usesBulk && !material.isLocal"
                class="tooltip-hint"
                @mouseenter="showTooltip($event, material)"
                @mouseleave="hideTooltip"
              >
                ⓘ
              </span>
              <span v-if="material.usesBulk" class="bulk">bulk</span>
              <span v-if="material.isLocal" class="local">(local)</span>
            </div>
            <div class="item-qty">
              x{{material.quantity}}
            </div>
          </div>
        </div>
      </div>
  </div>

  <!-- Three.js Canvas -->
  <div id="main" :style="{ marginLeft: mainMargin }">
    <HomePageMain
      ref="mainCanvas"
      :isOpen="isOpen"
      :blockSqFt="calculations.blockSqFt.value"
      :foundationThickness="calculations.foundationThickness.value"
      @block-added="handleBlockAdded"
      @block-removed="handleBlockRemoved"
    />
  </div>

  <div
    v-if="tooltipData.visible"
    class="floating-tooltip"
    :style="{ top: tooltipData.y + 'px', left: tooltipData.x + 'px' }"
  >
    {{ tooltipData.text }}
  </div>

  <!-- Info Button -->
<button class="info-btn" @click="showInfo">
  <font-awesome-icon icon="info"/>
</button>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import HomePageMain from '../components/Home/HomePageMain.vue'
import { useFoundationCalculations } from '../composables/useFoundationCalculations'
import { useMaterialProcessing } from '../composables/useMaterialProcessing'
import { useMaterialsStore } from '../stores/materials'
import alertify from 'alertifyjs'

alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";

// Composables
const calculations = useFoundationCalculations();
const materials = useMaterialProcessing(calculations);
const store = useMaterialsStore();

// UI State
const isOpen = ref(true);
const isMaterialsOpen = ref(false);
const loadingMaterials = ref(false);
const mainCanvas = ref(null);

// Computed styles
const sidebarWidth = computed(() => isOpen.value ? '240px' : '0px');
const materialsSidebarWidth = computed(() => isMaterialsOpen.value ? '480px' : '0px');
const mainMargin = computed(() => isOpen.value ? '240px' : '0px');

// Tooltip
const tooltipData = ref({ visible: false, x: 0, y: 0, text: '' })

// Methods
const toggleNav = () => {
  isOpen.value = !isOpen.value
  if (isMaterialsOpen.value) isMaterialsOpen.value = false
}

const toggleMaterialsSidebar = () => {
  isMaterialsOpen.value = !isMaterialsOpen.value
}

const handleBlockAdded = (x, z) => {
  const previousCost = parseFloat(materials.estimatedCost.value)
  calculations.addBlock(x, z)

  nextTick(() => {
    const newCost = parseFloat(materials.estimatedCost.value)
    const costDifference = newCost - previousCost
    mainCanvas.value?.addCostPopup(x, z, costDifference)
  })
}

const handleBlockRemoved = (x, z) => {
  calculations.removeBlock(x, z)
}

const showTooltip = (event, material) => {
  tooltipData.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY - 20,
    text: `Bulk price ${material.bulkPricing.price} for ${material.bulkPricing.quantity}+`
  }
}

const hideTooltip = () => {
  tooltipData.value.visible = false
}

const fetchAllMaterials = async () => {
  loadingMaterials.value = true
  try {
    const urls = materials.materialSpecs.value.foundation.map(material =>
      `https://www.homedepot.com/s/${encodeURIComponent(material.query)}?NCNI-5`
    )

    const apiURL = `/api/materials?${urls.map(u => `urls=${encodeURIComponent(u)}`).join('&')}`
    const response = await fetch(apiURL)
    const data = await response.json()

    const fetched = {}
    materials.materialSpecs.value.foundation.forEach((spec, i) => {
      fetched[spec.name] = data[urls[i]] || []
    })

    store.setAllMaterials(fetched)
  } catch (error) {
    console.error('Failed to fetch materials:', error)
  } finally {
    loadingMaterials.value = false
  }
}

function showInfo() {
  alertify.alert(
    'Controls',
    `
    <strong>Click</strong>: add blocks<br/>
    <strong>Click + drag</strong>: draw blocks<br/>
    <strong>Shift + click</strong>: remove block<br/>
    <strong>Ctrl + drag (left-click)</strong>: move camera<br/>
    <strong>Ctrl + drag (right-click)</strong>: rotate camera<br/>
    <strong>Ctrl + scroll</strong>: zoom
    `
  )
}

const getMaterialImage = (type) => {
  switch (type) {
    case 'concrete':
      return new URL('../assets/concrete.webp', import.meta.url).href;
    case 'wood':
      return new URL('../assets/wood.webp', import.meta.url).href;
    case 'sealer':
      return new URL('../assets/sealer.webp', import.meta.url).href;
    case 'gravel':
      return new URL('../assets/gravel.webp', import.meta.url).href;
    case 'rebar':
    default:
      return new URL('../assets/rebar.webp', import.meta.url).href;
  }
};

// Lifecycle
onMounted(fetchAllMaterials)

// Watchers
watch(
  [
    calculations.rebarSize,
    calculations.poleLength,
    calculations.concreteBagWeight,
    calculations.woodSize,
    calculations.woodLength,
    calculations.gravelDepth
  ],
  fetchAllMaterials
)
</script>

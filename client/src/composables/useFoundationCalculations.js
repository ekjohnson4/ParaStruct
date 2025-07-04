import { ref, computed } from 'vue'

export function useFoundationCalculations() {
  // State
  const placedBlocks = ref(new Set())
  const blockCount = ref(0)
  const blockSqFt = ref(4)
  const foundationThickness = ref(8)

  // Rebar calculations
  const rebarSpacing = ref(12)
  const poleLength = ref(10)
  const rebarSize = ref('#4')

  const sizeMap = {
    '#3': ['3/8', '0.375'],
    '#4': ['1/2', '0.5'],
    '#5': ['5/8', '0.625'],
    '#6': ['3/4', '0.75']
  }

  const rebarCalculation = computed(() => {
    const spacingFeet = rebarSpacing.value / 12
    const area = foundationArea.value

    if (area <= 0 || rebarSpacing.value < 1 || poleLength.value <= 0) {
      return { totalLength: 0, poles: 0, barCount: 0 }
    }

    const sideLength = Math.sqrt(area)
    const barCountPerDirection = Math.ceil(sideLength / spacingFeet) + 1
    const totalBars = barCountPerDirection * 2
    const totalRebarLength = totalBars * sideLength
    const adjustedLength = totalRebarLength + totalBars // 1ft overlap per joint
    const polesNeeded = Math.ceil(adjustedLength / poleLength.value)

    return {
      totalLength: Math.round(adjustedLength),
      poles: polesNeeded,
      barCount: totalBars
    }
  })

  // Concrete calculations
  const concreteBagWeight = ref(80)
  const concreteYieldPerBag = computed(() => ({
    50: 0.375, 60: 0.45, 80: 0.6
  }[concreteBagWeight.value] || 0.6))

  const concreteBagsNeeded = computed(() => {
    const volume = foundationArea.value * (foundationThickness.value / 12)
    return Math.ceil(volume / concreteYieldPerBag.value)
  })

  // Wood calculations
  const woodSize = ref('2x8')
  const woodLength = ref(10)

  const woodCalculation = computed(() => {
    const blockSizeFeet = Math.sqrt(blockSqFt.value)
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const hasBlock = (x, z) => placedBlocks.value.has(`${x},${z}`)

    let edgeCount = 0
    for (const key of placedBlocks.value) {
      const [x, z] = key.split(',').map(Number)
      edgeCount += directions.filter(([dx, dz]) => !hasBlock(x + dx, z + dz)).length
    }

    const totalFeet = edgeCount * blockSizeFeet
    return {
      edges: edgeCount,
      linearFeet: Math.round(totalFeet),
      boards: Math.ceil(totalFeet / woodLength.value)
    }
  })

  // Gravel calculations
  const gravelDepth = ref(6)
  const gravelCalculation = computed(() => ({
    volumeCubicFeet: Math.ceil(foundationArea.value * (gravelDepth.value / 12))
  }))

  // Sealer calculations
  const sealerCoveragePerGallon = 300
  const concreteSealerCalculation = computed(() => ({
    gallons: foundationArea.value / sealerCoveragePerGallon
  }))

  // Computed values
  const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))

  // Block management
  const addBlock = (x, z) => {
    blockCount.value++
    placedBlocks.value.add(`${x},${z}`)
  }

  const removeBlock = (x, z) => {
    blockCount.value--
    placedBlocks.value.delete(`${x},${z}`)
  }

  return {
    // State
    placedBlocks,
    blockCount,
    blockSqFt,
    foundationThickness,
    foundationArea,

    // Rebar
    rebarSpacing,
    poleLength,
    rebarSize,
    sizeMap,
    rebarCalculation,

    // Concrete
    concreteBagWeight,
    concreteBagsNeeded,
    concreteYieldPerBag,

    // Wood
    woodSize,
    woodLength,
    woodCalculation,

    // Gravel
    gravelDepth,
    gravelCalculation,

    // Sealer
    concreteSealerCalculation,

    // Methods
    addBlock,
    removeBlock
  }
}
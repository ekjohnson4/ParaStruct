<template>
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <button
        class="openbtn"
        :style="{ left: openBtnPosition }"
        @click.stop="toggleNav"
        @pointerdown.stop
      >
        {{ isOpen ? 'X' : '☰' }}
      </button>
      <div class="navbar-brand">
        <img class="logo" src="../assets/ParaStruct_Logo.webp">
      </div>
    </div>
  </div>
</nav>
  <div
    id="mySidebar"
    class="sidebar"
    :style="{ width: sidebarWidth }"
    @pointerdown.stop
    @click.stop
  >
    <div class="sidebar-content">
      <div class="config-container">
        <h4>Config</h4>
        <div class="stat-item">
          <span class="stat-label">SqFt per Block:</span>
          <input
            v-model.number="blockSqFt"
            type="number"
            min="1"
            placeholder="Enter sq ft per block"
            class="input-field"
          >
        </div>
        <div class="stat-item">
          <span class="stat-label">Thickness (inches):</span>
          <input
            v-model.number="foundationThickness"
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
                Concrete Settings
              </button>
            </h2>
            <div id="collapseConcrete" class="accordion-collapse collapse" data-bs-parent="#accordionConcrete">
              <div class="accordion-body">
                <div class="stat-item">
                  <span class="stat-label">Bag Weight (lbs):</span>
                  <select v-model.number="concreteBagWeight" class="input-field">
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
                Rebar Settings
              </button>
            </h2>
            <div id="collapseRebar" class="accordion-collapse collapse" data-bs-parent="#accordionRebar">
              <div class="accordion-body">
                <div class="stat-item">
                  <span class="stat-label">Rebar Spacing (inches):</span>
                  <input
                    v-model.number="rebarSpacing"
                    type="number"
                    min="6"
                    max="24"
                    step="1"
                    placeholder="Spacing (e.g., 12)"
                    class="input-field"
                  >
                </div>
                <div class="stat-item">
                  <span class="stat-label">Rebar Length (feet):</span>
                  <input
                    v-model.number="poleLength"
                    type="number"
                    min="5"
                    max="40"
                    step="1"
                    placeholder="e.g., 10"
                    class="input-field"
                  >
                </div>
                <div class="stat-item">
                  <span class="stat-label">Rebar Size:</span>
                  <select v-model="rebarSize" class="input-field">
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
                Wood Settings
              </button>
            </h2>
            <div id="collapseWood" class="accordion-collapse collapse" data-bs-parent="#accordionWood">
              <div class="accordion-body">
                <div class="stat-item">
                  <span class="stat-label">Wood Size:</span>
                  <select v-model="woodSize" class="input-field">
                    <option value="2x4">2x4</option>
                    <option value="2x6">2x6</option>
                    <option value="2x8">2x8</option>
                  </select>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Wood Length (ft):</span>
                  <input
                    v-model.number="woodLength"
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
                Gravel Settings
              </button>
            </h2>
            <div id="collapseGravel" class="accordion-collapse collapse" data-bs-parent="#accordionGravel">
              <div class="accordion-body">
                <div class="stat-item">
                  <span class="stat-label">Gravel Depth (inches):</span>
                  <input
                    v-model.number="gravelDepth"
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

      <div class="materials-container">
        <div class="materials-wrapper">
          <div v-if="loadingMaterials" class="spinner"></div>
          <div
            v-else
            class="item"
            v-for="(material, index) in filteredMaterials"
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
              {{ material.usesBulk ? material.bulkPricing.price : material.price }}
              <span
                v-if="material.bulkPricing && !material.usesBulk"
                class="tooltip-hint"
                @mouseenter="showTooltip($event, material)"
                @mouseleave="hideTooltip"
              >
                ⓘ
              </span>
              <span v-if="material.usesBulk" class="bulk">bulk</span>
            </div>
            <div class="item-qty">
              x{{
                material.type === 'concrete'
                  ? concreteBagsNeeded
                  : material.type === 'rebar'
                    ? rebarCalculation.poles
                    : material.type === 'gravel'
                      ? material.quantity
                      : material.type === 'wood'
                        ? woodCalculation.boards
                        : material.type === 'sealer'
                          ? material.quantity
                          : 0
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-label">Area:</span>
          <span class="stat-value">{{ foundationArea }} sq ft</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Estimated cost:</span>
          <span class="stat-value">${{ estimatedCost }}</span>
        </div>
      </div>
    </div>
  </div>

  <div id="main" :style="{ marginLeft: mainMargin }">
    <HomePageMain
      :isOpen="isOpen"
      :blockSqFt="blockSqFt"
      :foundationThickness="foundationThickness"
      @block-added="addBlock"
      @block-removed="removeBlock"
    />
  </div>

  <div
    v-if="tooltipData.visible"
    class="floating-tooltip"
    :style="{ top: tooltipData.y + 'px', left: tooltipData.x + 'px' }"
  >
    {{ tooltipData.text }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import HomePageMain from '../components/Home/HomePageMain.vue'

const isOpen = ref(true)
const sidebarWidth = computed(() => isOpen.value ? '250px' : '0px')
const openBtnPosition = computed(() => isOpen.value ? '250px' : '0px')
const mainMargin = computed(() => isOpen.value ? '250px' : '0px')
const loadingMaterials = ref(false);

const placedBlocks = ref(new Set());
const blockCount = ref(0)
const blockSqFt = ref(4)
const foundationThickness = ref(8) // default 8 inches

const allMaterials = ref({});

// Rebar
const rebarSpacing = ref(12);
const poleLength = ref(10);
const rebarSize = ref('#4');
const sizeMap = {
  '#3': ['3/8', '0.375'],
  '#4': ['1/2', '0.5'],
  '#5': ['5/8', '0.625'],
  '#6': ['3/4', '0.75']
};

const rebarCalculation = computed(() => {
  const spacingFeet = rebarSpacing.value / 12;
  const lengthPerPole = poleLength.value;
  const area = foundationArea.value;

  if (area <= 0 || rebarSpacing.value < 1 || lengthPerPole <= 0) {
    return { totalLength: 0, poles: 0, barCount: 0 };
  }

  const sideLength = Math.sqrt(area); // assume square slab
  const barCountPerDirection = Math.ceil(sideLength / spacingFeet) + 1;
  const totalBars = barCountPerDirection * 2;

  const totalRebarLength = totalBars * sideLength;

  const overlapPerJoint = 1; // ft
  const overlapCount = totalBars;
  const adjustedLength = totalRebarLength + overlapCount * overlapPerJoint;

  const polesNeeded = Math.ceil(adjustedLength / lengthPerPole);

  return {
    totalLength: Math.round(adjustedLength),
    poles: polesNeeded,
    barCount: totalBars
  };
});

// Concrete
const concreteBagWeight = ref(80);
const concreteBagsNeeded = computed(() => {
  const area = foundationArea.value;
  const thicknessFeet = foundationThickness.value / 12;
  const volume = area * thicknessFeet; // cubic feet
  return Math.ceil(volume / concreteYieldPerBag.value);
});

const concreteYieldPerBag = computed(() => {
  const yields = {
    50: 0.375,
    60: 0.45,
    80: 0.6
  };
  return yields[concreteBagWeight.value] || 0.6;
});

// Wood
const woodSize = ref('2x4');
const woodLength = ref(10);

const woodCalculation = computed(() => {
  const blockSizeFeet = Math.sqrt(blockSqFt.value);
  let edgeCount = 0;

  const directions = [
    [0, 1],  // north
    [0, -1], // south
    [1, 0],  // east
    [-1, 0]  // west
  ];

  const hasBlock = (x, z) => placedBlocks.value.has(`${x},${z}`);

  for (const key of placedBlocks.value) {
    const [x, z] = key.split(',').map(Number);
    for (const [dx, dz] of directions) {
      if (!hasBlock(x + dx, z + dz)) {
        edgeCount++;
      }
    }
  }

  const totalFeet = edgeCount * blockSizeFeet;
  const boardsNeeded = Math.ceil(totalFeet / woodLength.value);

  return {
    edges: edgeCount,
    linearFeet: Math.round(totalFeet),
    boards: boardsNeeded
  };
});

// Gravel
const gravelDepth = ref(6);

const gravelCalculation = computed(() => {
  const area = foundationArea.value;
  const depthFeet = gravelDepth.value / 12;
  const totalCubicFeet = area * depthFeet;

  return {
    volumeCubicFeet: Math.ceil(totalCubicFeet), // round up for safety
  };
});

const extractVolumeFromTitle = (title) => {
  const cuFtMatch = title.match(/(\d+(\.\d+)?)\s*cu\.?\s*ft/i);
  return cuFtMatch ? parseFloat(cuFtMatch[1]) : null;
};

// Sealer
const sealerCoveragePerGallon = 300 // sq ft per gallon (can be made user-configurable)
const concreteSealerCalculation = computed(() => {
  const area = foundationArea.value
  const gallonsNeeded = area / sealerCoveragePerGallon
  return {
    gallons: gallonsNeeded,
  }
})

const materialSpecs = computed(() => ({
  foundation: [
    {
      name: 'rebar',
      query: `rebar ${rebarSize.value} ${poleLength.value}ft`,
      quantity: rebarCalculation.value.poles,
      sizeAliases: sizeMap[rebarSize.value] || []
    },
    {
      name: 'concrete',
      query: `high strength concrete mix ${concreteBagWeight.value} lb`,
      quantity: concreteBagsNeeded.value,
      sizeAliases: []
    },
    {
      name: 'wood',
      query: `${woodSize.value} pressure treated lumber ${woodLength.value}ft`,
      quantity: woodCalculation.value.boards,
    },
    {
      name: 'gravel',
      query: `drainage gravel bulk bag ton`,
      quantity: gravelCalculation.value.tons
    },
    {
      name: 'sealer',
      query: 'water sealers concrete sealer clear',
      quantity: concreteSealerCalculation.value.gallons
    }
  ],
  // add 'drywall', 'roofing', etc. here in the future
}));

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

const filteredMaterials = computed(() => {
  const foundationMaterials = materialSpecs.value.foundation.map(spec => {
    const raw = allMaterials.value[spec.name] || [];

    const processed = raw
      .filter(m => {
        if (spec.name === 'rebar') {
          const lengthMatch = m.title.match(/(\d+)\s*ft/);
          if (!lengthMatch) return false;
          if (parseInt(lengthMatch[1]) !== poleLength.value) return false;

          const titleLower = m.title.toLowerCase();
          return titleLower.includes(rebarSize.value.toLowerCase()) ||
            spec.sizeAliases.some(alias => titleLower.includes(alias));
        }

        if (spec.name === 'concrete') {
          const title = m.title.toLowerCase();
          const weightMatch = title.match(/(\d+)\s*(lb|lbs)/i);
          if (!weightMatch) return false;
          const weight = parseInt(weightMatch[1]);
          if (weight !== concreteBagWeight.value) return false;
        }

        if (spec.name === 'wood') {
          const title = m.title.toLowerCase();

          const dims = title.match(/(\d+)\s*in\.\s*x\s*(\d+)\s*in\./);
          const lengthMatch = title.match(/(\d+)\s*ft/);

          if (!dims || !lengthMatch) return false;

          const [ , width, height ] = dims.map(Number);
          const matchedLength = parseInt(lengthMatch[1]);

          const [expectedW, expectedH] = woodSize.value.split('x').map(Number);

          return (
            matchedLength === woodLength.value &&
            ((width === expectedW && height === expectedH) ||
             (width === expectedH && height === expectedW)) // account for flipped dimensions
          );
        }

        return true; // pass through for other materials
      })
    .map(m => {
      const regularPrice = parseFloat(m.price?.replace(/[^0-9.]/g, '') || 'Infinity');
      const bulkQty = parseInt(m.bulkPricing?.quantity) || Infinity;
      const bulkPrice = parseFloat(m.bulkPricing?.price?.replace(/[^0-9.]/g, '')) || Infinity;

      if (spec.name === 'gravel') {
        const volumePerUnit = extractVolumeFromTitle(m.title) || 0.5; // fallback
        const quantityNeeded = Math.ceil(gravelCalculation.value.volumeCubicFeet / volumePerUnit);

        return {
          ...m,
          type: 'gravel',
          quantity: quantityNeeded,
          priceNumber: regularPrice,
          bulkPrice,
          effectivePrice: quantityNeeded >= bulkQty ? bulkPrice : regularPrice,
          usesBulk: quantityNeeded >= bulkQty
        };
      }

      if (spec.name === 'sealer') {
        const titleLower = m.title.toLowerCase()

        let unitGallons = 1 // default to 1 gallon
        if (titleLower.includes('5 gallon')) unitGallons = 5
        else if (titleLower.includes('1 gallon')) unitGallons = 1
        else if (titleLower.includes('quart')) unitGallons = 0.25

        const quantityNeeded = Math.ceil(spec.quantity / unitGallons)

        return {
          ...m,
          type: 'sealer',
          quantity: quantityNeeded,
          priceNumber: regularPrice,
          bulkPrice,
          effectivePrice: quantityNeeded >= bulkQty ? bulkPrice : regularPrice,
          usesBulk: quantityNeeded >= bulkQty
        }
      }

      return {
        ...m,
        type: spec.name,
        quantity: spec.quantity,
        priceNumber: regularPrice,
        bulkPrice,
        effectivePrice: spec.quantity >= bulkQty ? bulkPrice : regularPrice,
        usesBulk: spec.quantity >= bulkQty
      };
    })

      .filter(m => isFinite(m.effectivePrice))
      .sort((a, b) => a.effectivePrice - b.effectivePrice);

    return processed.length ? processed[0] : null;
  });

  return foundationMaterials.filter(Boolean);
});

const fetchAllMaterials = async () => {
  loadingMaterials.value = true;
  try {
    const urls = materialSpecs.value.foundation.map(material => {
      return `https://www.homedepot.com/s/${encodeURIComponent(material.query)}?NCNI-5`;
    });

    const apiURL = `http://localhost:3001/api/materials?${urls.map(u => `urls=${encodeURIComponent(u)}`).join('&')}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    // Map materials back to their types by query
    const fetched = {};
    materialSpecs.value.foundation.forEach((spec, i) => {
      const url = urls[i];
      fetched[spec.name] = data[url] || [];
    });

    allMaterials.value = fetched;
  } catch (err) {
    console.error('Failed to fetch materials:', err);
  } finally {
    loadingMaterials.value = false;
  }
};

const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))
const estimatedCost = computed(() => {
  return filteredMaterials.value.reduce((total, material) => {
    return total + (material.effectivePrice * material.quantity);
  }, 0).toFixed(2);
});

const toggleNav = () => {
  isOpen.value = !isOpen.value
}

const addBlock = (x, z) => {
  blockCount.value++
  placedBlocks.value.add(`${x},${z}`);
};

const removeBlock = (x, z) => {
  blockCount.value--
  placedBlocks.value.delete(`${x},${z}`);
};

const tooltipData = ref({ visible: false, x: 0, y: 0, text: '' });

const showTooltip = (event, material) => {
  tooltipData.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY - 20, // raise it slightly
    text: `Bulk price ${material.bulkPricing.price} for ${material.bulkPricing.quantity}+`
  };
};

const hideTooltip = () => {
  tooltipData.value.visible = false;
};

onMounted(fetchAllMaterials);
watch(
  [rebarSize, poleLength, concreteBagWeight, woodSize, woodLength, gravelDepth],
  fetchAllMaterials
);
</script>

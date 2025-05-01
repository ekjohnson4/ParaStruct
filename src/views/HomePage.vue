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
      <div class="navbar-brand">ParaStruct</div>
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
      <div class="config-content">
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
            <div id="collapseConcrete" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
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
            <div id="collapseRebar" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
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
              x{{ material.type === 'concrete' ? concreteBagsNeeded : rebarCalculation.poles }}
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
      @block-added="incrementBlocks"
      @block-removed="decrementBlocks"
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

const blockCount = ref(0)
const blockSqFt = ref(4)
const foundationThickness = ref(8) // default 8 inches

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

const concreteYieldPerBag = computed(() => {
  const yields = {
    50: 0.375,
    60: 0.45,
    80: 0.6
  };
  return yields[concreteBagWeight.value] || 0.6;
});

//Concrete
const concreteBagWeight = ref(80);
const concreteBagsNeeded = computed(() => {
  const area = foundationArea.value;
  const thicknessFeet = foundationThickness.value / 12;
  const volume = area * thicknessFeet; // cubic feet
  return Math.ceil(volume / concreteYieldPerBag.value);
});


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
    }
  ],
  // add 'drywall', 'roofing', etc. here in the future
}));

const getMaterialImage = (type) => {
  switch (type) {
    case 'concrete':
      return new URL('../assets/concrete.webp', import.meta.url).href;
    case 'rebar':
    default:
      return new URL('../assets/rebar.webp', import.meta.url).href;
  }
};

const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))
const estimatedCost = computed(() => {
  return filteredMaterials.value.reduce((total, material) => {
    return total + (material.effectivePrice * material.quantity);
  }, 0).toFixed(2);
});

const allMaterials = ref({});
const loadingMaterials = ref(false);

const toggleNav = () => {
  isOpen.value = !isOpen.value
}

const incrementBlocks = () => {
  blockCount.value++
}

const decrementBlocks = () => {
  blockCount.value--
}

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

        return true; // pass through for other materials like concrete
      })
      .map(m => {
        const regularPrice = parseFloat(m.price?.replace(/[^0-9.]/g, '') || 'Infinity');
        const bulkQty = parseInt(m.bulkPricing?.quantity) || Infinity;
        const bulkPrice = parseFloat(m.bulkPricing?.price?.replace(/[^0-9.]/g, '')) || Infinity;
        const effectivePrice = spec.quantity >= bulkQty ? bulkPrice : regularPrice;

        return {
          ...m,
          type: spec.name,
          quantity: spec.quantity,
          priceNumber: regularPrice,
          bulkPrice,
          effectivePrice,
          usesBulk: spec.quantity >= bulkQty
        };
      })
      .filter(m => isFinite(m.effectivePrice))
      .sort((a, b) => a.effectivePrice - b.effectivePrice);

    return processed.length ? processed[0] : null;
  });

  return foundationMaterials.filter(Boolean);
});

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

const fetchAllMaterials = async () => {
  loadingMaterials.value = true;
  try {
    const fetched = {};
    for (const material of materialSpecs.value.foundation) {
      const url = `https://www.homedepot.com/s/${encodeURIComponent(material.query)}?NCNI-5`;
      const res = await fetch(`http://localhost:3001/api/materials?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      fetched[material.name] = data;
    }
    allMaterials.value = fetched;
  } catch (err) {
    console.error('Failed to fetch materials:', err);
  } finally {
    loadingMaterials.value = false;
  }
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
watch([rebarSize, poleLength, concreteBagWeight], fetchAllMaterials);
</script>

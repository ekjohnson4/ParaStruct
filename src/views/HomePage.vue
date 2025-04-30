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

      <div class="materials-container">
        <div class="materials-wrapper">
          <div v-if="loadingMaterials" class="spinner"></div>
          <div
            v-else
            class="item"
            v-for="(material, index) in filteredMaterials"
            :key="index"
          >
            <div
              class="item"
              v-for="(material, index) in filteredMaterials"
              :key="index"
            >
              <img
                class="item-img"
                src="../assets/rebar.webp"
                alt="Product Image"
              />
              <a class="item-title" :href="material.link"><strong>{{ material.title }}</strong></a>
              <div class="item-price">
                {{ material.usesBulk ? material.bulkPricing.price : material.price }}
                <span v-if="material.usesBulk" style="color: green; font-size: 11px;">bulk</span>
              </div>
              <div class="item-qty">
                x{{ rebarCalculation.poles }}<br />
              </div>
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import HomePageMain from '../components/Home/HomePageMain.vue'

const isOpen = ref(true)
const blockCount = ref(0)
const blockSqFt = ref(4)
const foundationThickness = ref(8) // default 8 inches
const rebarSpacing = ref(12);
const poleLength = ref(10);
const rebarSize = ref('#4');
const sizeMap = {
  '#3': ['3/8', '0.375'],
  '#4': ['1/2', '0.5'],
  '#5': ['5/8', '0.625'],
  '#6': ['3/4', '0.75']
};

const sidebarWidth = computed(() => isOpen.value ? '250px' : '0px')
const openBtnPosition = computed(() => isOpen.value ? '250px' : '0px')
const mainMargin = computed(() => isOpen.value ? '250px' : '0px')

const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))
const estimatedCost = computed(() => {
  const selected = filteredMaterials.value[0];
  if (!selected) return 0;

  const poles = rebarCalculation.value.poles;
  return (selected.effectivePrice * poles).toFixed(2);
});


const materials = ref([]);
const loadingMaterials = ref(false);

const generateSearchUrl = () => {
  const sizeEncoded = encodeURIComponent(rebarSize.value);  // "#4" → "%234"
  const lengthStr = `${poleLength.value}ft`;
  const query = `rebar ${sizeEncoded} ${lengthStr}`;
  return `https://www.homedepot.com/s/${encodeURIComponent(query)}?NCNI-5`;
};

onMounted(async () => {
  try {
    const searchUrl = generateSearchUrl();
    const res = await fetch(`http://localhost:3001/api/materials?url=${encodeURIComponent(searchUrl)}`);
    const data = await res.json();
    materials.value = data;
  } catch (err) {
    console.error('Error fetching materials:', err);
  }
});


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
  const selectedSize = rebarSize.value;
  const sizeAliases = sizeMap[selectedSize] || [];
  const polesNeeded = rebarCalculation.value.poles;

  const matches = materials.value
    .filter((material) => {
      const lengthMatch = material.title.match(/(\d+)\s*ft/);
      if (!lengthMatch) return false;
      const materialLength = parseInt(lengthMatch[1]);
      if (materialLength !== poleLength.value) return false;

      const titleLower = material.title.toLowerCase();
      const matchesSize =
        titleLower.includes(selectedSize.toLowerCase()) ||
        sizeAliases.some(alias => titleLower.includes(alias));

      return matchesSize;
    })
    .map((material) => {
      const regularPrice = parseFloat(
        material.price?.replace(/[^0-9.]/g, '') || 'Infinity'
      );

      const hasBulk = material.bulkPricing && material.bulkPricing.quantity && material.bulkPricing.price;
      const bulkQty = hasBulk ? parseInt(material.bulkPricing.quantity) : Infinity;
      const bulkPrice = hasBulk ? parseFloat(material.bulkPricing.price.replace(/[^0-9.]/g, '')) : Infinity;

      const effectivePrice = polesNeeded >= bulkQty ? bulkPrice : regularPrice;

      return {
        ...material,
        priceNumber: regularPrice,
        bulkPrice,
        effectivePrice,
        usesBulk: polesNeeded >= bulkQty
      };
    })
    .filter(m => isFinite(m.effectivePrice))
    .sort((a, b) => a.effectivePrice - b.effectivePrice);

  return matches.length ? [matches[0]] : [];
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

const fetchMaterials = async () => {
  loadingMaterials.value = true;
  try {
    const searchUrl = generateSearchUrl();
    const res = await fetch(`http://localhost:3001/api/materials?url=${encodeURIComponent(searchUrl)}`);
    const data = await res.json();
    materials.value = data;
  } catch (err) {
    console.error('Error fetching materials:', err);
  } finally {
    loadingMaterials.value = false;
  }
};


onMounted(fetchMaterials);
watch([rebarSize, poleLength], fetchMaterials);
</script>

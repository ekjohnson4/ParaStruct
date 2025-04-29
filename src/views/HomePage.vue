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
      </div>

      <div class="materials-container">
        <div class="materials-wrapper">
          <div
            class="item"
            v-for="(material, index) in materials"
            :key="index"
          >
            <img src="material.imageUrl" alt="Product Image" style="width: 100px; height: auto;">
            <div><strong>{{ material.title }}</strong></div>
            <div>Price: {{ material.price }}</div>
            <div v-if="material.bulkPricing">
              Bulk ({{ material.bulkPricing.quantity }}+): {{ material.bulkPricing.price }}
            </div>
            <a :href="material.link" target="_blank">View Product</a>
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
import { ref, computed, onMounted } from 'vue'
import HomePageMain from '../components/Home/HomePageMain.vue'

const CONCRETE_COST_PER_SQFT = 6 // Cost per square foot of concrete

const isOpen = ref(true)
const blockCount = ref(0)
const blockSqFt = ref(4)
const foundationThickness = ref(8) // default 8 inches

const sidebarWidth = computed(() => isOpen.value ? '250px' : '0px')
const openBtnPosition = computed(() => isOpen.value ? '250px' : '0px')
const mainMargin = computed(() => isOpen.value ? '250px' : '0px')

const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))
const estimatedCost = computed(() => foundationArea.value * CONCRETE_COST_PER_SQFT)

const materials = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/materials?url=https://www.homedepot.com/b/Building-Materials-Concrete-Cement-Masonry-Rebar-Accessories-Rebar/N-5yc1vZ1z18g8s');
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
</script>

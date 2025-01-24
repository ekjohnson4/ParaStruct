<template>
  <div
    id="mySidebar"
    class="sidebar"
    :style="{ width: sidebarWidth }"
    @pointerdown.stop
    @click.stop
  >
    <div class="sidebar-content">
      <h2>Stats</h2>
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
        <span class="stat-label">Area:</span>
        <span class="stat-value">{{ foundationArea }} sq ft</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Estimated cost:</span>
        <span class="stat-value">${{ estimatedCost }}</span>
      </div>
    </div>
  </div>

  <button
    class="openbtn"
    :style="{ left: openBtnPosition }"
    @click.stop="toggleNav"
    @pointerdown.stop
  >
    {{ isOpen ? 'x' : '☰' }}
  </button>

  <div id="main" :style="{ marginLeft: mainMargin }">
    <HomePageMain
      msg="Ethan Time"
      :isOpen="isOpen"
      @block-added="incrementBlocks"
      @block-removed="decrementBlocks"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HomePageMain from '../components/Home/HomePageMain.vue'

const CONCRETE_COST_PER_SQFT = 6 // Cost per square foot of concrete

const isOpen = ref(false)
const blockCount = ref(0)
const blockSqFt = ref(4)
const foundationThickness = ref(8) // default 8 inches

const sidebarWidth = computed(() => isOpen.value ? '250px' : '0px')
const openBtnPosition = computed(() => isOpen.value ? '250px' : '0px')
const mainMargin = computed(() => isOpen.value ? '250px' : '0px')

const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))
const estimatedCost = computed(() => foundationArea.value * CONCRETE_COST_PER_SQFT)

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

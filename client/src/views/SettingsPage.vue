<template>
  <header class="navbar navbar-default">
    <nav class="container-fluid d-flex align-items-center justify-content-between">
      <div class="navbar-header d-flex align-items-center">
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

  <div class="settings-container">
    <div class="settings-section">
      <h1 class="settings-title">
        Local Pricing
        <span class="info-icon-container">
          <font-awesome-icon
            icon="info"
            class="info-icon"
            ref="localPricingTooltip"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            data-bs-title="Set custom prices for materials in your local area. These prices will be used for cost calculations throughout the app."
          />
        </span>
      </h1>
      <div class="settings-body">
        <ul class="settings-body-content">
          <li
            v-for="item in localPrices"
            :key="item.id"
            class="settings-list-item"
          >
            <div class="row align-items-center">
              <div class="col">
                <span class="settings-item-title">{{ item.name }}</span>
              </div>
              <div class="col item-price-container align-items-center justify-content-end">
                <div class="dollar">
                  $
                </div>
                <input
                  v-model.number="item.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control item-price-field"
                  placeholder="e.g. 1.25"
                />
                <span class="unit-label item-price-text justify-content-start">per {{ item.unit }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="settings-section">
      <h1 class="settings-title">
        Learner Mode
        <span class="info-icon-container">
          <font-awesome-icon
            icon="info"
            class="info-icon"
            ref="learnerModeTooltip"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            data-bs-title="Toggle between Learner Mode (with helpful explanations and guidance) and Experienced Mode (streamlined interface for advanced users)."
          />
        </span>
      </h1>
      <div class="settings-body">
        <ul class="settings-body-content">
          <li class="settings-list-item">
            <div class="row align-items-center">
              <div class="col">
                <label class="settings-item-title" for="learnerModeToggle">
                  Learner Mode
                </label>
              </div>
              <div class="col item-price-container align-items-center justify-content-end form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="learnerModeToggle"
                  v-model="learnerModeToggle"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <button @click="store.hasCompletedIntro = false" class="btn btn-warning mt-3">
        Reset Intro (for testing)
      </button>
      <button @click="store.hasSeenVideo = false" class="btn btn-warning mt-3">
        Reset Video (for testing)
      </button>

    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue'
import { useMaterialsStore } from '../stores/materials'
import { Tooltip } from 'bootstrap'

const store = useMaterialsStore()

const localPrices = reactive([
  { id: 'REBAR', name: 'Rebar', price: null, unit: 'unit' },
  { id: 'CONCRETE', name: 'Concrete', price: null, unit: 'unit' },
  { id: 'WOOD', name: 'Wood', price: null, unit: 'unit' },
  { id: 'GRAVEL', name: 'Gravel', price: null, unit: 'unit' },
  { id: 'SEALER', name: 'Sealer', price: null, unit: 'unit' }
])

// Computed property to handle the inverted toggle
const learnerModeToggle = computed({
  get: () => !store.isExperienced,
  set: (value) => {
    store.isExperienced = !value
  }
})

// Tooltip refs
const localPricingTooltip = ref(null)
const learnerModeTooltip = ref(null)

// On mount, populate localPrices from the store and initialize tooltips
onMounted(() => {
  localPrices.forEach(item => {
    const storeVal = store.localPrices[item.id.toLowerCase()]
    item.price = typeof storeVal === 'number' ? storeVal : null
  })

  // Initialize Bootstrap tooltips
  if (localPricingTooltip.value) {
    new Tooltip(localPricingTooltip.value.$el)
  }
  if (learnerModeTooltip.value) {
    new Tooltip(learnerModeTooltip.value.$el)
  }
})

// Update store whenever localPrices change
watch(localPrices, (newPrices) => {
  store.setLocalPrices(newPrices)
}, { deep: true })
</script>

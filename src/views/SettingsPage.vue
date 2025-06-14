<template>
  <header class="navbar navbar-default">
    <nav class="container-fluid d-flex align-items-center justify-content-between">
      <div class="navbar-header d-flex align-items-center">
        <router-link to="/" class="navbar-brand">
          <img class="logo" src="../assets/ParaStructBeta_Logo_Text.webp" />
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
      <h1 class="settings-title">Local Pricing</h1>
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
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useMaterialsStore } from '../stores/materials'

const store = useMaterialsStore()

const localPrices = reactive([
  { id: 'REBAR', name: 'Rebar', price: null, unit: 'ft' },
  { id: 'CONCRETE', name: 'Concrete', price: null, unit: 'pound' },
  { id: 'WOOD', name: 'Wood', price: null, unit: 'ft' },
  { id: 'GRAVEL', name: 'Gravel', price: null, unit: 'cu. ft.' },
  { id: 'SEALER', name: 'Sealer', price: null, unit: 'gallon' }
])

// On mount, populate localPrices from the store
onMounted(() => {
  localPrices.forEach(item => {
    const storeVal = store.localPrices[item.id.toLowerCase()]
    item.price = typeof storeVal === 'number' ? storeVal : null
  })
})

// Update store whenever localPrices change
watch(localPrices, (newPrices) => {
  store.setLocalPrices(newPrices)
}, { deep: true })
</script>

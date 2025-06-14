import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMaterialsStore = defineStore('materials', () => {
  const allMaterials = ref({})
  const localPrices = ref({})

  const setAllMaterials = (data) => {
    allMaterials.value = data
  }

  const setLocalPrices = (prices) => {
    const updated = {}
    prices.forEach(item => {
      const key = item.id.toLowerCase()
      const value = parseFloat(item.price)
      updated[key] = isNaN(value) ? null : value
    })
    localPrices.value = updated
  }

  return {
    allMaterials,
    localPrices,
    setAllMaterials,
    setLocalPrices
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMaterialsStore = defineStore('materials', () => {
  const allMaterials = ref({})
  const localPrices = ref({})
  const hasCompletedIntro = ref(false)
  const hasSeenVideo = ref(false)
  const isExperienced = ref(false)

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

  const setIntroAnswer = (experienced) => {
    isExperienced.value = experienced
    hasCompletedIntro.value = true
  }

  const setVideoAnswer = () => {
    hasSeenVideo.value = true
  }

  return {
    allMaterials,
    localPrices,
    setAllMaterials,
    setLocalPrices,
    hasCompletedIntro,
    hasSeenVideo,
    isExperienced,
    setIntroAnswer,
    setVideoAnswer
  }
}, {
  persist: {
    key: 'materials',
    paths: ['localPrices']
  }
})

import { computed } from 'vue'
import { useMaterialsStore } from '../stores/materials'

export function useMaterialProcessing(calculations) {
  const store = useMaterialsStore()

  const materialToggles = {
    concrete: true,
    rebar: true,
    wood: true,
    gravel: true,
    sealer: true
  }

  const materialSpecs = computed(() => ({
    foundation: [
      materialToggles.rebar && {
        name: 'rebar',
        query: `rebar ${calculations.rebarSize.value} ${calculations.poleLength.value}ft`,
        quantity: calculations.rebarCalculation.value.poles,
        sizeAliases: calculations.sizeMap[calculations.rebarSize.value] || []
      },
      materialToggles.concrete && {
        name: 'concrete',
        query: `high strength concrete mix ${calculations.concreteBagWeight.value} lb`,
        quantity: calculations.concreteBagsNeeded.value
      },
      materialToggles.wood && {
        name: 'wood',
        query: `${calculations.woodSize.value} pressure treated lumber ${calculations.woodLength.value}ft`,
        quantity: calculations.woodCalculation.value.boards
      },
      materialToggles.gravel && {
        name: 'gravel',
        query: 'drainage gravel bulk bag ton',
        quantity: calculations.gravelCalculation.value.volumeCubicFeet
      },
      materialToggles.sealer && {
        name: 'sealer',
        query: 'water sealers concrete sealer clear',
        quantity: calculations.concreteSealerCalculation.value.gallons
      }
    ].filter(Boolean)
  }))

  const filterMaterial = (material, spec) => {
    const filters = {
      rebar: (m) => {
        const lengthMatch = m.title.match(/(\d+)\s*ft/)
        if (!lengthMatch || parseInt(lengthMatch[1]) !== calculations.poleLength.value) return false

        const titleLower = m.title.toLowerCase()
        return titleLower.includes(calculations.rebarSize.value.toLowerCase()) ||
               spec.sizeAliases.some(alias => titleLower.includes(alias))
      },

      concrete: (m) => {
        const weightMatch = m.title.match(/(\d+)\s*(lb|lbs)/i)
        return weightMatch && parseInt(weightMatch[1]) === calculations.concreteBagWeight.value
      },

      wood: (m) => {
        const dims = m.title.match(/(\d+)\s*in\.\s*x\s*(\d+)\s*in\./)
        const lengthMatch = m.title.match(/(\d+)\s*ft/)

        if (!dims || !lengthMatch) return false

        const [, width, height] = dims.map(Number)
        const matchedLength = parseInt(lengthMatch[1])
        const [expectedW, expectedH] = calculations.woodSize.value.split('x').map(Number)

        return matchedLength === calculations.woodLength.value &&
               ((width === expectedW && height === expectedH) ||
                (width === expectedH && height === expectedW))
      }
    }

    return filters[spec.name] ? filters[spec.name](material) : true
  }

  const processMaterial = (material, spec) => {
    const regularPrice = parseFloat(material.price?.replace(/[^0-9.]/g, '') || 'Infinity')
    const bulkQty = parseInt(material.bulkPricing?.quantity) || Infinity
    const bulkPrice = parseFloat(material.bulkPricing?.price?.replace(/[^0-9.]/g, '')) || Infinity
    const localOverride = store.localPrices[spec.name]
    const isUsingLocal = localOverride != null

    let quantity = spec.quantity
    let unitGallons = 1

    // Special processing for gravel and sealer
    if (spec.name === 'gravel') {
      const volumePerUnit = extractVolumeFromTitle(material.title) || 0.5
      quantity = Math.ceil(calculations.gravelCalculation.value.volumeCubicFeet / volumePerUnit)
    } else if (spec.name === 'sealer') {
      const titleLower = material.title.toLowerCase()
      if (titleLower.includes('5 gallon')) unitGallons = 5
      else if (titleLower.includes('quart')) unitGallons = 0.25
      quantity = Math.ceil(spec.quantity / unitGallons)
    }

    const effectivePrice = isUsingLocal ? localOverride :
                          (quantity >= bulkQty ? bulkPrice : regularPrice)

    const displayPrice = isUsingLocal ? `$${localOverride.toFixed(2)}` :
                        (quantity >= bulkQty ? material.bulkPricing?.price : material.price)

    return {
      ...material,
      type: spec.name,
      quantity,
      priceNumber: regularPrice,
      bulkPrice,
      effectivePrice,
      displayPrice,
      usesBulk: !isUsingLocal && quantity >= bulkQty,
      isLocal: isUsingLocal,
      title: isUsingLocal ? getLocalTitle(spec.name, spec) : material.title,
      link: isUsingLocal ? null : material.link
    }
  }

  const filteredMaterials = computed(() => {
    return materialSpecs.value.foundation.map(spec => {
      const raw = store.allMaterials[spec.name] || []

      const processed = raw
        .filter(m => filterMaterial(m, spec))
        .map(m => processMaterial(m, spec))
        .filter(m => isFinite(m.effectivePrice))
        .sort((a, b) => a.effectivePrice - b.effectivePrice)

      return processed.length ? processed[0] : null
    }).filter(Boolean)
  })

  const estimatedCost = computed(() => {
    return filteredMaterials.value.reduce((total, material) => {
      return total + (material.effectivePrice * material.quantity)
    }, 0).toFixed(2)
  })

  const extractVolumeFromTitle = (title) => {
    const cuFtMatch = title.match(/(\d+(\.\d+)?)\s*cu\.?\s*ft/i)
    return cuFtMatch ? parseFloat(cuFtMatch[1]) : null
  }

  const getLocalTitle = (type, spec) => {
    const titles = {
      rebar: `${calculations.rebarSize.value} ${calculations.poleLength.value} ft. Rebar`,
      concrete: `${calculations.concreteBagWeight.value} lb Concrete Mix`,
      wood: `${calculations.woodSize.value} ${calculations.woodLength.value} Ft Lumber`,
      gravel: `Gravel (${spec.volumePerUnit ?? 0.5} cu. ft. per unit)`,
      sealer: `Concrete sealer (${spec.unitSize ?? 1} gal per unit)`
    }
    return titles[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  return {
    materialSpecs,
    filteredMaterials,
    estimatedCost,
    materialToggles
  }
}
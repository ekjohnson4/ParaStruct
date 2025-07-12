import { computed } from 'vue'

export function useFoundationSummary(calculations, materials) {
  // Analysis functions
  const getThicknessAnalysis = () => {
    const thickness = calculations.foundationThickness.value

    const recommendations = {
      4: {use: 'patios, walkways, sidewalks'},
      5: {use: 'garden sheds, light storage, small workshops'},
      6: {use: 'garages, workshops, residential driveways'},
      7: {use: 'heavy residential, light commercial'},
      8: {use: 'heavy equipment, commercial driveways'},
      9: {use: 'commercial/industrial, heavy loads'},
      10: {use: 'heavy-duty commercial, freeze-thaw areas'},
      12: {use: 'extreme loads, industrial, poor soil conditions'}
    }

    // Handle custom thicknesses
    if (!recommendations[thickness]) {
      if (thickness < 4) {
        return {
          use: 'not recommended',
          concern: 'Too thin for most applications. Minimum 4" recommended.'
        }
      } else if (thickness > 12) {
        return {
          use: 'specialized engineering application',
          concern: 'Requires professional engineering design.'
        }
      } else {
        return {
          use: 'custom application',
          concern: 'Unusual thickness - verify with local building codes.'
        }
      }
    }

    return recommendations[thickness]
  }

const getWoodSizeAnalysis = () => {
  const woodSize = calculations.woodSize.value
  const thickness = calculations.foundationThickness.value
  const woodHeight = parseInt(woodSize.split('x')[1])

  let analysis = { status: 'good', message: null }

  if (woodHeight < thickness) {
    analysis = {
      status: 'warning',
      message: `${woodSize} lumber is smaller than ${thickness}" slab thickness. May need additional support or backfill.`
    }
  } else if (woodHeight === thickness) {
    analysis = {
      status: 'good',
      message: `${woodSize} lumber matches ${thickness}" slab thickness perfectly.`
    }
  } else if (woodHeight > thickness && woodHeight <= thickness + 2) {
    analysis = {
      status: 'good',
      message: `${woodSize} lumber is appropriate for ${thickness}" slab thickness.`
    }
  } else if (woodHeight > thickness + 2) {
    analysis = {
      status: 'info',
      message: `${woodSize} lumber is larger than needed for ${thickness}" slab. Could use smaller size to save money.`
    }
  }

  return analysis
}

  const getRebarAnalysis = () => {
    const area = calculations.foundationArea.value
    const thickness = calculations.foundationThickness.value
    const spacing = calculations.rebarSpacing.value
    const size = calculations.rebarSize.value

    const analyses = []

    // Area-based recommendations
    if (area < 50) {
      analyses.push({
        type: 'info',
        message: 'Small slabs may not require rebar reinforcement in some areas.'
      })
    }

    // Comprehensive spacing analysis
    if (spacing <= 8) {
      analyses.push({
        type: 'warning',
        message: `${spacing}" spacing is very tight. This may be overbuilt and increase costs significantly.`
      })
    } else if (spacing > 8 && spacing < 12) {
      analyses.push({
        type: 'good',
        message: `${spacing}" spacing provides excellent crack control, good for heavy loads or poor soil.`
      })
    } else if (spacing === 12) {
      analyses.push({
        type: 'good',
        message: '12" spacing is standard for residential foundations and provides good crack control.'
      })
    } else if (spacing > 12 && spacing <= 16) {
      analyses.push({
        type: 'info',
        message: `${spacing}" spacing is acceptable for lighter loads but may allow more cracking than 12" spacing.`
      })
    } else if (spacing > 16 && spacing <= 18) {
      analyses.push({
        type: 'warning',
        message: `${spacing}" spacing is at the upper limit. Consider 12-16" for better crack control.`
      })
    } else if (spacing > 18 && spacing <= 24) {
      analyses.push({
        type: 'warning',
        message: `${spacing}" spacing is wide and may not provide adequate crack control. Consider 12-16" spacing.`
      })
    } else if (spacing > 24) {
      analyses.push({
        type: 'error',
        message: `${spacing}" spacing is too wide for most applications. Maximum recommended spacing is 18-24".`
      })
    }

    // Size analysis with improved recommendations
    const sizeRecommendations = {
      '#3': { minThickness: 4, maxThickness: 5, description: 'light residential' },
      '#4': { minThickness: 4, maxThickness: 8, description: 'standard residential' },
      '#5': { minThickness: 6, maxThickness: 10, description: 'heavy residential/light commercial' },
      '#6': { minThickness: 8, maxThickness: 12, description: 'heavy commercial/industrial' }
    }

    const sizeRec = sizeRecommendations[size]
    if (sizeRec) {
      if (thickness < sizeRec.minThickness) {
        analyses.push({
          type: 'warning',
          message: `${size} rebar may be oversized for ${thickness}" slab. Consider #3 or #4 for cost savings.`
        })
      } else if (thickness > sizeRec.maxThickness) {
        analyses.push({
          type: 'warning',
          message: `${size} rebar may be undersized for ${thickness}" slab. Consider larger rebar size.`
        })
      } else {
        analyses.push({
          type: 'good',
          message: `${size} rebar is appropriate for ${thickness}" slab (${sizeRec.description} applications).`
        })
      }
    }

    // Additional analysis for specific combinations
    if (thickness >= 8 && spacing > 16) {
      analyses.push({
        type: 'warning',
        message: 'Thick slabs with wide rebar spacing may develop cracks. Consider tighter spacing or larger rebar.'
      })
    }

    if (area > 300 && spacing > 16) {
      analyses.push({
        type: 'warning',
        message: 'Large slabs benefit from tighter rebar spacing (12-16") to control shrinkage cracks.'
      })
    }

    return analyses
  }

  const getGravelAnalysis = () => {
    const depth = calculations.gravelDepth.value

    let analysis = { status: 'good', message: null }

    if (depth < 4) {
      analysis = {
        status: 'warning',
        message: `${depth}" is below the recommended minimum. Consider 4-6" for better performance.`
      }
    } else if (depth >= 4 && depth < 6) {
      analysis = {
        status: 'good',
        message: `${depth}" meets minimum requirements. Standard depth for most applications.`
      }
    } else if (depth === 6) {
      analysis = {
        status: 'good',
        message: '6" is the standard gravel depth - excellent for most applications.'
      }
    } else if (depth > 6 && depth <= 8) {
      analysis = {
        status: 'good',
        message: `${depth}" provides excellent drainage and stability. Good for areas with poor soil.`
      }
    } else if (depth > 8 && depth <= 12) {
      analysis = {
        status: 'good',
        message: `${depth}" is a deep gravel bed. Excellent for poor drainage areas or freeze-thaw climates.`
      }
    } else if (depth > 12) {
      analysis = {
        status: 'info',
        message: `${depth}" is very deep. May be necessary for severe frost conditions or very poor soil.`
      }
    }

    return analysis
  }

  const getMaterialWasteAnalysis = () => {
    const wasteIssues = []

    // Wood waste analysis
    const woodCalc = calculations.woodCalculation.value
    const woodLength = calculations.woodLength.value
    const totalNeeded = woodCalc.linearFeet
    const totalBought = woodCalc.boards * woodLength
    const woodWaste = totalBought - totalNeeded

    if (woodWaste > totalNeeded * 0.3) {
      wasteIssues.push({
        material: 'Wood',
        message: `High waste: buying ${totalBought}ft but only need ${totalNeeded}ft. Consider different lumber lengths.`
      })
    }

    // Concrete waste analysis
    const concreteBags = calculations.concreteBagsNeeded.value
    const concreteVolume = calculations.foundationArea.value * (calculations.foundationThickness.value / 12)
    const actualYield = concreteBags * calculations.concreteYieldPerBag.value
    const concreteWaste = actualYield - concreteVolume

    if (concreteWaste > concreteVolume * 0.15) {
      wasteIssues.push({
        material: 'Concrete',
        message: `Significant concrete waste expected. Consider ordering ready-mix for projects over 2 cubic yards.`
      })
    }

    // Rebar waste analysis
    const rebarCalc = calculations.rebarCalculation.value
    const rebarLength = calculations.poleLength.value
    const totalRebarBought = rebarCalc.poles * rebarLength
    const totalRebarNeeded = rebarCalc.totalLength
    const rebarWaste = totalRebarBought - totalRebarNeeded

    if (rebarWaste > totalRebarNeeded * 0.2) {
      wasteIssues.push({
        material: 'Rebar',
        message: `Consider ${rebarLength > 10 ? 'shorter' : 'longer'} rebar lengths to reduce waste.`
      })
    }

    return wasteIssues
  }

  const getCostOptimizationSuggestions = () => {
    const suggestions = []
    const totalCost = parseFloat(materials.estimatedCost.value)

    // Cost-based suggestions
    if (totalCost > 1500) {
      suggestions.push('Consider renting equipment (mixer, wheelbarrow) for large projects')
      suggestions.push('Buy materials in bulk or check contractor pricing')
    }

    if (totalCost > 800) {
      suggestions.push('Consider ready-mix concrete delivery for projects over 2 cubic yards')
    }

    // Material-specific suggestions
    const filteredMaterials = materials.filteredMaterials.value
    filteredMaterials.forEach(material => {
      if (material.bulkPricing && !material.usesBulk && material.quantity > 1) {
        const bulkSavings = (material.priceNumber - material.bulkPrice) * material.quantity
        if (bulkSavings > 50) {
          suggestions.push(`Consider bulk pricing for ${material.type} - potential savings of $${bulkSavings.toFixed(2)}`)
        }
      }
    })

    return suggestions
  }

  const getSeasonalConsiderations = () => {
    const currentMonth = new Date().getMonth()
    const considerations = []

    if (currentMonth >= 10 || currentMonth <= 2) { // Winter
      considerations.push('Cold weather: Concrete needs protection below 40°F')
      considerations.push('Use cold-weather concrete mix if available')
      considerations.push('Consider frost protection for footings')
    } else if (currentMonth >= 5 && currentMonth <= 8) { // Summer
      considerations.push('Hot weather: Keep concrete moist and covered')
      considerations.push('Pour early morning or late evening in extreme heat')
      considerations.push('Have extra water available for curing')
    }

    return considerations
  }

  const getProjectComplexity = () => {
    const area = calculations.foundationArea.value
    const thickness = calculations.foundationThickness.value
    let complexity = 'Simple'
    let recommendations = []

    if (area > 500 || thickness > 8) {
      complexity = 'Complex'
      recommendations.push('Consider hiring a professional')
      recommendations.push('May require engineering review')
      recommendations.push('Building permit likely required')
    } else if (area > 200 || thickness > 6) {
      complexity = 'Moderate'
      recommendations.push('Building permit may be required')
      recommendations.push('Consider professional consultation')
    } else {
      recommendations.push('Good DIY project for beginners')
    }

    return { complexity, recommendations }
  }

  // Main summary computation
  const summary = computed(() => {
    const thicknessAnalysis = getThicknessAnalysis()
    const woodAnalysis = getWoodSizeAnalysis()
    const rebarAnalysis = getRebarAnalysis()
    const gravelAnalysis = getGravelAnalysis()
    const wasteAnalysis = getMaterialWasteAnalysis()
    const costSuggestions = getCostOptimizationSuggestions()
    const seasonalConsiderations = getSeasonalConsiderations()
    const projectComplexity = getProjectComplexity()

    return {
      project: {
        area: calculations.foundationArea.value,
        thickness: calculations.foundationThickness.value,
        estimatedCost: materials.estimatedCost.value,
        complexity: projectComplexity.complexity
      },
      analyses: {
        thickness: thicknessAnalysis,
        wood: woodAnalysis,
        rebar: rebarAnalysis,
        gravel: gravelAnalysis
      },
      optimization: {
        waste: wasteAnalysis,
        cost: costSuggestions,
        seasonal: seasonalConsiderations,
        complexity: projectComplexity.recommendations
      }
    }
  })

  return {
    summary
  }
}
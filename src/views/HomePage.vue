<template>
  <header class="navbar navbar-default">
    <nav class="container-fluid d-flex align-items-center justify-content-between">
      <div class="navbar-header d-flex align-items-center">
        <button
          class="openbtn"
          @click.stop="toggleNav"
          @pointerdown.stop
        >
          <font-awesome-icon
            icon="bars"
            class="icon-transition"
            :class="{ 'icon-hidden': isOpen }"
          />
          <font-awesome-icon
            icon="times"
            class="icon-transition"
            :class="{ 'icon-hidden': !isOpen }"
          />
        </button>
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

  <div
    id="mySidebar"
    class="sidebar"
    :style="{ width: sidebarWidth }"
    @pointerdown.stop
    @click.stop
  >
    <div class="sidebar-body">
      <div class="config-container">
        <div class="config-item">
          <span class="config-label">SqFt per Block:</span>
          <input
            v-model.number="blockSqFt"
            type="number"
            min="1"
            placeholder="Enter sq ft per block"
            class="input-field"
          >
        </div>
        <div class="config-item">
          <span class="config-label">Thickness (inches):</span>
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
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Concrete Settings</div>
                  <div class="accordion-header-subtext">{{ concreteBagWeight }} lb bags</div>
                </div>
              </button>
              <!-- <input
                class="form-check-input me-2"
                type="checkbox"
                v-model="materialToggles.concrete"
                id="toggleConcrete"
              /> -->
            </h2>
            <div id="collapseConcrete" class="accordion-collapse collapse" data-bs-parent="#accordionConcrete">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Bag Weight (lbs):</span>
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
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Rebar Settings</div>
                  <div class="accordion-header-subtext">{{ poleLength }} ft. {{rebarSize}}</div>
                </div>
              </button>
            </h2>
            <div id="collapseRebar" class="accordion-collapse collapse" data-bs-parent="#accordionRebar">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Spacing (inches):</span>
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
                <div class="config-item">
                  <span class="config-label">Length (feet):</span>
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
                <div class="config-item">
                  <span class="config-label">Size:</span>
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

        <div class="accordion" id="accordionWood">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWood" aria-expanded="true" aria-controls="collapseWood">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Wood Settings</div>
                  <div class="accordion-header-subtext">{{woodSize[0]}}"x{{woodSize[2]}}"x{{woodLength}}''</div>
                </div>
              </button>
            </h2>
            <div id="collapseWood" class="accordion-collapse collapse" data-bs-parent="#accordionWood">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Size:</span>
                  <select v-model="woodSize" class="input-field">
                    <option value="2x4">2x4</option>
                    <option value="2x6">2x6</option>
                    <option value="2x8">2x8</option>
                  </select>
                </div>
                <div class="config-item">
                  <span class="config-label">Length (ft):</span>
                  <input
                    v-model.number="woodLength"
                    type="number"
                    min="6"
                    max="16"
                    step="2"
                    class="input-field"
                    placeholder="e.g., 10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion" id="accordionGravel">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGravel" aria-expanded="true" aria-controls="collapseGravel">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Gravel Settings</div>
                  <div class="accordion-header-subtext">{{gravelDepth}} in. deep</div>
                </div>
              </button>
            </h2>
            <div id="collapseGravel" class="accordion-collapse collapse" data-bs-parent="#accordionGravel">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Depth (inches):</span>
                  <input
                    v-model.number="gravelDepth"
                    type="number"
                    min="4"
                    max="12"
                    step="1"
                    placeholder="e.g., 6"
                    class="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-container">
        <div class="config-item">
          <span class="config-label">Area:</span>
          <span class="config-value">{{ foundationArea }} sq ft</span>
        </div>
        <div class="config-item">
          <span class="config-label">Estimated cost:</span>
          <span class="config-value">${{ estimatedCost }}</span>
        </div>
      </div>
      <button
        @click.stop="toggleMaterialsSidebar"
        @pointerdown.stop
        class="btn btn-primary materials-button d-flex justify-content-center align-items-center gap-2"
      >
        <font-awesome-icon
          icon="cart-shopping"
        />
        <span v-if="isMaterialsOpen">Close Materials</span>
        <span v-else>Materials</span>
      </button>
    </div>
  </div>

  <div
    id="myMaterialsSidebar"
    class="materials-sidebar"
    :style="{ width: materialsSidebarWidth }"
    @pointerdown.stop
    @click.stop
  >
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
              {{ material.displayPrice }}
              <span
                v-if="material.bulkPricing && !material.usesBulk && !material.isLocal"
                class="tooltip-hint"
                @mouseenter="showTooltip($event, material)"
                @mouseleave="hideTooltip"
              >
                ⓘ
              </span>
              <span v-if="material.usesBulk" class="bulk">bulk</span>
              <span v-if="material.isLocal" class="local">(local)</span>
            </div>
            <div class="item-qty">
              x{{
                material.type === 'concrete'
                  ? concreteBagsNeeded
                  : material.type === 'rebar'
                    ? rebarCalculation.poles
                    : material.type === 'gravel'
                      ? material.quantity
                      : material.type === 'wood'
                        ? woodCalculation.boards
                        : material.type === 'sealer'
                          ? material.quantity
                          : 0
              }}
            </div>
          </div>
        </div>
      </div>
  </div>

  <div id="main" :style="{ marginLeft: mainMargin }">
    <HomePageMain
      :isOpen="isOpen"
      :blockSqFt="blockSqFt"
      :foundationThickness="foundationThickness"
      @block-added="addBlock"
      @block-removed="removeBlock"
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
import { useMaterialsStore } from '../stores/materials'

const store = useMaterialsStore()

const isOpen = ref(true)
const isMaterialsOpen = ref(false)
const sidebarWidth = computed(() => isOpen.value ? '240px' : '0px')
const materialsSidebarWidth = computed(() => isMaterialsOpen.value ? '480px' : '0px')
const mainMargin = computed(() => isOpen.value ? '240px' : '0px')
const loadingMaterials = ref(false);

const placedBlocks = ref(new Set());
const blockCount = ref(0)
const blockSqFt = ref(4)
const foundationThickness = ref(8) // default 8 inches

const materialToggles = ref({
  concrete: true,
  rebar: true,
  wood: true,
  gravel: true,
  sealer: true
});

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

// Concrete
const concreteBagWeight = ref(80);
const concreteBagsNeeded = computed(() => {
  const area = foundationArea.value;
  const thicknessFeet = foundationThickness.value / 12;
  const volume = area * thicknessFeet; // cubic feet
  return Math.ceil(volume / concreteYieldPerBag.value);
});

const concreteYieldPerBag = computed(() => {
  const yields = {
    50: 0.375,
    60: 0.45,
    80: 0.6
  };
  return yields[concreteBagWeight.value] || 0.6;
});

// Wood
const woodSize = ref('2x4');
const woodLength = ref(10);

const woodCalculation = computed(() => {
  const blockSizeFeet = Math.sqrt(blockSqFt.value);
  let edgeCount = 0;

  const directions = [
    [0, 1],  // north
    [0, -1], // south
    [1, 0],  // east
    [-1, 0]  // west
  ];

  const hasBlock = (x, z) => placedBlocks.value.has(`${x},${z}`);

  for (const key of placedBlocks.value) {
    const [x, z] = key.split(',').map(Number);
    for (const [dx, dz] of directions) {
      if (!hasBlock(x + dx, z + dz)) {
        edgeCount++;
      }
    }
  }

  const totalFeet = edgeCount * blockSizeFeet;
  const boardsNeeded = Math.ceil(totalFeet / woodLength.value);

  return {
    edges: edgeCount,
    linearFeet: Math.round(totalFeet),
    boards: boardsNeeded
  };
});

// Gravel
const gravelDepth = ref(6);

const gravelCalculation = computed(() => {
  const area = foundationArea.value;
  const depthFeet = gravelDepth.value / 12;
  const totalCubicFeet = area * depthFeet;

  return {
    volumeCubicFeet: Math.ceil(totalCubicFeet), // round up for safety
  };
});

const extractVolumeFromTitle = (title) => {
  const cuFtMatch = title.match(/(\d+(\.\d+)?)\s*cu\.?\s*ft/i);
  return cuFtMatch ? parseFloat(cuFtMatch[1]) : null;
};

// Sealer
const sealerCoveragePerGallon = 300 // sq ft per gallon (can be made user-configurable)
const concreteSealerCalculation = computed(() => {
  const area = foundationArea.value
  const gallonsNeeded = area / sealerCoveragePerGallon
  return {
    gallons: gallonsNeeded,
  }
})

const materialSpecs = computed(() => {
  const all = [];

  if (materialToggles.value.rebar) {
    all.push({
      name: 'rebar',
      query: `rebar ${rebarSize.value} ${poleLength.value}ft`,
      quantity: rebarCalculation.value.poles,
      sizeAliases: sizeMap[rebarSize.value] || []
    });
  }

  if (materialToggles.value.concrete) {
    all.push({
      name: 'concrete',
      query: `high strength concrete mix ${concreteBagWeight.value} lb`,
      quantity: concreteBagsNeeded.value
    });
  }

  if (materialToggles.value.wood) {
    all.push({
      name: 'wood',
      query: `${woodSize.value} pressure treated lumber ${woodLength.value}ft`,
      quantity: woodCalculation.value.boards
    });
  }

  if (materialToggles.value.gravel) {
    all.push({
      name: 'gravel',
      query: `drainage gravel bulk bag ton`,
      quantity: gravelCalculation.value.tons
    });
  }

  if (materialToggles.value.sealer) {
    all.push({
      name: 'sealer',
      query: 'water sealers concrete sealer clear',
      quantity: concreteSealerCalculation.value.gallons
    });
  }

  return { foundation: all };
});

const getMaterialImage = (type) => {
  switch (type) {
    case 'concrete':
      return new URL('../assets/concrete.webp', import.meta.url).href;
    case 'wood':
      return new URL('../assets/wood.webp', import.meta.url).href;
    case 'sealer':
      return new URL('../assets/sealer.webp', import.meta.url).href;
    case 'gravel':
      return new URL('../assets/gravel.webp', import.meta.url).href;
    case 'rebar':
    default:
      return new URL('../assets/rebar.webp', import.meta.url).href;
  }
};

const filteredMaterials = computed(() => {
  const foundationMaterials = materialSpecs.value.foundation.map(spec => {
    const raw = store.allMaterials[spec.name] || [];

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

        if (spec.name === 'concrete') {
          const title = m.title.toLowerCase();
          const weightMatch = title.match(/(\d+)\s*(lb|lbs)/i);
          if (!weightMatch) return false;
          const weight = parseInt(weightMatch[1]);
          if (weight !== concreteBagWeight.value) return false;
        }

        if (spec.name === 'wood') {
          const title = m.title.toLowerCase();

          const dims = title.match(/(\d+)\s*in\.\s*x\s*(\d+)\s*in\./);
          const lengthMatch = title.match(/(\d+)\s*ft/);

          if (!dims || !lengthMatch) return false;

          const [ , width, height ] = dims.map(Number);
          const matchedLength = parseInt(lengthMatch[1]);

          const [expectedW, expectedH] = woodSize.value.split('x').map(Number);

          return (
            matchedLength === woodLength.value &&
            ((width === expectedW && height === expectedH) ||
             (width === expectedH && height === expectedW)) // account for flipped dimensions
          );
        }

        return true; // pass through for other materials
      })
    .map(m => {
      const regularPrice = parseFloat(m.price?.replace(/[^0-9.]/g, '') || 'Infinity');
      const bulkQty = parseInt(m.bulkPricing?.quantity) || Infinity;
      const bulkPrice = parseFloat(m.bulkPricing?.price?.replace(/[^0-9.]/g, '')) || Infinity;

      if (spec.name === 'gravel') {
        const volumePerUnit = extractVolumeFromTitle(m.title) || 0.5; // fallback
        const quantityNeeded = Math.ceil(gravelCalculation.value.volumeCubicFeet / volumePerUnit);

        const localPrice = parseFloat(store.localPrices[spec.name]);
        const isUsingLocal = !isNaN(localPrice);

        const effectivePrice = isUsingLocal
          ? localOverride
          : (quantityNeeded >= bulkQty ? bulkPrice : regularPrice);

        const displayPrice = isUsingLocal
          ? `$${localOverride.toFixed(2)}`
          : (quantityNeeded >= bulkQty ? m.bulkPricing?.price : m.price);

        return {
          ...m,
          type: 'gravel',
          quantity: quantityNeeded,
          priceNumber: regularPrice,
          bulkPrice,
          effectivePrice,
          displayPrice,
          usesBulk: !isUsingLocal && quantityNeeded >= bulkQty,
          isLocal: isUsingLocal,
          link: isUsingLocal ? null : m.link
        };
      }

      if (spec.name === 'sealer') {
        const titleLower = m.title.toLowerCase();

        let unitGallons = 1;
        if (titleLower.includes('5 gallon')) unitGallons = 5;
        else if (titleLower.includes('1 gallon')) unitGallons = 1;
        else if (titleLower.includes('quart')) unitGallons = 0.25;

        const quantityNeeded = Math.ceil(spec.quantity / unitGallons);

        const localOverride = store.localPrices[spec.name];
        const isUsingLocal = localOverride != null;

        const effectivePrice = isUsingLocal
          ? localOverride
          : (quantityNeeded >= bulkQty ? bulkPrice : regularPrice);

        const displayPrice = isUsingLocal
          ? `$${localOverride.toFixed(2)}`
          : (quantityNeeded >= bulkQty ? m.bulkPricing?.price : m.price);

        return {
          ...m,
          type: 'sealer',
          quantity: quantityNeeded,
          priceNumber: regularPrice,
          bulkPrice,
          effectivePrice,
          displayPrice,
          usesBulk: !isUsingLocal && quantityNeeded >= bulkQty,
          isLocal: isUsingLocal,
          link: isUsingLocal ? null : m.link
        };
      }

      const localOverride = store.localPrices[spec.name];
      const isUsingLocal = localOverride != null;

      const effectivePrice = isUsingLocal
        ? localOverride
        : (spec.quantity >= bulkQty ? bulkPrice : regularPrice);

      const displayPrice = isUsingLocal
        ? `$${localOverride.toFixed(2)}`
        : (spec.quantity >= bulkQty ? m.bulkPricing?.price : m.price);

      return {
        ...m,
        type: spec.name,
        quantity: spec.quantity,
        priceNumber: regularPrice,
        bulkPrice,
        effectivePrice,
        displayPrice,
        usesBulk: !isUsingLocal && spec.quantity >= bulkQty,
        isLocal: isUsingLocal,
        title: isUsingLocal ? getLocalTitle(spec.name, spec) : m.title,
        link: isUsingLocal ? null : m.link
      };
    })

    .filter(m => isFinite(m.effectivePrice))
    .sort((a, b) => a.effectivePrice - b.effectivePrice);

    return processed.length ? processed[0] : null;
  });

  return foundationMaterials.filter(Boolean);
});

const fetchAllMaterials = async () => {
  loadingMaterials.value = true;
  try {
    const urls = materialSpecs.value.foundation.map(material => {
      return `https://www.homedepot.com/s/${encodeURIComponent(material.query)}?NCNI-5`;
    });

    const apiURL = `http://localhost:3001/api/materials?${urls.map(u => `urls=${encodeURIComponent(u)}`).join('&')}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    // Map materials back to their types by query
    const fetched = {};
    materialSpecs.value.foundation.forEach((spec, i) => {
      const url = urls[i];
      fetched[spec.name] = data[url] || [];
    });

    store.setAllMaterials(fetched);
  } catch (err) {
    console.error('Failed to fetch materials:', err);
  } finally {
    loadingMaterials.value = false;
  }
};

const foundationArea = computed(() => Math.round(blockCount.value * blockSqFt.value))
const estimatedCost = computed(() => {
  return filteredMaterials.value.reduce((total, material) => {
    return total + (material.effectivePrice * material.quantity);
  }, 0).toFixed(2);
});

const toggleNav = () => {
  isOpen.value = !isOpen.value
  if (isMaterialsOpen.value) {
    isMaterialsOpen.value = !isMaterialsOpen.value;
  }
}

const toggleMaterialsSidebar = () => {
  isMaterialsOpen.value = !isMaterialsOpen.value
}

const addBlock = (x, z) => {
  blockCount.value++
  placedBlocks.value.add(`${x},${z}`);
};

const removeBlock = (x, z) => {
  blockCount.value--
  placedBlocks.value.delete(`${x},${z}`);
};

const getLocalTitle = (type, spec) => {
  switch (type) {
    case 'rebar':
      return `${rebarSize.value} ${poleLength.value} ft. Rebar`;
    case 'concrete':
      return `${concreteBagWeight.value} lb Concrete Mix`;
    case 'wood':
      return `${woodSize.value} ${woodLength.value} Ft Lumber`;
    case 'gravel':
      return `Gravel (${spec.volumePerUnit ?? 0.5} cu. ft. per unit)`;
    case 'sealer':
      return `Concrete sealer (${spec.unitSize ?? 1} gal per unit)`;
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
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

watch(
  [rebarSize, poleLength, concreteBagWeight, woodSize, woodLength, gravelDepth, materialToggles],
  fetchAllMaterials
);
</script>

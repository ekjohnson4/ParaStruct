<template>
  <header class="navbar navbar-default">
    <nav class="container-fluid d-flex align-items-center justify-content-between">
      <div class="navbar-header d-flex align-items-center">
        <button class="openbtn" @click.stop="toggleNav" @pointerdown.stop>
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

  <div id="mySidebar" class="sidebar" :style="{ width: sidebarWidth }" @pointerdown.stop @click.stop>
    <div class="sidebar-body">
      <div class="config-container">
        <div class="config-item">
          <span class="config-label">SqFt per Block:</span>
          <input
            v-model.number="calculations.blockSqFt.value"
            type="number"
            min="1"
            placeholder="Enter sq ft per block"
            class="input-field"
          >
        </div>
        <div class="config-item">
          <span class="config-label">Thickness (inches):</span>
          <input
            v-model.number="calculations.foundationThickness.value"
            type="number"
            min="4"
            max="12"
            placeholder="Thickness (4-12 inches)"
            class="input-field"
            @change="clampThickness"
          >
        </div>
        <div class="accordion" id="accordionGravel">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGravel" aria-expanded="false" aria-controls="collapseGravel">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Gravel Settings</div>
                  <div class="accordion-header-subtext">{{calculations.gravelDepth.value}} in. deep</div>
                </div>
              </button>
            </h2>
            <div id="collapseGravel" class="accordion-collapse collapse" data-bs-parent="#accordionGravel">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Depth (inches):</span>
                  <input
                    v-model.number="calculations.gravelDepth.value"
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
        <div class="accordion" id="accordionWood">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWood" aria-expanded="false" aria-controls="collapseWood">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Wood Settings</div>
                  <div class="accordion-header-subtext">{{calculations.woodSize.value}}"x{{calculations.woodLength.value}}''</div>
                </div>
              </button>
            </h2>
            <div id="collapseWood" class="accordion-collapse collapse" data-bs-parent="#accordionWood">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Size:</span>
                  <select v-model="calculations.woodSize.value" class="input-field">
                    <option value="2x4">2x4</option>
                    <option value="2x6">2x6</option>
                    <option value="2x8">2x8</option>
                    <option value="2x10">2x10</option>
                    <option value="2x12">2x12</option>
                  </select>
                </div>
                <div class="config-item">
                  <span class="config-label">Length (ft):</span>
                  <input
                    v-model.number="calculations.woodLength.value"
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
        <div class="accordion" id="accordionRebar">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRebar" aria-expanded="false" aria-controls="collapseRebar">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Rebar Settings</div>
                  <div class="accordion-header-subtext">{{ calculations.poleLength.value }} ft. {{calculations.rebarSize.value}}</div>
                </div>
              </button>
            </h2>
            <div id="collapseRebar" class="accordion-collapse collapse" data-bs-parent="#accordionRebar">
              <div class="accordion-body">
                <div class="config-item">
                  <span class="config-label">Spacing (inches):</span>
                  <input
                    v-model.number="calculations.rebarSpacing.value"
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
                    v-model.number="calculations.poleLength.value"
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
                  <select v-model="calculations.rebarSize.value" class="input-field">
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
        <div class="accordion" id="accordionConcrete">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseConcrete" aria-expanded="false" aria-controls="collapseConcrete">
                <div class="accordion-text-group">
                  <div class="accordion-header-text">Concrete Settings</div>
                  <div class="accordion-header-subtext">{{ calculations.concreteBagWeight.value }} lb bags</div>
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
                  <select v-model.number="calculations.concreteBagWeight.value" class="input-field">
                    <option :value="50">50 lbs</option>
                    <option :value="60">60 lbs</option>
                    <option :value="80">80 lbs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-container">
        <div class="config-item">
          <span class="config-label">Area:</span>
          <span class="config-value">{{ calculations.foundationArea.value }} sq ft</span>
        </div>
        <div class="config-item">
          <span class="config-label">Estimated Cost:</span>
          <span class="config-value">${{ materials.estimatedCost.value }}</span>
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
            v-for="(material, index) in materials.filteredMaterials.value"
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
              x{{material.quantity}}
            </div>
          </div>
        </div>
      </div>
  </div>

  <!-- Three.js Canvas -->
  <div id="main" :style="{ marginLeft: mainMargin }">
    <HomePageMain
      ref="mainCanvas"
      :isOpen="isOpen"
      :isDialogOpen="isDialogOpen"
      :blockSqFt="calculations.blockSqFt.value"
      :foundationThickness="calculations.foundationThickness.value"
      @block-added="handleBlockAdded"
      @block-removed="handleBlockRemoved"
    />
  </div>

  <div
    v-if="tooltipData.visible"
    class="floating-tooltip"
    :style="{ top: tooltipData.y + 'px', left: tooltipData.x + 'px' }"
  >
    {{ tooltipData.text }}
  </div>

  <!-- Info Button -->
<button class="info-btn" @click="showInfo">
  <font-awesome-icon icon="info"/>
</button>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import HomePageMain from '../components/Home/HomePageMain.vue'
import { useFoundationCalculations } from '../composables/useFoundationCalculations'
import { useMaterialProcessing } from '../composables/useMaterialProcessing'
import { useMaterialsStore } from '../stores/materials'
import alertify from 'alertifyjs'

alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";

// Composables
const calculations = useFoundationCalculations();
const materials = useMaterialProcessing(calculations);
const store = useMaterialsStore();

// UI State
const isOpen = ref(true);
const isMaterialsOpen = ref(false);
const loadingMaterials = ref(false);
const mainCanvas = ref(null);

// Computed styles
const sidebarWidth = computed(() => isOpen.value ? '240px' : '0px');
const materialsSidebarWidth = computed(() => isMaterialsOpen.value ? '480px' : '0px');
const mainMargin = computed(() => isOpen.value ? '240px' : '0px');

// Tooltip
const tooltipData = ref({ visible: false, x: 0, y: 0, text: '' })

// Methods
const toggleNav = () => {
  isOpen.value = !isOpen.value
  if (isMaterialsOpen.value) isMaterialsOpen.value = false
}

const toggleMaterialsSidebar = () => {
  isMaterialsOpen.value = !isMaterialsOpen.value
}

const handleBlockAdded = (x, z) => {
  const previousCost = parseFloat(materials.estimatedCost.value)
  calculations.addBlock(x, z)

  nextTick(() => {
    const newCost = parseFloat(materials.estimatedCost.value)
    const costDifference = newCost - previousCost
    mainCanvas.value?.addCostPopup(x, z, costDifference, "green")
  })
}

const handleBlockRemoved = (x, z) => {
  const previousCost = parseFloat(materials.estimatedCost.value)
  calculations.removeBlock(x, z)

  nextTick(() => {
    const newCost = parseFloat(materials.estimatedCost.value)
    const costDifference = newCost - previousCost
    mainCanvas.value?.addCostPopup(x, z, costDifference, "red")
  })
}

const showTooltip = (event, material) => {
  tooltipData.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY - 20,
    text: `Bulk price ${material.bulkPricing.price} for ${material.bulkPricing.quantity}+`
  }
}

const hideTooltip = () => {
  tooltipData.value.visible = false
}

function clampThickness() {
  const val = calculations.foundationThickness.value
  if (val < 4) {
    calculations.foundationThickness.value = 4
    if (!store.isExperienced) {
      alertify.warning('A slab is usually between 4 and 12 inches.');
    }
  }
  else if (val > 12) {
    calculations.foundationThickness.value = 12;
    if (!store.isExperienced) {
      alertify.warning('A slab is usually between 4 and 12 inches.');
    }
  }
}

const fetchAllMaterials = async () => {
  loadingMaterials.value = true
  try {
    const urls = materials.materialSpecs.value.foundation.map(material =>
      `https://www.homedepot.com/s/${encodeURIComponent(material.query)}?NCNI-5`
    )

    const apiURL = `/api/materials?${urls.map(u => `urls=${encodeURIComponent(u)}`).join('&')}`
    const response = await fetch(apiURL)
    const data = await response.json()

    const fetched = {}
    materials.materialSpecs.value.foundation.forEach((spec, i) => {
      fetched[spec.name] = data[urls[i]] || []
    })

    store.setAllMaterials(fetched)
  } catch (error) {
    console.error('Failed to fetch materials:', error)
  } finally {
    loadingMaterials.value = false
  }
}

const isDialogOpen = ref(false)

// Modify the showInfo function to set the flag:
function showInfo() {
  isDialogOpen.value = true
  alertify.alert(
    'Controls',
    `
    <strong>Click</strong>: add blocks<br/>
    <strong>Click + drag</strong>: draw blocks<br/>
    <strong>Shift + click</strong>: remove block<br/>
    <strong>Ctrl + drag (left-click)</strong>: move camera<br/>
    <strong>Ctrl + drag (right-click)</strong>: rotate camera<br/>
    <strong>Ctrl + scroll</strong>: zoom
    `,
    function() {
      // Add a small delay to ensure the dialog is fully closed
      setTimeout(() => {
        isDialogOpen.value = false
      }, 100)
    }
  )
}

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

const initializeYouTubeDialog = () => {
  if (!alertify.YoutubeDialog) {
    alertify.dialog('YoutubeDialog', function() {
      var iframe, textContainer;
      return {
        main: function(videoId, textContent) {
          return this.set({
            'videoId': videoId,
            'textContent': textContent || ''
          });
        },
        setup: function() {
          return {
            options: {
              padding: false,
              overflow: false,
            }
          };
        },
        build: function() {
          // Create the iframe element
          iframe = document.createElement('iframe');
          iframe.frameBorder = "no";
          iframe.width = "100%";
          iframe.height = "50%";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;

          // Create text container
          textContainer = document.createElement('div');
          textContainer.style.padding = '15px';
          textContainer.style.backgroundColor = '#f8f9fa';
          textContainer.style.borderTop = '1px solid #dee2e6';
          textContainer.style.maxHeight = '50%';
          textContainer.style.overflowY = 'auto';
          textContainer.style.fontSize = '14px';
          textContainer.style.lineHeight = '1.5';

          // Add both elements to the dialog
          this.elements.content.appendChild(iframe);
          this.elements.content.appendChild(textContainer);

          // Give the dialog initial height (half the screen height)
          this.elements.body.style.minHeight = screen.height * 0.60 + 'px';

          // Give the dialog initial width (half the screen width)
          this.elements.body.style.minWidth = 300 + 'px';
        },
        settings: {
          videoId: undefined,
          textContent: ''
        },
        settingUpdated: function(key, oldValue, newValue) {
          switch(key) {
            case 'videoId':
              iframe.src = "https://www.youtube.com/embed/" + newValue + "?enablejsapi=1&autoplay=1";
              break;
            case 'textContent':
              textContainer.innerHTML = newValue;
              break;
          }
        },
        hooks: {
          onclose: function() {
            // Pause video when dialog is closed
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          },
          onupdate: function(option, oldValue, newValue) {
            switch(option) {
              case 'resizable':
                if (newValue) {
                  this.elements.content.removeAttribute('style');
                  iframe && iframe.removeAttribute('style');
                } else {
                  this.elements.content.style.minHeight = 'inherit';
                  iframe && (iframe.style.minHeight = 'inherit');
                }
                break;
            }
          }
        }
      };
    });
  }
};

const showIntroDialog = () => {
  isDialogOpen.value = true;

  // Initialize the YouTube dialog
  initializeYouTubeDialog();

  const introText = `
    <h4>Welcome to ParaStruct!</h4>
    <p>Here's a short video to give you a quick overlook about how concrete slabs are constructed. The example in the
    video is small, and therefore doesn't need rebar reinforcement. For more resources on rebar reinforcement, go to the
    links below:</p>
    <ul>
      <li><a href="https://www.youtube.com/watch?v=oSAHqs2kFl0">How to Pour a Concrete Slab from Start to Finish!! DIY Concrete Prep and Finish</a></li>
    </ul>
    <p>Use the sidebar to adjust material specifications and see real-time cost estimates.</p>
    <p><em>Watch the video above for a quick tutorial!</em></p>
  `;

  // Show the YouTube video dialog with text
  alertify.YoutubeDialog('JLQjnTUHzQ4', introText).set({
    title: 'Welcome!',
    frameless: false,
    resizable: true,
    maximizable: true,
    modal: true,
    onclose: function() {
      store.setVideoAnswer();
      setTimeout(() => {
        isDialogOpen.value = false;
      }, 100);
    }
  });
};

const showSeasonalTips = () => {
  const currentMonth = new Date().getMonth()

  if (currentMonth >= 10 || currentMonth <= 2) { // Nov-Feb
    alertify.message("⚠️ Winter tip: Concrete should not be poured when temperatures drop below 40°F")
  } else if (currentMonth >= 5 && currentMonth <= 8) { // Jun-Aug
    alertify.message("☀️ Summer tip: Cover fresh concrete and keep it moist in hot weather")
  }
}

// Centralized message throttling system
const messageThrottler = {
  lastMessageTimes: new Map(),
  shownMessages: new Map(),

  // Throttle messages by key with configurable delay
  canShowMessage(key, delay = 2000) {
    const now = Date.now()
    const lastTime = this.lastMessageTimes.get(key) || 0
    return now - lastTime > delay
  },

  // Mark message as shown and update timestamp
  markMessageShown(key) {
    this.lastMessageTimes.set(key, Date.now())
    this.shownMessages.set(key, true)
  },

  // Check if specific message was already shown
  wasMessageShown(key) {
    return this.shownMessages.get(key) || false
  },

  // Reset specific message flag
  resetMessageFlag(key) {
    this.shownMessages.set(key, false)
  },

  // Show throttled message only if user is not experienced
  showMessage(key, message, type = 'message', delay = 2000) {
    if (!store.isExperienced && this.canShowMessage(key, delay)) {
      alertify[type](message)
      this.markMessageShown(key)
      return true
    }
    return false
  },

  // Show message once per session (no throttling, just once per key)
  showMessageOnce(key, message, type = 'message') {
    if (!store.isExperienced && !this.wasMessageShown(key)) {
      alertify[type](message)
      this.shownMessages.set(key, true)
      return true
    }
    return false
  }
}

// Lifecycle
onMounted(() => {
  fetchAllMaterials()

  // Show intro video if user hasn't seen it
  if (!store.isExperienced) {
    if (!store.hasSeenVideo) {
      setTimeout(() => {
        showIntroDialog();
      }, 100)
    }
    showSeasonalTips();
  }
})

// Watchers
watch(
  [
    calculations.rebarSize,
    calculations.poleLength,
    calculations.concreteBagWeight,
    calculations.woodSize,
    calculations.woodLength,
    calculations.gravelDepth
  ],
  fetchAllMaterials
)

// Update the existing foundation thickness watcher to prevent triggering the warning
watch(
  () => calculations.foundationThickness.value,
  (newThickness) => {
    // Map foundation thickness to wood size
    const getRecommendedWoodSize = (thickness) => {
      if (thickness <= 4) return '2x4'
      if (thickness <= 6) return '2x6'
      if (thickness <= 8) return '2x8'
      if (thickness <= 10) return '2x10'
      if (thickness <= 12) return '2x12'
      return '2x8' // fallback
    }

    const recommendedSize = getRecommendedWoodSize(newThickness)

    // Only update if different to avoid triggering validation warning
    if (calculations.woodSize.value !== recommendedSize) {
      calculations.woodSize.value = recommendedSize
    }
  },
  { immediate: true }
)

// Wood size validation watcher
watch(
  () => calculations.woodSize.value,
  (newWoodSize) => {
    if (store.isExperienced) return

    const thickness = calculations.foundationThickness.value
    const getRecommendedWoodSize = (thickness) => {
      if (thickness <= 4) return '2x4'
      if (thickness <= 6) return '2x6'
      if (thickness <= 8) return '2x8'
      if (thickness <= 10) return '2x10'
      if (thickness <= 12) return '2x12'
      return '2x8'
    }

    const recommendedSize = getRecommendedWoodSize(thickness)

    if (newWoodSize !== recommendedSize) {
      const selectedHeight = parseInt(newWoodSize.split('x')[1])
      const recommendedHeight = parseInt(recommendedSize.split('x')[1])

      if (selectedHeight < thickness) {
        messageThrottler.showMessage(
          `woodSize_${newWoodSize}_${thickness}`,
          `Warning: ${newWoodSize} lumber may be too small for a ${thickness}" foundation. Consider using ${recommendedSize} or larger.`,
          'warning'
        )
      } else if (selectedHeight >= recommendedHeight + 2) {
        messageThrottler.showMessage(
          `woodSize_oversized_${newWoodSize}_${thickness}`,
          `Note: ${newWoodSize} lumber is larger than typically needed for a ${thickness}" foundation. ${recommendedSize} would be sufficient.`,
          'warning'
        )
      }
    }
  }
)

// Cost estimation tips watcher
watch(
  () => materials.estimatedCost.value,
  (newCost) => {
    if (store.isExperienced) return

    const cost = parseFloat(newCost)

    if (cost > 1000) {
      messageThrottler.showMessageOnce(
        'cost_over_1000',
        '💡 Tip: Consider renting a concrete mixer for projects over $1000',
        'message'
      )
    } else if (cost > 500) {
      messageThrottler.showMessageOnce(
        'cost_over_500',
        '💡 Tip: Buy materials in bulk for better prices on larger projects',
        'message'
      )
    }
  }
)

// Foundation thickness recommendations watcher
watch(
  () => calculations.foundationThickness.value,
  (newThickness) => {
    if (store.isExperienced) return

    const recommendations = {
      4: "4\" is suitable for lightweight structures like patios or walkways",
      5: "5\" works for garden sheds and light storage buildings",
      6: "6\" is good for garages and workshops with normal vehicle traffic",
      8: "8\" is recommended for heavy equipment or commercial use",
      10: "10\" is for heavy-duty applications or areas with freeze-thaw cycles",
      12: "12\" provides maximum strength for extreme loads or poor soil conditions"
    }

    const message = recommendations[newThickness]
    if (message) {
      messageThrottler.showMessage(
        `thickness_${newThickness}`,
        message,
        'message'
      )
    }
  }
)

// Gravel depth recommendations watcher
watch(
  () => calculations.gravelDepth.value,
  (newDepth) => {
    if (store.isExperienced) return

    // Reset flags when moving away from conditions
    if (newDepth >= 4) messageThrottler.resetMessageFlag('gravel_less_4')
    if (newDepth !== 6) messageThrottler.resetMessageFlag('gravel_6')
    if (newDepth <= 8) messageThrottler.resetMessageFlag('gravel_over_8')

    // Show appropriate messages
    if (newDepth < 4 && !messageThrottler.wasMessageShown('gravel_less_4')) {
      messageThrottler.showMessage(
        'gravel_less_4',
        'Less than 4" of gravel may not provide adequate drainage',
        'warning'
      )
    } else if (newDepth === 6 && !messageThrottler.wasMessageShown('gravel_6')) {
      messageThrottler.showMessage(
        'gravel_6',
        '6" is the standard gravel depth for most residential foundations',
        'success'
      )
    } else if (newDepth > 8 && !messageThrottler.wasMessageShown('gravel_over_8')) {
      messageThrottler.showMessage(
        'gravel_over_8',
        'Deep gravel beds are used in areas with poor drainage or clay soil',
        'message'
      )
    }
  }
)

// Foundation area building code watcher
watch(
  () => calculations.foundationArea.value,
  (newArea) => {
    if (store.isExperienced) return

    if (newArea > 500) {
      messageThrottler.showMessageOnce(
        'area_over_500',
        'Large foundations may require engineered drawings and soil analysis',
        'warning'
      )
    } else if (newArea > 200) {
      messageThrottler.showMessageOnce(
        'area_over_200',
        'Foundations over 200 sq ft typically require building permits',
        'message'
      )
    } else if (newArea > 120) {
      messageThrottler.showMessageOnce(
        'area_over_120',
        'Check local building codes - some areas require permits for foundations over 120 sq ft',
        'message'
      )
    }
  }
)

// Rebar size information watcher
watch(
  () => calculations.rebarSize.value,
  (newRebarSize) => {
    if (store.isExperienced) return

    const rebarInfo = {
      '#3': '#3 rebar (3/8" diameter) is commonly used for lighter applications and thin slabs.',
      '#4': '#4 rebar (1/2" diameter) is the most commonly used size for residential foundations.',
      '#5': '#5 rebar (5/8" diameter) provides additional strength for heavier applications.',
      '#6': '#6 rebar (3/4" diameter) is typically used for heavy-duty structural applications.'
    }

    const message = rebarInfo[newRebarSize]
    if (message) {
      messageThrottler.showMessage(
        `rebar_size_${newRebarSize}`,
        message,
        'message'
      )
    }
  }
)

// Rebar spacing recommendations watcher
watch(
  () => calculations.rebarSpacing.value,
  (newSpacing) => {
    if (store.isExperienced) return

    // Reset flags when moving away from conditions
    if (newSpacing !== 12) messageThrottler.resetMessageFlag('spacing_12')
    if (newSpacing <= 18) messageThrottler.resetMessageFlag('spacing_over_18')

    // Show appropriate messages
    if (newSpacing === 12 && !messageThrottler.wasMessageShown('spacing_12')) {
      messageThrottler.showMessage(
        'spacing_12',
        '12" spacing is a common standard for residential foundations.',
        'success'
      )
    } else if (newSpacing > 18 && !messageThrottler.wasMessageShown('spacing_over_18')) {
      messageThrottler.showMessage(
        'spacing_over_18',
        'Note: Spacing over 18" may require engineering review for some applications.',
        'message'
      )
    }
  }
)
</script>

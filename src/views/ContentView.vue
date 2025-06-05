<template>
  <div class="content-view-wrapper d-flex flex-column vh-100">
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <!-- Left Panel: Tabs Navigation -->
      <div class="left-panel d-flex flex-column h-100 overflow-hidden border-end" :style="{ width: leftPanelWidthPx }">
        <div class="content-view-header pt-3 px-3 pb-2 d-flex align-items-center justify-content-between">
          <div>
            <h3 class="text-primary mb-1">Pinia Stores</h3>
          </div>
          <button class="btn btn-outline-primary btn-sm ms-2" @click="refreshStoresDisplay" title="重新整理顯示">
            重新整理
          </button>
        </div>
        <ul class="nav nav-tabs flex-column px-3 mt-2" id="storeTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link text-start w-100" :class="{ active: activeTab === 'data' }" @click="activeTab = 'data'" type="button" role="tab" aria-controls="data-store-panel" :aria-selected="activeTab === 'data'">
              <i class="fas fa-archive me-2"></i>Data Store
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link text-start w-100" :class="{ active: activeTab === 'map' }" @click="activeTab = 'map'" type="button" role="tab" aria-controls="map-store-panel" :aria-selected="activeTab === 'map'">
              <i class="fas fa-map-marked-alt me-2"></i>Map Store
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link text-start w-100" :class="{ active: activeTab === 'define' }" @click="activeTab = 'define'" type="button" role="tab" aria-controls="define-store-panel" :aria-selected="activeTab === 'define'">
              <i class="fas fa-cogs me-2"></i>Define Store
            </button>
          </li>
        </ul>
        <div class="p-3 mt-auto">
          <small class="text-muted">Use the divider to resize panels.</small>
        </div>
      </div>

      <!-- Resizer -->
      <div class="my-resizer my-resizer-vertical" 
           :class="{ 'dragging': isDragging }"
           @mousedown="startResize"
           title="Drag to resize">
      </div>

      <!-- Right Panel: Store Content Display -->
      <div 
        class="right-panel d-flex flex-column flex-grow-1 h-100 overflow-hidden"
        :style="{ width: mainPanelWidthPx, 'min-width': '0px' }"
        :key="forceUpdateKey" 
      >
        <div class="tab-content flex-grow-1 h-100 overflow-auto" id="storeTabsContent">
          
          <!-- 1. 選項定義 (Options Definitions) from defineStore -->
          <div v-show="activeTab === 'define'" class="p-3 border-bottom bg-light">
            <h5 class="mb-3 text-primary"><i class="fas fa-cogs me-2"></i>選項定義 (defineStore)</h5>
            <div v-if="defineStoreStateEntries.length === 0" class="alert alert-info">
              defineStore appears to be empty or not yet initialized.
            </div>
            <div v-for="([key, value]) in defineStoreStateEntries" :key="`define-${key}`" class="store-property-card card mb-3 shadow-sm">
              <div class="card-header bg-light">
                <h5 class="mb-0 fw-medium">{{ key }}</h5>
              </div>
              <div class="card-body">
                <pre class="json-display p-2 bg-dark text-light rounded small"><code>{{ formatJson(value) }}</code></pre>
              </div>
            </div>
          </div>

          <!-- 2. Data Store -->
          <div v-show="activeTab === 'data'" class="p-3 border-bottom bg-light">
            <h5 class="mb-3 text-success"><i class="fas fa-database me-2"></i>Data Store (dataStore)</h5>
            <div v-if="dataStoreStateEntries.length === 0" class="alert alert-info">
              dataStore appears to be empty or not yet initialized.
            </div>
            <div v-for="([key, value]) in dataStoreStateEntries" :key="`data-${key}`" class="store-property-card card mb-3 shadow-sm">
              <div class="card-header bg-light">
                <h5 class="mb-0 fw-medium">{{ key }}</h5>
              </div>
              <div class="card-body">
                <pre class="json-display p-2 bg-dark text-light rounded small"><code>{{ formatJson(value) }}</code></pre>
              </div>
            </div>
          </div>

          <!-- 3. Map Store -->
          <div v-show="activeTab === 'map'" class="p-3 bg-light">
            <h5 class="mb-3 text-info"><i class="fas fa-map-marked-alt me-2"></i>Map Store (mapStore)</h5>
            <div v-if="mapStoreStateEntries.length === 0" class="alert alert-info">
              mapStore appears to be empty or not yet initialized.
            </div>
            <div v-for="([key, value]) in mapStoreStateEntries" :key="`map-${key}`" class="store-property-card card mb-3 shadow-sm">
              <div class="card-header bg-light">
                <h5 class="mb-0 fw-medium">{{ key }}</h5>
              </div>
              <div class="card-body">
                <pre class="json-display p-2 bg-dark text-light rounded small"><code>{{ formatJson(value) }}</code></pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useDefineStore } from '@/stores/defineStore';

// Key for forcing re-render of the right panel
const forceUpdateKey = ref(0);

// Tab Management for left panel visual state (no longer controls right panel content visibility)
const activeTab = ref('data'); 

const dataStore = useDataStore();
const mapStore = useMapStore();
const defineStore = useDefineStore();

const dataStoreStateEntries = computed(() => {
  if (dataStore && dataStore.$state) {
    return Object.entries(dataStore.$state);
  }
  return [];
});

const mapStoreStateEntries = computed(() => {
  if (mapStore && mapStore.$state) {
    return Object.entries(mapStore.$state);
  }
  return [];
});

const defineStoreStateEntries = computed(() => {
  if (defineStore && defineStore.$state) {
    return Object.entries(defineStore.$state);
  }
  return [];
});

const formatJson = (value) => {
  if (value === undefined) return "[Data is undefined]";
  if (value === null) return "[Data is null]";
  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    return "[Error converting to JSON]";
  }
};

// Resizable Panel Logic
const leftPanelWidth = ref(25); // Initial width of left panel in percentage
const isDragging = ref(false);
const startX = ref(0);
const startLeftWidth = ref(0); // Stores initial left panel width in percentage

const leftPanelWidthPx = computed(() => `${leftPanelWidth.value}%`);
const mainPanelWidth = computed(() => 100 - leftPanelWidth.value);
const mainPanelWidthPx = computed(() => `${mainPanelWidth.value}%`);

const startResize = (event) => {
  event.preventDefault();
  isDragging.value = true;
  startX.value = event.clientX;
  startLeftWidth.value = leftPanelWidth.value;
  document.body.classList.add('my-no-select'); // Prevent text selection during drag
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (event) => {
  if (!isDragging.value) return;
  const deltaX = event.clientX - startX.value;
  const totalWidth = window.innerWidth; // Or the width of the parent container if not window
  
  // Calculate change in percentage
  const deltaPercentage = (deltaX / totalWidth) * 100;
  let newLeftWidth = startLeftWidth.value + deltaPercentage;

  // Clamp the width (e.g., between 15% and 70%)
  newLeftWidth = Math.max(15, Math.min(newLeftWidth, 70)); 
  leftPanelWidth.value = newLeftWidth;
};

const stopResize = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.body.classList.remove('my-no-select');
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }
};

// Clean up listeners
onUnmounted(() => {
  stopResize(); // Ensure listeners are removed if component is unmounted while dragging
});

// MODIFIED: Renamed refreshStores to refreshStoresDisplay and changed its logic
const refreshStoresDisplay = async () => {
  console.log('ContentView: Triggering display refresh by incrementing forceUpdateKey.');
  forceUpdateKey.value += 1;
  await nextTick(); // Wait for the DOM to update
  console.log('ContentView: Display refresh cycle complete. Current key:', forceUpdateKey.value);
  // Optional: Log current store states to verify they are as expected after refresh
  console.log('defineStore state:', defineStore.$state);
  console.log('dataStore state:', dataStore.$state);
  console.log('mapStore state:', mapStore.$state);
};

</script>

<style scoped>
.content-view-wrapper {
  /* vh-100 and d-flex flex-column are on the element for full height */
}

.left-panel {
  /* background-color: #f8f9fa; */ /* Light background for the left panel */
  transition: width 0.1s ease-out; /* Smooth transition for programmatic width changes, not for drag */
}
.left-panel .nav-link {
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
  padding: 0.65rem 0.75rem;
}
.left-panel .nav-link.active {
  background-color: #0d6efd;
  color: white;
}
.left-panel .nav-link:not(.active):hover {
  background-color: #e9ecef;
}


.right-panel {
  /* flex-grow-1, h-100, overflow-hidden are on the element */
}

.tab-content {
  /* flex-grow-1, h-100, MODIFIED to overflow-auto are on the element */
}

/* Ensure tab-pane fills height and its scrollable area works - NO LONGER USING TAB PANES FOR MAIN SECTIONS*/
/* .tab-pane.active { */
 /* d-flex flex-column ensures child with flex-grow-1 takes available height */
/* } */

/* .content-view-scrollable-area { */ /* NO LONGER USED for main sections */
  /* flex-grow-1 and overflow-auto are on the element */
/* } */

.store-property-card .card-header {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.json-display {
  white-space: pre-wrap; 
  word-break: break-all; 
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.8rem;
}
.bg-dark {
  background-color: #282c34 !important;
}
.text-light {
  color: #abb2bf !important;
}

/* Resizer styles are global in App.vue (my-resizer-vertical) */
</style> 
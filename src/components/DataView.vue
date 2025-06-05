<template>
  <div class="data-view-container container-fluid py-3">
    <div class="mb-3">
      <h3 class="text-primary"><i class="fas fa-database me-2"></i>Pinia Stores Data Inspector</h3>
      <p class="text-muted">Complete live state of the <code>dataStore</code> and <code>mapStore</code>.</p>
    </div>

    <!-- Data Store Section -->
    <div class="store-section mb-4">
      <h4 class="text-secondary mb-3"><i class="fas fa-archive me-2"></i>Data Store (<code>dataStore</code>)</h4>
      <div v-if="dataStoreStateEntries.length === 0" class="alert alert-info">
        Data store seems to be empty or not yet initialized.
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

    <!-- Map Store Section -->
    <div class="store-section">
      <h4 class="text-secondary mb-3"><i class="fas fa-map-marked-alt me-2"></i>Map Store (<code>mapStore</code>)</h4>
      <div v-if="mapStoreStateEntries.length === 0" class="alert alert-info">
        Map store seems to be empty or not yet initialized.
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
</template>

<script setup>
import { computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';

const dataStore = useDataStore();
const mapStore = useMapStore();

// Get all top-level state properties from the dataStore
const dataStoreStateEntries = computed(() => {
  if (dataStore && dataStore.$state) {
    const entries = Object.entries(dataStore.$state);
    return entries;
  }
  return [];
});

// Get all top-level state properties from the mapStore
const mapStoreStateEntries = computed(() => {
  if (mapStore && mapStore.$state) {
    const entries = Object.entries(mapStore.$state);
    return entries;
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
</script>

<style scoped>
.data-view-container {
  height: 100%;
  overflow-y: auto;
}

.store-section + .store-section {
  margin-top: 2rem; /* Add some space between store sections */
}

.store-property-card .card-header {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.json-display {
  max-height: 400px; /* Limit height of individual JSON blocks */
  overflow-y: auto;   /* Add scroll for individual JSON blocks */
  white-space: pre-wrap; /* Ensures long lines wrap */
  word-break: break-all; /* Ensures long unbroken strings wrap */
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.8rem;
}

.bg-dark {
  background-color: #282c34 !important; /* A softer dark for the pre block */
}

.text-light {
  color: #abb2bf !important; /* Softer light text */
}
</style> 
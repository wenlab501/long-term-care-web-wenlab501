import { defineStore } from 'pinia';

export const useDefineStore = defineStore('define', {
  state: () => ({
    basemaps: [
      { label: 'OpenStreetMap', value: 'osm' },
      { label: 'Esri Street', value: 'esri_street' },
      { label: 'Esri Topo', value: 'esri_topo' },
      { label: 'Esri Imagery', value: 'esri_imagery' },
      { label: 'Google Maps 街道', value: 'google_road' },
      { label: 'Google Maps 衛星', value: 'google_satellite' },
      { label: '國土規劃中心電子地圖', value: 'nlsc_emap' },
      { label: '國土規劃中心正射影像', value: 'nlsc_photo' },
      { label: '地形圖', value: 'terrain' },
      { label: '空白無地圖', value: 'blank' },
    ],
  }),
});

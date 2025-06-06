handleAreaClick(area) {
  this.selectedArea = area;
  this.$emit('area-selected', area);
  // 移除自動縮放功能
  // this.map.flyTo({
  //   center: [area.longitude, area.latitude],
  //   zoom: 12,
  //   duration: 2000
  // });
}, 
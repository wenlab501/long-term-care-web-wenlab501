/**
 * 🛠️ 通用工具函數庫 (Common Utilities)
 *
 * 提供全系統使用的工具函數和常數定義
 * 包含 FontAwesome 圖標映射、顏色生成器等功能
 */

// =================================================================================
// 🎨 FontAwesome 圖標定義 (FontAwesome Icon Definitions)
// =================================================================================

/**
 * 圖標映射表 - 支援中文/英文/FontAwesome 類名
 * 用於統一管理系統中使用的所有圖標
 */
export const ICONS = {
  // 基本操作圖標
  add: { zh: '新增', en: 'Add', icon: 'fas fa-plus' },
  edit: { zh: '編輯', en: 'Edit', icon: 'fas fa-edit' },
  delete: { zh: '刪除', en: 'Delete', icon: 'fas fa-trash' },
  save: { zh: '儲存', en: 'Save', icon: 'fas fa-save' },
  cancel: { zh: '取消', en: 'Cancel', icon: 'fas fa-times' },
  confirm: { zh: '確認', en: 'Confirm', icon: 'fas fa-check' },
  search: { zh: '搜尋', en: 'Search', icon: 'fas fa-search' },
  filter: { zh: '篩選', en: 'Filter', icon: 'fas fa-filter' },
  sort: { zh: '排序', en: 'Sort', icon: 'fas fa-sort' },
  refresh: { zh: '重新整理', en: 'Refresh', icon: 'fas fa-sync-alt' },

  // 檔案操作圖標
  upload: { zh: '上傳', en: 'Upload', icon: 'fas fa-upload' },
  download: { zh: '下載', en: 'Download', icon: 'fas fa-download' },
  import: { zh: '匯入', en: 'Import', icon: 'fas fa-file-import' },
  export: { zh: '匯出', en: 'Export', icon: 'fas fa-file-export' },

  // 導航圖標
  home: { zh: '首頁', en: 'Home', icon: 'fas fa-home' },
  back: { zh: '返回', en: 'Back', icon: 'fas fa-arrow-left' },
  forward: { zh: '前進', en: 'Forward', icon: 'fas fa-arrow-right' },
  up: { zh: '向上', en: 'Up', icon: 'fas fa-arrow-up' },
  down: { zh: '向下', en: 'Down', icon: 'fas fa-arrow-down' },

  // 狀態圖標
  success: { zh: '成功', en: 'Success', icon: 'fas fa-check-circle' },
  error: { zh: '錯誤', en: 'Error', icon: 'fas fa-exclamation-circle' },
  warning: { zh: '警告', en: 'Warning', icon: 'fas fa-exclamation-triangle' },
  info: { zh: '資訊', en: 'Info', icon: 'fas fa-info-circle' },
  loading: { zh: '載入中', en: 'Loading', icon: 'fas fa-spinner' },

  // 視圖控制圖標
  view: { zh: '檢視', en: 'View', icon: 'fas fa-eye' },
  hide: { zh: '隱藏', en: 'Hide', icon: 'fas fa-eye-slash' },
  expand: { zh: '展開', en: 'Expand', icon: 'fas fa-expand' },
  collapse: { zh: '收縮', en: 'Collapse', icon: 'fas fa-compress' },

  // 📂 圖層和資料相關 (Layer & Data Icons)
  layer: { zh: '圖層', en: 'Layer', icon: 'fas fa-layer-group' },
  visible: { zh: '可見', en: 'Visible', icon: 'fas fa-eye' },
  hidden: { zh: '隱藏', en: 'Hidden', icon: 'fas fa-eye-slash' },
  data: { zh: '資料', en: 'Data', icon: 'fas fa-database' },
  table: { zh: '表格', en: 'Table', icon: 'fas fa-table' },

  // 🗺️ 地圖相關 (Map Icons)
  map: { zh: '地圖', en: 'Map', icon: 'fas fa-map' },
  location: { zh: '位置', en: 'Location', icon: 'fas fa-map-marker-alt' },
  zoom_in: { zh: '放大', en: 'Zoom In', icon: 'fas fa-search-plus' },
  zoom_out: { zh: '縮小', en: 'Zoom Out', icon: 'fas fa-search-minus' },
  center: { zh: '居中', en: 'Center', icon: 'fas fa-crosshairs' },

  // 📊 分析和統計 (Analysis & Statistics Icons)
  chart: { zh: '圖表', en: 'Chart', icon: 'fas fa-chart-bar' },
  statistics: { zh: '統計', en: 'Statistics', icon: 'fas fa-chart-line' },
  dashboard: { zh: '儀表板', en: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  analysis: { zh: '分析', en: 'Analysis', icon: 'fas fa-analytics' },

  // 🏥 醫療相關 (Medical Icons)
  hospital: { zh: '醫院', en: 'Hospital', icon: 'fas fa-hospital' },
  clinic: { zh: '診所', en: 'Clinic', icon: 'fas fa-clinic-medical' },
  pharmacy: { zh: '藥局', en: 'Pharmacy', icon: 'fas fa-pills' },
  elderly_care: { zh: '長照', en: 'Elderly Care', icon: 'fas fa-hands-helping' },
  medical: { zh: '醫療', en: 'Medical', icon: 'fas fa-user-md' },

  // 👥 人口和社會 (Population & Social Icons)
  population: { zh: '人口', en: 'Population', icon: 'fas fa-users' },
  demographics: { zh: '人口統計', en: 'Demographics', icon: 'fas fa-user-friends' },
  community: { zh: '社區', en: 'Community', icon: 'fas fa-home' },

  // 💰 經濟相關 (Economic Icons)
  income: { zh: '收入', en: 'Income', icon: 'fas fa-dollar-sign' },
  tax: { zh: '稅收', en: 'Tax', icon: 'fas fa-file-invoice-dollar' },

  // 🎛️ 操作和控制 (Control & Action Icons)
  drag: { zh: '拖拉', en: 'Drag', icon: 'fa-solid fa-grip-lines-vertical' },
  move_up: { zh: '上移', en: 'Move Up', icon: 'fas fa-arrow-up' },
  move_down: { zh: '下移', en: 'Move Down', icon: 'fas fa-arrow-down' },

  // ⚙️ 設定和配置 (Settings & Configuration Icons)
  settings: { zh: '設定', en: 'Settings', icon: 'fas fa-cog' },
  sort_up: { zh: '升序', en: 'Sort Ascending', icon: 'fas fa-sort-up' },
  sort_down: { zh: '降序', en: 'Sort Descending', icon: 'fas fa-sort-down' },

  // 📁 檔案和資料夾 (File & Folder Icons)
  folder: { zh: '資料夾', en: 'Folder', icon: 'fas fa-folder' },
  folder_open: { zh: '開啟資料夾', en: 'Open Folder', icon: 'fas fa-folder-open' },
  file: { zh: '檔案', en: 'File', icon: 'fas fa-file' },

  // ℹ️ 資訊和狀態 (Information & Status Icons)
  information: { zh: '資訊', en: 'Information', icon: 'fas fa-info-circle' },
  alert: { zh: '警告', en: 'Warning', icon: 'fas fa-exclamation-triangle' },
  failure: { zh: '錯誤', en: 'Error', icon: 'fas fa-times-circle' },
  complete: { zh: '成功', en: 'Success', icon: 'fas fa-check-circle' },

  // 🔄 狀態轉換 (State Transition Icons)
  reset: { zh: '重設', en: 'Reset', icon: 'fas fa-undo' },

  // 📱 介面元素 (UI Element Icons)
  menu: { zh: '選單', en: 'Menu', icon: 'fas fa-bars' },
  close: { zh: '關閉', en: 'Close', icon: 'fas fa-times' },
};

// =================================================================================
// 🎨 圖層顏色系統 (Layer Color System)
// =================================================================================

/**
 * 預定義的圖層顏色名稱列表
 * 這些顏色名稱對應到 CSS 中定義的 --my-color-* 變數
 */
export const LAYER_COLOR_NAMES = [
  'blue',
  'green',
  'orange',
  'red',
  'purple',
  'cyan',
  'deeporange',
  'brown',
  'bluegrey',
  'pink',
  'light-green',
  'amber',
  'indigo',
  'teal',
  'lime',
  'orange-variant',
];

/**
 * 獲取圖層顏色的 CSS 類別名稱
 * @param {string} colorName - 顏色名稱
 * @param {boolean} isBackground - 是否為背景顏色
 * @returns {string} CSS 類別名稱
 */
export function getLayerColorClass(colorName, isBackground = false) {
  const prefix = isBackground ? 'my-bgcolor-' : 'my-color-';
  return `${prefix}${colorName}`;
}

// =================================================================================
// 🎨 圖層圖標系統 (Layer Icon System)
// =================================================================================

/**
 * 預定義的圖層圖標名稱對應表
 * 根據圖層名稱或類型自動分配對應的圖標名稱
 */
export const LAYER_ICON_MAPPING = {
  // 醫療機構類型
  hospital: 'hospital',
  clinic: 'clinic',
  pharmacy: 'pharmacy',
  elderly_care: 'elderly-care',
  nursing_home: 'nursing-home',

  // 人口統計類型
  population: 'population',
  demographics: 'demographics',
  elderly: 'elderly',

  // 地理區域類型
  district: 'district',
  village: 'village',
  boundary: 'boundary',

  // 交通設施類型
  transport: 'transport',
  parking: 'parking',

  // 公共設施類型
  school: 'school',
  park: 'park',
  government: 'government',

  // 預設類型
  default: 'default',
};

/**
 * 根據圖層名稱自動判斷圖標名稱
 * @param {string} layerName - 圖層名稱
 * @returns {string} 圖標名稱
 */
export function getLayerIconName(layerName) {
  if (!layerName) {
    return LAYER_ICON_MAPPING.default;
  }

  const name = layerName.toLowerCase();

  // 醫療相關關鍵字
  if (name.includes('醫院') || name.includes('hospital')) {
    return LAYER_ICON_MAPPING.hospital;
  }
  if (name.includes('診所') || name.includes('clinic')) {
    return LAYER_ICON_MAPPING.clinic;
  }
  if (name.includes('藥局') || name.includes('pharmacy') || name.includes('藥房')) {
    return LAYER_ICON_MAPPING.pharmacy;
  }
  if (
    name.includes('長照') ||
    name.includes('老人') ||
    name.includes('elderly') ||
    name.includes('福利')
  ) {
    return LAYER_ICON_MAPPING.elderly_care;
  }
  if (name.includes('護理') || name.includes('nursing')) {
    return LAYER_ICON_MAPPING.nursing_home;
  }

  // 人口相關關鍵字
  if (name.includes('人口') || name.includes('population')) {
    return LAYER_ICON_MAPPING.population;
  }
  if (name.includes('統計') || name.includes('demographics')) {
    return LAYER_ICON_MAPPING.demographics;
  }

  // 地理相關關鍵字
  if (name.includes('區') || name.includes('district') || name.includes('行政')) {
    return LAYER_ICON_MAPPING.district;
  }
  if (name.includes('村') || name.includes('里') || name.includes('village')) {
    return LAYER_ICON_MAPPING.village;
  }
  if (name.includes('邊界') || name.includes('boundary')) {
    return LAYER_ICON_MAPPING.boundary;
  }

  // 交通相關關鍵字
  if (
    name.includes('交通') ||
    name.includes('transport') ||
    name.includes('公車') ||
    name.includes('捷運')
  ) {
    return LAYER_ICON_MAPPING.transport;
  }
  if (name.includes('停車') || name.includes('parking')) {
    return LAYER_ICON_MAPPING.parking;
  }

  // 公共設施關鍵字
  if (name.includes('學校') || name.includes('school') || name.includes('教育')) {
    return LAYER_ICON_MAPPING.school;
  }
  if (name.includes('公園') || name.includes('park') || name.includes('綠地')) {
    return LAYER_ICON_MAPPING.park;
  }
  if (name.includes('政府') || name.includes('government') || name.includes('公所')) {
    return LAYER_ICON_MAPPING.government;
  }

  // 預設返回位置圖標
  return LAYER_ICON_MAPPING.default;
}

/**
 * 獲取圖層圖標的完整 HTML 標籤
 * @param {string} iconName - 圖標名稱
 * @returns {string} 完整的 <i> 標籤 HTML
 */
export function getLayerIconHtml(iconName) {
  const iconMap = {
    hospital: '<i class="fas fa-hospital"></i>',
    clinic: '<i class="fas fa-clinic-medical"></i>',
    pharmacy: '<i class="fas fa-pills"></i>',
    'elderly-care': '<i class="fas fa-hands-helping"></i>',
    'nursing-home': '<i class="fas fa-home"></i>',
    population: '<i class="fas fa-users"></i>',
    demographics: '<i class="fas fa-user-friends"></i>',
    elderly: '<i class="fas fa-user-clock"></i>',
    district: '<i class="fas fa-map-marked-alt"></i>',
    village: '<i class="fas fa-home"></i>',
    boundary: '<i class="fas fa-border-style"></i>',
    transport: '<i class="fas fa-bus"></i>',
    parking: '<i class="fas fa-parking"></i>',
    school: '<i class="fas fa-school"></i>',
    park: '<i class="fas fa-tree"></i>',
    government: '<i class="fas fa-landmark"></i>',
    default: '<i class="fas fa-map-marker-alt"></i>',
  };

  return iconMap[iconName] || iconMap['default'];
}

/**
 * 獲取圖層圖標的 CSS 類別名稱
 * @param {string} iconName - 圖標名稱
 * @returns {string} CSS 類別名稱
 */
export function getLayerIconClass(iconName) {
  return `my-layer-icon-${iconName}`;
}

// =================================================================================
// 🏥 圖層類型圖標映射 (Layer Type Icon Mapping)
// =================================================================================

// =================================================================================
// 🛠️ 輔助函數 (Helper Functions)
// =================================================================================

/**
 * 根據鍵名獲取圖標資訊
 *
 * @param {string} iconKey - 圖標鍵名
 * @param {string} lang - 語言 ('zh' | 'en')
 * @returns {object} 包含文字和圖標類名的物件
 */
export function getIcon(iconKey, lang = 'zh') {
  const iconInfo = ICONS[iconKey];
  if (!iconInfo) {
    console.warn(`找不到圖標定義: ${iconKey}`);
    return {
      text: iconKey,
      icon: 'fas fa-question-circle',
    };
  }

  return {
    text: iconInfo[lang] || iconInfo.zh,
    icon: iconInfo.icon,
  };
}

/**
 * 獲取所有可用的圖標鍵名
 *
 * @returns {string[]} 圖標鍵名陣列
 */
export function getAvailableIcons() {
  return Object.keys(ICONS);
}

/**
 * 檢查顏色是否為深色（用於決定文字顏色）
 *
 * @param {string} color - 顏色值（支援 hex, rgb, hsl）
 * @returns {boolean} 是否為深色
 */
export function isDarkColor(color) {
  // 簡化的亮度檢測，可根據需要增強
  let r, g, b;

  if (color.startsWith('#')) {
    // Hex 格式
    const hex = color.substring(1);
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith('rgb')) {
    // RGB 格式
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    }
  } else {
    // 預設返回 false
    return false;
  }

  // 計算相對亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// =================================================================================
// 🔧 防抖和節流函數 (Debounce & Throttle)
// =================================================================================

/**
 * 防抖函數 - 延遲執行，在指定時間內重複調用會重新計時
 *
 * @param {Function} func - 要執行的函數
 * @param {number} wait - 等待時間（毫秒）
 * @param {boolean} immediate - 是否立即執行
 * @returns {Function} 防抖後的函數
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * 節流函數 - 限制函數執行頻率
 *
 * @param {Function} func - 要執行的函數
 * @param {number} limit - 限制間隔（毫秒）
 * @returns {Function} 節流後的函數
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// =================================================================================
// 📏 格式化函數 (Formatting Functions)
// =================================================================================

/**
 * 格式化數字（加入千分位逗號）
 *
 * @param {number} num - 要格式化的數字
 * @returns {string} 格式化後的字串
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('zh-TW').format(num);
}

/**
 * 格式化座標
 *
 * @param {number} coordinate - 座標值
 * @param {number} precision - 精確度（小數位數）
 * @returns {string} 格式化後的座標字串
 */
export function formatCoordinate(coordinate, precision = 4) {
  return parseFloat(coordinate).toFixed(precision);
}

/**
 * 格式化檔案大小
 *
 * @param {number} bytes - 位元組數
 * @returns {string} 格式化後的檔案大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

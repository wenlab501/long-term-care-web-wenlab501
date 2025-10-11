/**
 * 圖標映射表 - 支援中文/英文/FontAwesome 完整標籤
 * 用於統一管理系統中使用的所有圖標
 */
export const ICONS = {
  // 基本操作圖標
  add: { zh: '新增', en: 'Add', icon: '<i class="fas fa-plus"></i>' },
  edit: { zh: '編輯', en: 'Edit', icon: '<i class="fas fa-edit"></i>' },
  delete: { zh: '刪除', en: 'Delete', icon: '<i class="fas fa-trash"></i>' },
  delete_alt: { zh: '刪除', en: 'Delete', icon: '<i class="fas fa-trash-alt"></i>' },
  save: { zh: '儲存', en: 'Save', icon: '<i class="fas fa-save"></i>' },
  cancel: { zh: '取消', en: 'Cancel', icon: '<i class="fas fa-times"></i>' },
  confirm: { zh: '確認', en: 'Confirm', icon: '<i class="fas fa-check"></i>' },
  search: { zh: '搜尋', en: 'Search', icon: '<i class="fas fa-search"></i>' },
  filter: { zh: '篩選', en: 'Filter', icon: '<i class="fas fa-filter"></i>' },
  sort: { zh: '排序', en: 'Sort', icon: '<i class="fas fa-sort"></i>' },
  refresh: { zh: '重新整理', en: 'Refresh', icon: '<i class="fas fa-sync-alt"></i>' },

  // 檔案操作圖標
  upload: { zh: '上傳', en: 'Upload', icon: '<i class="fas fa-upload"></i>' },
  download: { zh: '下載', en: 'Download', icon: '<i class="fas fa-download"></i>' },
  import: { zh: '匯入', en: 'Import', icon: '<i class="fas fa-file-import"></i>' },
  export: { zh: '匯出', en: 'Export', icon: '<i class="fas fa-file-export"></i>' },

  // 導航圖標
  home: { zh: '首頁', en: 'Home', icon: '<i class="fas fa-home"></i>' },
  back: { zh: '返回', en: 'Back', icon: '<i class="fas fa-arrow-left"></i>' },
  forward: { zh: '前進', en: 'Forward', icon: '<i class="fas fa-arrow-right"></i>' },
  up: { zh: '向上', en: 'Up', icon: '<i class="fas fa-arrow-up"></i>' },
  down: { zh: '向下', en: 'Down', icon: '<i class="fas fa-arrow-down"></i>' },
  chevron_up: { zh: '向上箭頭', en: 'Chevron Up', icon: '<i class="fa-solid fa-chevron-up"></i>' },
  chevron_down: {
    zh: '向下箭頭',
    en: 'Chevron Down',
    icon: '<i class="fa-solid fa-chevron-down"></i>',
  },

  // 狀態圖標
  success: { zh: '成功', en: 'Success', icon: '<i class="fas fa-check-circle"></i>' },
  error: { zh: '錯誤', en: 'Error', icon: '<i class="fas fa-exclamation-circle"></i>' },
  warning: { zh: '警告', en: 'Warning', icon: '<i class="fas fa-exclamation-triangle"></i>' },
  info: { zh: '資訊', en: 'Info', icon: '<i class="fas fa-info-circle"></i>' },
  loading: { zh: '載入中', en: 'Loading', icon: '<i class="fas fa-spinner"></i>' },

  // 視圖控制圖標
  view: { zh: '檢視', en: 'View', icon: '<i class="fas fa-eye"></i>' },
  hide: { zh: '隱藏', en: 'Hide', icon: '<i class="fas fa-eye-slash"></i>' },
  expand: { zh: '展開', en: 'Expand', icon: '<i class="fas fa-expand"></i>' },
  collapse: { zh: '收縮', en: 'Collapse', icon: '<i class="fas fa-compress"></i>' },

  // 📂 圖層和資料相關 (Layer & Data Icons)
  layer: { zh: '圖層', en: 'Layer', icon: '<i class="fas fa-layer-group"></i>' },
  visible: { zh: '可見', en: 'Visible', icon: '<i class="fas fa-eye"></i>' },
  hidden: { zh: '隱藏', en: 'Hidden', icon: '<i class="fas fa-eye-slash"></i>' },
  data: { zh: '資料', en: 'Data', icon: '<i class="fas fa-database"></i>' },
  table: { zh: '表格', en: 'Table', icon: '<i class="fas fa-table"></i>' },

  // 🗺️ 地圖相關 (Map Icons)
  map: { zh: '地圖', en: 'Map', icon: '<i class="fas fa-map"></i>' },
  geodata: { zh: '地理資料', en: 'Geo Data', icon: '<i class="fa-solid fa-map-location"></i>' },
  data_analysis: {
    zh: '數據分析',
    en: 'Data Analysis',
    icon: '<i class="fa-solid fa-pen-to-square"></i>',
  },
  location: { zh: '位置', en: 'Location', icon: '<i class="fas fa-map-marker-alt"></i>' },
  location_dot: {
    zh: '位置點',
    en: 'Location Dot',
    icon: '<i class="fa-solid fa-location-dot"></i>',
  },
  zoom_in: { zh: '放大', en: 'Zoom In', icon: '<i class="fas fa-search-plus"></i>' },
  zoom_out: { zh: '縮小', en: 'Zoom Out', icon: '<i class="fas fa-search-minus"></i>' },
  center: { zh: '居中', en: 'Center', icon: '<i class="fas fa-crosshairs"></i>' },

  // 📊 分析和統計 (Analysis & Statistics Icons)
  chart: { zh: '圖表', en: 'Chart', icon: '<i class="fas fa-chart-bar"></i>' },
  statistics: { zh: '統計', en: 'Statistics', icon: '<i class="fas fa-chart-line"></i>' },
  dashboard: { zh: '儀表板', en: 'Dashboard', icon: '<i class="fas fa-tachometer-alt"></i>' },
  analysis: { zh: '分析', en: 'Analysis', icon: '<i class="fas fa-analytics"></i>' },

  // 🏥 醫療相關 (Medical Icons)
  hospital: { zh: '醫院', en: 'Hospital', icon: '<i class="fas fa-hospital"></i>' },
  clinic: { zh: '診所', en: 'Clinic', icon: '<i class="fas fa-clinic-medical"></i>' },
  pharmacy: { zh: '藥局', en: 'Pharmacy', icon: '<i class="fas fa-pills"></i>' },
  elderly_care: { zh: '長照', en: 'Elderly Care', icon: '<i class="fas fa-hands-helping"></i>' },
  medical: { zh: '醫療', en: 'Medical', icon: '<i class="fas fa-user-md"></i>' },

  // 🏢 建築和基礎設施 (Building & Infrastructure Icons)
  building: { zh: '建築', en: 'Building', icon: '<i class="fas fa-building"></i>' },

  // 👥 人口和社會 (Population & Social Icons)
  population: { zh: '人口', en: 'Population', icon: '<i class="fas fa-users"></i>' },
  demographics: { zh: '人口統計', en: 'Demographics', icon: '<i class="fas fa-user-friends"></i>' },
  community: { zh: '社區', en: 'Community', icon: '<i class="fas fa-home"></i>' },

  // 💰 經濟相關 (Economic Icons)
  income: { zh: '收入', en: 'Income', icon: '<i class="fas fa-dollar-sign"></i>' },
  tax: { zh: '稅收', en: 'Tax', icon: '<i class="fas fa-file-invoice-dollar"></i>' },

  // 🎛️ 操作和控制 (Control & Action Icons)
  drag: { zh: '拖拉', en: 'Drag', icon: '<i class="fa-solid fa-grip-lines-vertical"></i>' },
  move_up: { zh: '上移', en: 'Move Up', icon: '<i class="fas fa-arrow-up"></i>' },
  move_down: { zh: '下移', en: 'Move Down', icon: '<i class="fas fa-arrow-down"></i>' },

  // ⚙️ 設定和配置 (Settings & Configuration Icons)
  settings: { zh: '設定', en: 'Settings', icon: '<i class="fas fa-cog"></i>' },
  sort_up: { zh: '升序', en: 'Sort Ascending', icon: '<i class="fas fa-sort-up"></i>' },
  sort_down: { zh: '降序', en: 'Sort Descending', icon: '<i class="fas fa-sort-down"></i>' },

  // 📁 檔案和資料夾 (File & Folder Icons)
  folder: { zh: '資料夾', en: 'Folder', icon: '<i class="fas fa-folder"></i>' },
  folder_open: { zh: '開啟資料夾', en: 'Open Folder', icon: '<i class="fas fa-folder-open"></i>' },
  file: { zh: '檔案', en: 'File', icon: '<i class="fas fa-file"></i>' },

  // ℹ️ 資訊和狀態 (Information & Status Icons)
  information: { zh: '資訊', en: 'Information', icon: '<i class="fas fa-info-circle"></i>' },
  alert: { zh: '警告', en: 'Warning', icon: '<i class="fas fa-exclamation-triangle"></i>' },
  failure: { zh: '錯誤', en: 'Error', icon: '<i class="fas fa-times-circle"></i>' },
  complete: { zh: '成功', en: 'Success', icon: '<i class="fas fa-check-circle"></i>' },

  // 🔄 狀態轉換 (State Transition Icons)
  reset: { zh: '重設', en: 'Reset', icon: '<i class="fas fa-undo"></i>' },

  // 📱 介面元素 (UI Element Icons)
  menu: { zh: '選單', en: 'Menu', icon: '<i class="fas fa-bars"></i>' },
  close: { zh: '關閉', en: 'Close', icon: '<i class="fas fa-times"></i>' },
};

// =================================================================================
// 🛠️ 輔助函數 (Helper Functions)
// =================================================================================

/**
 * 根據鍵名獲取圖標資訊
 *
 * @param {string} iconKey - 圖標鍵名
 * @param {string} lang - 語言 ('zh' | 'en')
 * @returns {object} 包含文字和圖標完整標籤的物件
 */
export function getIcon(iconKey, lang = 'zh') {
  const iconInfo = ICONS[iconKey];
  if (!iconInfo) {
    console.warn(`找不到圖標定義: ${iconKey}`);
    return {
      text: iconKey,
      icon: '<i class="fas fa-question-circle"></i>',
    };
  }

  return {
    text: iconInfo[lang] || iconInfo.zh,
    icon: iconInfo.icon,
  };
}

// =================================================================================
// 📊 Natural Breaks 分類算法 (Jenks Natural Breaks)
// =================================================================================

/**
 * 計算 Jenks Natural Breaks 分類閾值 (完全重寫版本)
 *
 * Jenks Natural Breaks (Fisher-Jenks) 是一種統計分類方法，通過動態規劃算法找到最佳分類斷點，
 * 使得組內方差最小化，組間方差最大化。該實現使用優化的動態規劃算法，具有更好的性能和穩定性。
 *
 * 算法原理：
 * 1. 使用動態規劃表 dp[i][j] 記錄將前 i 個數據分為 j 類的最小方差
 * 2. 使用累積統計量優化方差計算，避免重複計算
 * 3. 回溯找出最佳分割點序列
 *
 * @param {number[]} values - 數值陣列（會自動過濾並排序）
 * @param {number} numClasses - 分類數量（必須 >= 1）
 * @returns {number[]} 分類閾值陣列，長度為 numClasses-1
 * @throws {Error} 當參數無效時拋出錯誤
 *
 * @example
 * // 將數據分為3類
 * const data = [1, 2, 4, 5, 7, 9, 12, 15, 18, 20];
 * const breaks = calculateNaturalBreaks(data, 3);
 * // 返回: [5, 12] （表示分類為: <=5, 5-12, >12）
 */
export function calculateNaturalBreaks(values, numClasses) {
  // === 輸入驗證 ===
  if (!Array.isArray(values)) {
    throw new Error('values 必須是數組');
  }

  if (!Number.isInteger(numClasses) || numClasses < 1) {
    throw new Error('numClasses 必須是正整數');
  }

  if (values.length === 0) {
    return [];
  }

  // === 數據預處理 ===
  // 過濾無效值，去重並排序
  const validValues = [
    ...new Set(values.filter((v) => typeof v === 'number' && !isNaN(v) && isFinite(v))),
  ].sort((a, b) => a - b);

  if (validValues.length === 0) {
    return [];
  }

  const n = validValues.length;

  // === 邊界情況處理 ===
  if (numClasses === 1) {
    return [];
  }

  if (numClasses >= n) {
    // 如果分類數大於等於數據點數，每個數據點為一類
    return validValues.slice(0, -1);
  }

  // === 預計算累積統計量 ===
  const cumulativeSum = new Float64Array(n + 1);
  const cumulativeSumSquares = new Float64Array(n + 1);

  cumulativeSum[0] = 0;
  cumulativeSumSquares[0] = 0;

  for (let i = 0; i < n; i++) {
    const value = validValues[i];
    cumulativeSum[i + 1] = cumulativeSum[i] + value;
    cumulativeSumSquares[i + 1] = cumulativeSumSquares[i] + value * value;
  }

  // === 優化的方差計算函數 ===
  const calculateSegmentVariance = (start, end) => {
    if (start >= end) return 0;

    const count = end - start;
    if (count <= 1) return 0;

    const sum = cumulativeSum[end] - cumulativeSum[start];
    const sumSquares = cumulativeSumSquares[end] - cumulativeSumSquares[start];
    const mean = sum / count;

    // 方差 = E[X²] - E[X]²
    const variance = sumSquares / count - mean * mean;

    // 總方差 = 方差 * 樣本數
    return variance * count;
  };

  // === 動態規劃表初始化 ===
  // dp[i][j] = 將前 i 個數據點分為 j 類的最小總方差
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(numClasses + 1).fill(Infinity));
  // backtrack[i][j] = 在狀態 dp[i][j] 時的最佳分割點
  const backtrack = Array(n + 1)
    .fill(null)
    .map(() => Array(numClasses + 1).fill(0));

  // === 初始化邊界條件 ===
  // 將前 i 個數據點分為 1 類
  for (let i = 1; i <= n; i++) {
    dp[i][1] = calculateSegmentVariance(0, i);
    backtrack[i][1] = 0;
  }

  // === 動態規劃主循環 ===
  for (let numData = 2; numData <= n; numData++) {
    for (let numClass = 2; numClass <= Math.min(numData, numClasses); numClass++) {
      // 嘗試所有可能的分割點
      for (let splitPoint = numClass - 1; splitPoint < numData; splitPoint++) {
        // 當前分割的方差 = 前面部分的最優方差 + 當前段的方差
        const currentVariance =
          dp[splitPoint][numClass - 1] + calculateSegmentVariance(splitPoint, numData);

        // 如果找到更優解，更新
        if (currentVariance < dp[numData][numClass]) {
          dp[numData][numClass] = currentVariance;
          backtrack[numData][numClass] = splitPoint;
        }
      }
    }
  }

  // === 回溯找出最佳分割點 ===
  const breakIndices = [];
  let currentData = n;
  let currentClass = numClasses;

  while (currentClass > 1) {
    const splitPoint = backtrack[currentData][currentClass];
    if (splitPoint > 0) {
      breakIndices.push(splitPoint);
    }
    currentData = splitPoint;
    currentClass--;
  }

  // === 轉換索引為實際值 ===
  const breaks = breakIndices
    .reverse() // 反轉得到正確順序
    .map((index) => validValues[index - 1]) // 轉換為實際值（斷點是前一個值）
    .filter((value, index, arr) => index === 0 || value !== arr[index - 1]); // 去重

  return breaks;
}

/**
 * 快速計算Natural Breaks的優化版本 (完全重寫)
 *
 * 這是一個高性能版本，專為大型數據集優化。使用了以下優化技術：
 * 1. 預計算累積統計量，避免重複計算
 * 2. 使用 Float64Array 提升數值計算精度和性能
 * 3. 數值穩定的方差計算公式
 * 4. 內存優化的動態規劃實現
 * 5. 早期終止條件檢查
 *
 * @param {number[]} values - 數值陣列
 * @param {number} numClasses - 分類數量
 * @returns {number[]} 閾值陣列
 */
export function calculateNaturalBreaksFast(values, numClasses) {
  // === 快速路徑：直接調用主算法 ===
  // 主算法已經包含了所有優化，對於大多數情況已經足夠快
  if (values.length < 10000) {
    return calculateNaturalBreaks(values, numClasses);
  }

  // === 超大數據集的額外優化 ===

  // 輸入驗證
  if (!Array.isArray(values)) {
    throw new Error('values 必須是數組');
  }

  if (!Number.isInteger(numClasses) || numClasses < 1) {
    throw new Error('numClasses 必須是正整數');
  }

  if (values.length === 0) {
    return [];
  }

  // 數據預處理 - 對超大數據集進行採樣優化
  let processedValues;

  if (values.length > 50000) {
    // 對於超大數據集，先進行智能採樣
    const sampleSize = Math.min(10000, Math.floor(values.length * 0.1));
    const step = Math.floor(values.length / sampleSize);

    const validValues = values
      .filter((v) => typeof v === 'number' && !isNaN(v) && isFinite(v))
      .sort((a, b) => a - b);

    // 分層採樣：確保覆蓋整個數據範圍
    const sampledValues = [];
    for (let i = 0; i < validValues.length; i += step) {
      sampledValues.push(validValues[i]);
    }

    // 確保包含邊界值
    if (sampledValues[sampledValues.length - 1] !== validValues[validValues.length - 1]) {
      sampledValues.push(validValues[validValues.length - 1]);
    }

    processedValues = [...new Set(sampledValues)].sort((a, b) => a - b);
  } else {
    // 標準處理
    processedValues = [
      ...new Set(values.filter((v) => typeof v === 'number' && !isNaN(v) && isFinite(v))),
    ].sort((a, b) => a - b);
  }

  if (processedValues.length === 0) {
    return [];
  }

  const n = processedValues.length;

  // 邊界情況
  if (numClasses === 1) return [];
  if (numClasses >= n) return processedValues.slice(0, -1);

  // === 高性能動態規劃實現 ===

  // 使用 Float64Array 提升性能和精度
  const cumulativeSum = new Float64Array(n + 1);
  const cumulativeSumSquares = new Float64Array(n + 1);

  // 預計算累積統計量
  for (let i = 0; i < n; i++) {
    const value = processedValues[i];
    cumulativeSum[i + 1] = cumulativeSum[i] + value;
    cumulativeSumSquares[i + 1] = cumulativeSumSquares[i] + value * value;
  }

  // 高效的方差計算函數
  const fastVariance = (start, end) => {
    const count = end - start;
    if (count <= 1) return 0;

    const sum = cumulativeSum[end] - cumulativeSum[start];
    const sumSquares = cumulativeSumSquares[end] - cumulativeSumSquares[start];
    const mean = sum / count;

    // 數值穩定的方差公式
    const variance = (sumSquares - sum * mean) / count;
    return Math.max(0, variance * count);
  };

  // 緊湊的動態規劃表
  const dp = new Array(n + 1);
  const backtrack = new Array(n + 1);

  for (let i = 0; i <= n; i++) {
    dp[i] = new Float64Array(numClasses + 1);
    backtrack[i] = new Uint16Array(numClasses + 1);
    dp[i].fill(Infinity);
  }

  // 初始化
  for (let i = 1; i <= n; i++) {
    dp[i][1] = fastVariance(0, i);
  }

  // 動態規劃主循環 - 使用緊湊的循環順序
  for (let k = 2; k <= numClasses; k++) {
    for (let i = k; i <= n; i++) {
      for (let j = k - 1; j < i; j++) {
        const cost = dp[j][k - 1] + fastVariance(j, i);
        if (cost < dp[i][k]) {
          dp[i][k] = cost;
          backtrack[i][k] = j;
        }
      }
    }
  }

  // 回溯
  const breaks = [];
  let pos = n;
  let classes = numClasses;

  while (classes > 1) {
    const splitPoint = backtrack[pos][classes];
    if (splitPoint > 0) {
      breaks.push(processedValues[splitPoint - 1]);
    }
    pos = splitPoint;
    classes--;
  }

  return breaks.reverse().filter((v, i, arr) => i === 0 || v !== arr[i - 1]);
}

/**
 * 獲取Natural Breaks分類的詳細統計資訊 (完全重寫版本)
 *
 * 提供完整的分類品質評估指標，包括方差分解、分類效果評估等。
 * 使用數值穩定的統計計算方法，提供更準確的結果。
 *
 * @param {number[]} values - 數值陣列
 * @param {number[]} breaks - 斷點陣列
 * @returns {Object} 包含各類別統計資訊的物件
 * @throws {Error} 當參數無效時拋出錯誤
 *
 * @example
 * const values = [1, 2, 4, 5, 7, 9, 12, 15, 18, 20];
 * const breaks = [5, 12];
 * const stats = getNaturalBreaksStats(values, breaks);
 * console.log(stats.goodnessOfVarianceFit); // 分類品質指標 (0-1)
 */
export function getNaturalBreaksStats(values, breaks) {
  // === 輸入驗證 ===
  if (!Array.isArray(values)) {
    throw new Error('values 必須是數組');
  }

  if (!Array.isArray(breaks)) {
    throw new Error('breaks 必須是數組');
  }

  // === 數據預處理 ===
  const validValues = values
    .filter((v) => typeof v === 'number' && !isNaN(v) && isFinite(v))
    .sort((a, b) => a - b);

  if (validValues.length === 0) {
    return {
      classes: [],
      totalVariance: 0,
      withinClassVariance: 0,
      betweenClassVariance: 0,
      goodnessOfVarianceFit: 0,
      averageSilhouetteScore: 0,
      classificationEfficiency: 0,
    };
  }

  const n = validValues.length;
  const sortedBreaks = [...breaks].sort((a, b) => a - b);

  // === 分類數據到各個類別 ===
  const classes = [];
  let currentStart = 0;

  for (let i = 0; i <= sortedBreaks.length; i++) {
    let currentEnd;

    if (i === sortedBreaks.length) {
      // 最後一個類別
      currentEnd = n;
    } else {
      // 找到第一個大於當前斷點的值的位置
      currentEnd = validValues.findIndex((v) => v > sortedBreaks[i]);
      if (currentEnd === -1) currentEnd = n;
    }

    if (currentStart < currentEnd) {
      const classValues = validValues.slice(currentStart, currentEnd);

      if (classValues.length > 0) {
        // === 計算類別統計 ===
        const count = classValues.length;
        const sum = classValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / count;

        // 使用數值穩定的方差計算
        let variance = 0;

        for (const value of classValues) {
          variance += (value - mean) ** 2;
        }

        const standardDeviation = Math.sqrt(variance / count);

        // === 構建範圍標籤 ===
        let rangeLabel;
        if (i === 0) {
          rangeLabel =
            sortedBreaks.length > 0
              ? `≤ ${Math.round(sortedBreaks[0])}`
              : `${Math.round(Math.min(...classValues))} - ${Math.round(Math.max(...classValues))}`;
        } else if (i === sortedBreaks.length) {
          rangeLabel = `> ${Math.round(sortedBreaks[i - 1])}`;
        } else {
          rangeLabel = `${Math.round(sortedBreaks[i - 1])} - ${Math.round(sortedBreaks[i])}`;
        }

        classes.push({
          index: i,
          range: rangeLabel,
          count,
          min: Math.min(...classValues),
          max: Math.max(...classValues),
          mean,
          median:
            count % 2 === 0
              ? (classValues[Math.floor(count / 2) - 1] + classValues[Math.floor(count / 2)]) / 2
              : classValues[Math.floor(count / 2)],
          standardDeviation,
          variance,
          totalVariance: variance, // 總方差 (用於優化計算)
          values: classValues,
          percentage: (count / n) * 100,
        });
      }
    }

    currentStart = currentEnd;
  }

  // === 計算全域統計 ===
  const overallSum = validValues.reduce((acc, val) => acc + val, 0);
  const overallMean = overallSum / n;

  // 總方差計算
  let totalVariance = 0;

  for (const value of validValues) {
    totalVariance += (value - overallMean) ** 2;
  }

  // === 方差分解 ===
  const withinClassVariance = classes.reduce((acc, cls) => acc + cls.variance, 0);
  const betweenClassVariance = totalVariance - withinClassVariance;

  // 分類品質指標 (Goodness of Variance Fit)
  const goodnessOfVarianceFit = totalVariance > 0 ? betweenClassVariance / totalVariance : 0;

  // === 額外的分類評估指標 ===

  // 計算平均輪廓係數 (Silhouette Score)
  let averageSilhouetteScore = 0;
  if (classes.length > 1) {
    let totalSilhouette = 0;
    let validSilhouetteCount = 0;

    for (let i = 0; i < classes.length; i++) {
      const currentClass = classes[i];

      if (currentClass.count > 1) {
        // 計算類內平均距離
        let intraClassDistance = 0;
        const values = currentClass.values;

        for (let j = 0; j < values.length; j++) {
          for (let k = j + 1; k < values.length; k++) {
            intraClassDistance += Math.abs(values[j] - values[k]);
          }
        }

        const avgIntraDistance = intraClassDistance / ((values.length * (values.length - 1)) / 2);

        // 找到最近的其他類別的平均距離
        let minInterClassDistance = Infinity;

        for (let j = 0; j < classes.length; j++) {
          if (i !== j) {
            const otherClass = classes[j];
            let interClassDistance = 0;
            let pairCount = 0;

            for (const val1 of currentClass.values) {
              for (const val2 of otherClass.values) {
                interClassDistance += Math.abs(val1 - val2);
                pairCount++;
              }
            }

            const avgInterDistance = interClassDistance / pairCount;
            minInterClassDistance = Math.min(minInterClassDistance, avgInterDistance);
          }
        }

        // 計算輪廓係數
        if (minInterClassDistance !== Infinity && avgIntraDistance > 0) {
          const silhouette =
            (minInterClassDistance - avgIntraDistance) /
            Math.max(minInterClassDistance, avgIntraDistance);
          totalSilhouette += silhouette * currentClass.count;
          validSilhouetteCount += currentClass.count;
        }
      }
    }

    averageSilhouetteScore = validSilhouetteCount > 0 ? totalSilhouette / validSilhouetteCount : 0;
  }

  // 分類效率 (Classification Efficiency)
  const expectedVarianceReduction = 1 - 1 / classes.length;
  const actualVarianceReduction = goodnessOfVarianceFit;
  const classificationEfficiency =
    expectedVarianceReduction > 0 ? actualVarianceReduction / expectedVarianceReduction : 0;

  return {
    classes,
    totalVariance,
    withinClassVariance,
    betweenClassVariance,
    goodnessOfVarianceFit,
    averageSilhouetteScore,
    classificationEfficiency,
    // 額外的統計資訊
    overallMean,
    overallStandardDeviation: Math.sqrt(totalVariance / n),
    numClasses: classes.length,
    totalCount: n,
    // 分類平衡性
    classBalance: {
      minClassSize: Math.min(...classes.map((c) => c.count)),
      maxClassSize: Math.max(...classes.map((c) => c.count)),
      averageClassSize: n / classes.length,
      classVariance:
        classes.length > 1
          ? classes.reduce((acc, cls) => acc + (cls.count - n / classes.length) ** 2, 0) /
            classes.length
          : 0,
    },
  };
}

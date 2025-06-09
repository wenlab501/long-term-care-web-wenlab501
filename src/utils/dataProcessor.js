/**
 * 📊 資料處理工具庫
 *
 * 長照空間分析系統的核心資料處理模組
 * 提供 GeoJSON、Excel、CSV 檔案載入與處理功能
 * 包含座標轉換、資料合併、色票映射等功能
 *
 * 主要功能：
 * - 🗺️ GeoJSON 檔案載入與處理
 * - 📈 Excel/CSV 檔案解析
 * - 🔄 資料格式轉換與合併
 * - 🎨 色票系統與顏色映射
 * - 📍 座標系統轉換 (TWD97 ↔ WGS84)
 * - 🏥 醫療院所資料處理
 *
 * @author 長照空間分析團隊
 * @version 1.0.0
 * @since 2024
 */

import * as XLSX from 'xlsx';

/**
 * 🗺️ 載入 GeoJSON 文件
 *
 * 從指定路徑載入 GeoJSON 格式的地理資料檔案
 * 支援錯誤處理與載入狀態回饋
 *
 * @param {string} filePath - GeoJSON 文件路徑
 * @returns {Promise<Object>} GeoJSON 數據物件
 * @throws {Error} 當檔案載入失敗時拋出錯誤
 */
export async function loadGeoJSON(filePath) {
  try {
    console.log(`開始載入 GeoJSON 文件: ${filePath}`);
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geojsonData = await response.json();
    console.log('✅ GeoJSON 文件載入成功');

    return geojsonData;
  } catch (error) {
    console.error('❌ GeoJSON 文件載入失敗:', error);
    throw error;
  }
}

/**
 * 📈 讀取 Excel 文件的特定工作表
 *
 * 使用 XLSX 庫載入並解析 Excel 檔案中的指定工作表
 * 將工作表資料轉換為 JSON 格式陣列
 *
 * @param {string} filePath - Excel 文件路徑
 * @param {string} sheetName - 目標工作表名稱
 * @returns {Promise<Array>} 解析後的 Excel 數據陣列
 * @throws {Error} 當檔案載入失敗或工作表不存在時拋出錯誤
 */
export async function loadExcelSheet(filePath, sheetName) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData;
  } catch (error) {
    console.error('Error loading Excel file:', error);
    throw error;
  }
}

/**
 * 🔄 合併 GeoJSON 和 Excel 數據
 *
 * 根據指定的關鍵欄位將 GeoJSON 地理資料與 Excel 統計資料進行合併
 * 建立查找表以提高合併效率，並生成合併摘要報告
 *
 * 合併流程：
 * 1. 建立 Excel 資料的查找表 (key-value mapping)
 * 2. 遍歷 GeoJSON 特徵，根據關鍵欄位進行匹配
 * 3. 更新 GeoJSON 屬性，加入 Excel 資料
 * 4. 生成表格資料和合併摘要
 *
 * @param {Object} geojsonData - GeoJSON 地理資料物件
 * @param {Array} excelData - Excel 統計資料陣列
 * @param {string} geojsonKey - GeoJSON 中的合併欄位名稱 (預設: 'PTVNAME')
 * @param {string} excelKey - Excel 中的合併欄位名稱 (預設: 'name')
 * @returns {Object} 包含合併後資料、表格資料和摘要的物件
 */
export function mergeGeoJSONWithExcel(
  geojsonData,
  excelData,
  geojsonKey = 'PTVNAME',
  excelKey = 'name'
) {
  try {
    // 創建Excel數據的查找表
    const excelLookup = {};
    excelData.forEach((row) => {
      if (row[excelKey]) {
        excelLookup[row[excelKey].toUpperCase()] = row;
      }
    });

    // 創建表格數據
    const tableData = geojsonData.features.map((feature, index) => {
      const props = feature.properties;
      const excelRow = excelLookup[props[geojsonKey]?.toUpperCase()];

      return {
        id: index + 1,
        name: props[geojsonKey] || '',
        count: excelRow ? excelRow.count || 0 : 0,
        merged: excelRow ? '成功' : '失敗',
        // 保留原始屬性
        ...props,
      };
    });

    // 更新 GeoJSON 屬性
    const mergedGeoJSON = {
      ...geojsonData,
      features: geojsonData.features.map((feature) => {
        const props = feature.properties;
        const excelRow = excelLookup[props[geojsonKey]?.toUpperCase()];

        return {
          ...feature,
          properties: {
            ...props,
            ...(excelRow || {}),
            count: excelRow ? excelRow.count || 0 : 0,
            PTVNAME: excelRow ? excelRow[excelKey] : props.TOWN || '',
            _merged: !!excelRow,
          },
        };
      }),
    };

    const mergedCount = tableData.filter((row) => row.merged === '成功').length;

    return {
      mergedGeoJSON,
      tableData,
      summary: {
        totalFeatures: geojsonData.features.length,
        mergedCount,
        excelRows: excelData.length,
        mergeRate: ((mergedCount / geojsonData.features.length) * 100).toFixed(1),
      },
    };
  } catch (error) {
    console.error('Error merging data:', error);
    throw error;
  }
}

/**
 * 📍 TWD97 轉 WGS84 座標轉換 (簡化版)
 *
 * 將台灣地區常用的 TWD97 (EPSG:3826) 座標系統轉換為國際標準的 WGS84 (EPSG:4326)
 * 使用簡化的線性轉換公式，適用於台灣地區的快速轉換需求
 *
 * 注意：此為簡化版本，精度較低但速度快
 * 如需高精度轉換，請使用 coordinateUtils.js 中的精確版本
 *
 * @param {number} x - TWD97 X座標 (東距，公尺)
 * @param {number} y - TWD97 Y座標 (北距，公尺)
 * @returns {Array} [經度, 緯度] WGS84 座標陣列
 */
export function twd97ToWgs84(x, y) {
  // TWD97轉換參數（簡化版本，適用於台灣地區）
  const k0 = 0.9999; // 比例因子
  const dx = 250000; // 東偏移量

  const y_norm = y / k0;
  const x_norm = (x - dx) / k0;

  // 概算轉換（適用於台灣地區的近似轉換）
  const lat = 23.0 + (y_norm - 2500000) / 111000;
  const lng = 121.0 + x_norm / (111000 * Math.cos((lat * Math.PI) / 180));

  return [lng, lat];
}

/**
 * 色票定義 - 多種配色方案（包含 Python matplotlib 常用色票）
 */
export const COLOR_SCHEMES = {
  // 🔥 Python matplotlib 經典色票
  viridis: {
    name: 'Viridis (Python 預設)',
    colors: [
      '#e0e0e0',
      '#440154',
      '#482878',
      '#3e4989',
      '#31688e',
      '#26828e',
      '#1f9e89',
      '#35b779',
      '#6ece58',
      '#b5de2b',
      '#fde725',
    ],
    description: 'Python matplotlib 預設色票，色盲友善',
  },
  plasma: {
    name: 'Plasma (Python)',
    colors: [
      '#e0e0e0',
      '#0d0887',
      '#46039f',
      '#7201a8',
      '#9c179e',
      '#bd3786',
      '#d8576b',
      '#ed7953',
      '#fb9f3a',
      '#fdca26',
      '#f0f921',
    ],
    description: 'Python matplotlib plasma 色票',
  },
  inferno: {
    name: 'Inferno (Python)',
    colors: [
      '#e0e0e0',
      '#000004',
      '#1b0c41',
      '#4a0c6b',
      '#781c6d',
      '#a52c60',
      '#cf4446',
      '#ed6925',
      '#fb9b06',
      '#f7d03c',
      '#fcffa4',
    ],
    description: 'Python matplotlib inferno 色票',
  },
  magma: {
    name: 'Magma (Python)',
    colors: [
      '#e0e0e0',
      '#000004',
      '#180f3d',
      '#440f76',
      '#721f81',
      '#9e2f7f',
      '#cd4071',
      '#f1605d',
      '#fd9668',
      '#feca8d',
      '#fcfdbf',
    ],
    description: 'Python matplotlib magma 色票',
  },
  cividis: {
    name: 'Cividis (Python)',
    colors: [
      '#e0e0e0',
      '#00224e',
      '#123570',
      '#3b496c',
      '#575d6d',
      '#707173',
      '#8a8678',
      '#a59c74',
      '#c3b369',
      '#e1cc55',
      '#ffea46',
    ],
    description: 'Python matplotlib cividis 色票，完全色盲友善',
  },
  // 🔥 Python seaborn 風格
  seaborn_rocket: {
    name: 'Rocket (Seaborn)',
    colors: [
      '#e0e0e0',
      '#03051A',
      '#1e1B31',
      '#3c2848',
      '#5c355e',
      '#7c4173',
      '#9d4e87',
      '#be5b9a',
      '#de69ad',
      '#fd77c1',
      '#ff85d4',
    ],
    description: 'Python seaborn rocket 色票',
  },
  seaborn_mako: {
    name: 'Mako (Seaborn)',
    colors: [
      '#e0e0e0',
      '#0B0405',
      '#1B0F1C',
      '#2A1B34',
      '#38274C',
      '#463465',
      '#54417D',
      '#624E96',
      '#705CAE',
      '#7E6AC7',
      '#8C78DF',
    ],
    description: 'Python seaborn mako 色票',
  },
  // 🔥 科學視覺化常用
  coolwarm: {
    name: 'CoolWarm (科學)',
    colors: [
      '#e0e0e0',
      '#3B4CC0',
      '#5977E3',
      '#7DA5F5',
      '#A6D1FF',
      '#D4E7FF',
      '#FFE0D4',
      '#FFB2A6',
      '#F57A79',
      '#E34256',
      '#B40426',
    ],
    description: 'Python matplotlib coolwarm，適合正負值',
  },
  rdylbu: {
    name: 'RdYlBu (發散)',
    colors: [
      '#e0e0e0',
      '#313695',
      '#4575b4',
      '#74add1',
      '#abd9e9',
      '#e0f3f8',
      '#fee090',
      '#fdae61',
      '#f46d43',
      '#d73027',
      '#a50026',
    ],
    description: 'Python matplotlib RdYlBu 發散色票',
  },
  // 原有的色票保留
  default: {
    name: '預設 (藍→綠→黃→紅)',
    colors: ['#e0e0e0', '#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
    description: '經典的冷暖色調漸變',
  },
  heat: {
    name: '熱力圖 (黑→紅→黃→白)',
    colors: [
      '#e0e0e0',
      '#000000',
      '#8B0000',
      '#FF0000',
      '#FF4500',
      '#FFA500',
      '#FFFF00',
      '#FFFFFF',
    ],
    description: '模擬熱力圖效果',
  },
  blues: {
    name: '藍色系 (淺藍→深藍)',
    colors: [
      '#e0e0e0',
      '#E3F2FD',
      '#BBDEFB',
      '#90CAF9',
      '#64B5F6',
      '#42A5F5',
      '#2196F3',
      '#1E88E5',
      '#1976D2',
      '#1565C0',
    ],
    description: '藍色單色漸變',
  },
  greens: {
    name: '綠色系 (淺綠→深綠)',
    colors: [
      '#e0e0e0',
      '#E8F5E8',
      '#C8E6C9',
      '#A5D6A7',
      '#81C784',
      '#66BB6A',
      '#4CAF50',
      '#43A047',
      '#388E3C',
      '#2E7D32',
    ],
    description: '綠色單色漸變',
  },
  reds: {
    name: '紅色系 (淺紅→深紅)',
    colors: [
      '#e0e0e0',
      '#FFEBEE',
      '#FFCDD2',
      '#EF9A9A',
      '#E57373',
      '#EF5350',
      '#F44336',
      '#E53935',
      '#D32F2F',
      '#C62828',
    ],
    description: '紅色單色漸變',
  },
  rainbow: {
    name: '彩虹光譜 (紫→藍→綠→黃→橙→紅)',
    colors: [
      '#e0e0e0',
      '#9C27B0',
      '#3F51B5',
      '#2196F3',
      '#00BCD4',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFC107',
      '#FF9800',
      '#FF5722',
    ],
    description: '完整光譜顏色',
  },
  terrain: {
    name: '地形圖 (綠→棕→白)',
    colors: [
      '#e0e0e0',
      '#1a472a',
      '#2d5c3e',
      '#4a7c59',
      '#6b8e3d',
      '#8fac3c',
      '#b8c54f',
      '#d4d967',
      '#e8e383',
      '#f5f0a5',
    ],
    description: '模擬地形高度',
  },
  ocean: {
    name: '海洋 (深藍→淺藍)',
    colors: [
      '#e0e0e0',
      '#001f3f',
      '#002a5c',
      '#003d82',
      '#0056b3',
      '#0077be',
      '#009ffd',
      '#66ccff',
      '#b3e0ff',
      '#e0f2ff',
    ],
    description: '海洋深度模擬',
  },
};

/**
 * 根據色票和count值生成顏色
 * @param {number} count - 數值
 * @param {number} maxCount - 最大值
 * @param {string} scheme - 色票方案名稱
 * @returns {string} 顏色值
 */
export function getColorByCount(count, maxCount, scheme = 'viridis') {
  if (!count || count === 0) return COLOR_SCHEMES[scheme]?.colors[0] || '#e0e0e0';

  const colors = COLOR_SCHEMES[scheme]?.colors || COLOR_SCHEMES.viridis.colors;
  const ratio = Math.min(count / maxCount, 1); // 確保不超過1

  // 跳過第一個顏色（無數據顏色），使用剩餘顏色進行漸變
  const gradientColors = colors.slice(1);

  if (gradientColors.length === 0) return colors[0];
  if (gradientColors.length === 1) return gradientColors[0];

  // 計算在漸變中的位置
  const position = ratio * (gradientColors.length - 1);
  const index = Math.floor(position);
  const remainder = position - index;

  // 如果正好在顏色點上
  if (remainder === 0 || index >= gradientColors.length - 1) {
    return gradientColors[Math.min(index, gradientColors.length - 1)];
  }

  // 線性插值兩個顏色
  const color1 = gradientColors[index];
  const color2 = gradientColors[index + 1];

  return interpolateColor(color1, color2, remainder);
}

/**
 * 線性插值兩個顏色
 * @param {string} color1 - 起始顏色 (hex)
 * @param {string} color2 - 結束顏色 (hex)
 * @param {number} factor - 插值因子 (0-1)
 * @returns {string} 插值後的顏色
 */
function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 將hex顏色轉換為RGB
 * @param {string} hex - hex顏色值
 * @returns {Object|null} RGB對象或null
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * 載入臺北市 GeoJSON 數據
 * @returns {Promise<Object>} 處理後的數據
 */
export async function loadTainanData() {
  try {
    console.log('開始載入臺北市 GeoJSON 數據...');
    const rawGeoJSON = await loadGeoJSON(
      '/long-term-care-web/data/geojson/臺北市_村里_綜稅綜合所得總額.geojson'
    );
    console.log('✅ 臺北市 GeoJSON 數據載入成功');

    // 生成表格數據
    const tableData = rawGeoJSON.features.map((feature) => ({
      id: feature.properties.VILLCODE || '',
      name: feature.properties.PTVNAME || '',
      count: feature.properties.中位數 || 0,
      ...feature.properties,
      geometry: feature.geometry,
    }));

    // 生成摘要信息
    const summary = {
      totalFeatures: rawGeoJSON.features.length,
      coordinateSystem: rawGeoJSON.crs?.properties?.name || '未知',
      conversionInfo: rawGeoJSON.conversionInfo || '無轉換',
    };

    return {
      rawGeoJSON,
      mergedGeoJSON: rawGeoJSON,
      convertedGeoJSON: rawGeoJSON,
      tableData,
      summary,
    };
  } catch (error) {
    console.error('❌ 臺北市 GeoJSON 數據載入失敗:', error);
    throw error;
  }
}

/**
 * 載入 CSV 文件
 * @param {string} filePath - CSV 文件的路徑
 * @returns {Promise<Array>} - 解析後的數據數組
 */
export const loadCSV = async (filePath) => {
  try {
    console.log('開始加載 CSV 文件:', filePath);
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('CSV 文件加載成功，開始解析...');
    const csvText = await response.text();
    console.log('CSV 文本內容:', csvText.substring(0, 200) + '...'); // 只顯示前200個字符

    // 使用 XLSX 解析 CSV
    const workbook = XLSX.read(csvText, { type: 'string' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 將工作表轉換為 JSON 數組
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('CSV 解析完成:', {
      rows: data.length,
      fields: Object.keys(data[0] || {}),
      firstRow: data[0],
    });

    return data;
  } catch (error) {
    console.error('加載 CSV 文件失敗:', error);
    throw error;
  }
};

/**
 * 載入醫療院所數據
 * @returns {Promise<Object>} 處理後的數據
 */
export async function loadMedicalData() {
  try {
    console.log('開始載入醫療院所數據...');
    const filePath = '/long-term-care-web/data/csv/112年12月醫療院所分布圖_全國.csv';
    console.log('嘗試加載文件:', filePath);

    const response = await fetch(filePath);
    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    console.log('CSV 文件內容前 500 字符:', csvText.substring(0, 500));

    const rows = csvText.split('\n').map((row) => row.split(','));
    console.log('CSV 標題行:', rows[0]);
    console.log('CSV 數據行數:', rows.length);

    const headers = rows[0];
    console.log('CSV 標題索引:', {
      WKT: headers.indexOf('WKT'),
      機構名稱: headers.indexOf('機構名稱'),
      縣市: headers.indexOf('縣市'),
      鄉鎮市區: headers.indexOf('鄉鎮市區'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
    });

    // 只保留臺北市萬華區的數據
    const wanhuaData = rows.slice(1).filter((row) => {
      const cityIndex = headers.indexOf('縣市');
      const districtIndex = headers.indexOf('鄉鎮市區');
      const isWanhua = row[cityIndex] === '臺北市' && row[districtIndex] === '萬華區';
      if (isWanhua) {
        console.log('找到萬華區數據:', row);
      }
      return isWanhua;
    });
    console.log(`載入 ${wanhuaData.length} 筆萬華區醫療院所數據`);

    // 創建 GeoJSON 結構
    const geojsonData = {
      type: 'FeatureCollection',
      features: wanhuaData
        .map((row) => {
          // 解析 WKT 格式的座標
          const wktMatch = row[headers.indexOf('WKT')]?.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
          if (!wktMatch) {
            console.warn('無效的 WKT 格式:', row[headers.indexOf('WKT')]);
            return null;
          }

          const lng = parseFloat(wktMatch[1]);
          const lat = parseFloat(wktMatch[2]);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn('無效的座標:', row);
            return null;
          }

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: {
              name: row[headers.indexOf('機構名稱')],
              address: row[headers.indexOf('地址')],
              phone: row[headers.indexOf('電話')],
              city: row[headers.indexOf('縣市')],
              district: row[headers.indexOf('鄉鎮市區')],
            },
          };
        })
        .filter((feature) => feature !== null),
    };

    // 打印完整的 GeoJSON 數據
    console.log('轉換後的 GeoJSON 數據:', JSON.stringify(geojsonData, null, 2));

    // 生成表格數據
    const tableData = geojsonData.features.map((feature) => ({
      id: feature.properties.name || '',
      name: feature.properties.name || '',
      count: 1, // 每個醫療院所計數為1
      ...feature.properties,
    }));

    // 生成摘要信息
    const summary = {
      totalFeatures: geojsonData.features.length,
      coordinateSystem: 'WGS84',
      conversionInfo: 'CSV轉GeoJSON',
    };

    return {
      rawGeoJSON: geojsonData,
      mergedGeoJSON: geojsonData,
      convertedGeoJSON: geojsonData,
      tableData,
      summary,
    };
  } catch (error) {
    console.error('❌ 醫療院所數據載入失敗:', error);
    throw error;
  }
}

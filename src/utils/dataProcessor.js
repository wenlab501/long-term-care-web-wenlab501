export async function loadHospitalClinicData(fileName) {
  try {
    const filePath = `/long-term-care-web/data/csv/${fileName}`;

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

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      name: headers.indexOf('醫療院所'),
      city: headers.indexOf('縣市'),
      district: headers.indexOf('鄉鎮市區'),
      address: headers.indexOf('地址'),
      phone: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonText = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${index + 2} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              name: row[headerIndices.name], // 儲存機構名稱屬性
              address: row[headerIndices.address], // 儲存地址屬性
              phone: row[headerIndices.phone], // 儲存電話屬性
              city: row[headerIndices.city], // 儲存縣市屬性
              district: row[headerIndices.district], // 儲存鄉鎮市區屬性
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonText.features.map((feature, index) => ({
      id: index + 1,
      name: feature.properties.name,
      ...feature.properties,
    })); // .map() 方法結束

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonText.features.length,
    };

    return {
      geoJsonText, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

export async function loadGeoJson(fileName) {
  try {
    const filePath = `/long-term-care-web/data/geojson/${fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonText = await response.json();

    geoJsonText.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.name = feature.properties.FULL;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonText.features.map((feature, index) => ({
      id: index + 1,
      名稱: feature.properties.name,
      中位數: feature.properties['中位數'],
      平均值: feature.properties['平均數'],
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonText.features.length,
    };

    return {
      geoJsonText, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
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

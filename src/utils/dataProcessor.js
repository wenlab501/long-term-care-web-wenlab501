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
 * 計算統計摘要
 * @param {Array} features - 地理特徵數組
 * @param {number} totalCount - 總數
 * @param {number} maxCount - 最大值
 * @param {number} minCount - 最小值
 * @param {number} nonZeroCount - 非零數量
 * @returns {Object} 包含摘要資訊的對象
 */
export function calculateSummaryData(features, totalCount, maxCount, minCount, nonZeroCount) {
  return {
    totalRegions: features.length,
    totalCount: totalCount,
    averageCount: features.length > 0 ? Math.round(totalCount / features.length) : 0,
    maxCount: maxCount,
    minCount: minCount,
    nonZeroRegions: nonZeroCount,
    zeroRegions: features.length - nonZeroCount,
  };
}

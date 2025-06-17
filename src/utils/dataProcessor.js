import * as d3 from 'd3';

// 社區照顧關懷據點
export async function loadCommunityCareCenterData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      行政區: headers.indexOf('行政區'),
      里別: headers.indexOf('里別'),
      據點名稱: headers.indexOf('據點名稱'),
      據點類型: headers.indexOf('據點類型'),
      據點地址: headers.indexOf('據點地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            行政區: row[headerIndices.行政區],
            里別: row[headerIndices.里別],
            據點名稱: row[headerIndices.據點名稱],
            據點類型: row[headerIndices.據點類型],
            據點地址: row[headerIndices.據點地址],
            聯絡電話: row[headerIndices.聯絡電話],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            據點名稱: row[headerIndices.據點名稱],
            據點地址: row[headerIndices.據點地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區整體照顧服務體系C級單位
export async function loadCLevelUnitData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      編號: headers.indexOf('編號'),
      據點名稱: headers.indexOf('據點名稱'),
      行政區: headers.indexOf('行政區'),
      里別: headers.indexOf('里別'),
      據點地址: headers.indexOf('據點地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            編號: row[headerIndices.編號],
            據點名稱: row[headerIndices.據點名稱],
            行政區: row[headerIndices.行政區],
            里別: row[headerIndices.里別],
            據點地址: row[headerIndices.據點地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.據點名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            據點名稱: row[headerIndices.據點名稱],
            據點地址: row[headerIndices.據點地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區照顧關懷據點辦理社區喘息服務(C+單位)
export async function loadRespiteCareCPlusUnitData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      編號: headers.indexOf('編號'),
      據點名稱: headers.indexOf('據點名稱'),
      行政區: headers.indexOf('行政區'),
      里別: headers.indexOf('里別'),
      據點地址: headers.indexOf('據點地址'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            編號: row[headerIndices.編號],
            據點名稱: row[headerIndices.據點名稱],
            行政區: row[headerIndices.行政區],
            里別: row[headerIndices.里別],
            據點地址: row[headerIndices.據點地址],
          };

          const popupData = {
            name: row[headerIndices.據點名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            據點名稱: row[headerIndices.據點名稱],
            據點地址: row[headerIndices.據點地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 公辦民營老人福利機構
export async function loadPublicElderlyWelfareInstitutionData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
    const rows = csvText.split('\n').map((row) => row.split('\t'));

    console.log('rows', rows);

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      機構名稱: headers.indexOf('機構名稱'),
      受託單位: headers.indexOf('受託單位'),
      地址: headers.indexOf('地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      連結網址: headers.indexOf('連結網址'),
      收住床數: headers.indexOf('收住床數'),
      服務對象: headers.indexOf('服務對象'),
      收費標準: headers.indexOf('收費標準'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            機構名稱: row[headerIndices.機構名稱],
            受託單位: row[headerIndices.受託單位],
            地址: row[headerIndices.地址],
            聯絡電話: row[headerIndices.聯絡電話],
            連結網址: row[headerIndices.連結網址],
            收住床數: row[headerIndices.收住床數],
            服務對象: row[headerIndices.服務對象],
            收費標準: row[headerIndices.收費標準],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 老人福利機構
export async function loadElderlyWelfareInstitutionData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      編號: headers.indexOf('編號'),
      屬性: headers.indexOf('屬性'),
      機構名稱: headers.indexOf('機構名稱'),
      區域別: headers.indexOf('區域別'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      收容對象: headers.indexOf('收容對象'),
      核定床數_核定總床位數: headers.indexOf('核定床數-核定總床位數'),
      核定床數_長照床數: headers.indexOf('核定床數-長照床數'),
      核定床數_養護床數: headers.indexOf('核定床數-養護床數'),
      核定床數_失智床數: headers.indexOf('核定床數-失智床數'),
      核定床數_安養床數: headers.indexOf('核定床數-安養床數'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            編號: row[headerIndices.編號],
            屬性: row[headerIndices.屬性],
            機構名稱: row[headerIndices.機構名稱],
            區域別: row[headerIndices.區域別],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
            收容對象: row[headerIndices.收容對象],
            核定床數_核定總床位數: row[headerIndices.核定床數_核定總床位數],
            核定床數_長照床數: row[headerIndices.核定床數_長照床數],
            核定床數_養護床數: row[headerIndices.核定床數_養護床數],
            核定床數_失智床數: row[headerIndices.核定床數_失智床數],
            核定床數_安養床數: row[headerIndices.核定床數_安養床數],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區整合型服務中心(A單位)
export async function loadCommunityIntegrationServiceCenterData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      單位名稱: headers.indexOf('單位名稱'),
      行政區: headers.indexOf('行政區'),
      服務區域: headers.indexOf('服務區域'),
      服務地址_聯絡電話: headers.indexOf('服務地址/聯絡電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          // 序號	單位名稱	行政區	服務區域	服務地址/聯絡電話
          const propertyData = {
            序號: row[headerIndices.序號],
            單位名稱: row[headerIndices.單位名稱],
            行政區: row[headerIndices.行政區],
            服務區域: row[headerIndices.服務區域],
            服務地址_聯絡電話: row[headerIndices.服務地址_聯絡電話],
          };

          const popupData = {
            name: row[headerIndices.單位名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            單位名稱: row[headerIndices.單位名稱],
            服務地址_聯絡電話: row[headerIndices.服務地址_聯絡電話],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 一般護理之家
export async function loadGeneralNursingHomeData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      開放床數: headers.indexOf('開放床數'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            開放床數: row[headerIndices.開放床數],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 住宿式長照機構
export async function loadResidentialLongTermCareData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      立案日期: headers.indexOf('立案日期'),
      評鑑資訊: headers.indexOf('評鑑資訊'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            開放床數: row[headerIndices.開放床數],
            立案日期: row[headerIndices.立案日期],
            評鑑資訊: row[headerIndices.評鑑資訊],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 住宿式喘息(GA05)及住宿式短照(SC05)服務單位
export async function load66Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      住宿式短照服務: headers.indexOf('住宿式短照服務(SC05)'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            住宿式短照服務: row[headerIndices.住宿式短照服務],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 居家式喘息(GA09)及居家式短照(SC09)服務單位
export async function load142Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      住宿式短照服務: headers.indexOf('住宿式短照服務(SC05)'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            住宿式短照服務: row[headerIndices.住宿式短照服務],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位
export async function load25Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      巷弄長照站短照服務: headers.indexOf('巷弄長照站短照服務(SC07)'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            巷弄長照站短照服務: row[headerIndices.巷弄長照站短照服務],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區式喘息(GA03/GA04/GA06)及社區式短照(SC03/SC04/SC06) 服務單位
export async function load41Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      GA03: headers.indexOf('GA03'),
      GA04: headers.indexOf('GA04'),
      GA06: headers.indexOf('GA06'),
      SC03: headers.indexOf('SC03'),
      SC04: headers.indexOf('SC04'),
      SC06: headers.indexOf('SC06'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            GA03: row[headerIndices.GA03],
            GA04: row[headerIndices.GA04],
            GA06: row[headerIndices.GA06],
            SC03: row[headerIndices.SC03],
            SC04: row[headerIndices.SC04],
            SC06: row[headerIndices.SC06],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 醫院/診所
export async function loadHospitalClinicData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      醫療院所: headers.indexOf('醫療院所'),
      縣市: headers.indexOf('縣市'),
      鄉鎮市區: headers.indexOf('鄉鎮市區'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            醫療院所: row[headerIndices.醫療院所],
            縣市: row[headerIndices.縣市],
            鄉鎮市區: row[headerIndices.鄉鎮市區],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.醫療院所],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            醫療院所: row[headerIndices.醫療院所],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.醫療院所],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 健保特約藥局
export async function loadHealthcareFacilityPharmacyData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      醫事機構代碼: headers.indexOf('醫事機構代碼'),
      醫事機構名稱: headers.indexOf('醫事機構名稱'),
      醫事機構種類: headers.indexOf('醫事機構種類'),
      電話: headers.indexOf('電話'),
      地址: headers.indexOf('地址'),
      分區業務組: headers.indexOf('分區業務組'),
      特約類別: headers.indexOf('特約類別'),
      服務項目: headers.indexOf('服務項目'),
      診療科別: headers.indexOf('診療科別'),
      終止合約或歇業日期: headers.indexOf('終止合約或歇業日期'),
      固定看診時段: headers.indexOf('固定看診時段'),
      備註: headers.indexOf('備註'),
      縣市別代碼: headers.indexOf('縣市別代碼'),
      合約起日: headers.indexOf('合約起日'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            醫事機構代碼: row[headerIndices.醫事機構代碼],
            醫事機構名稱: row[headerIndices.醫事機構名稱],
            醫事機構種類: row[headerIndices.醫事機構種類],
            電話: row[headerIndices.電話],
            地址: row[headerIndices.地址],
            分區業務組: row[headerIndices.分區業務組],
            特約類別: row[headerIndices.特約類別],
            服務項目: row[headerIndices.服務項目],
            診療科別: row[headerIndices.診療科別],
            終止合約或歇業日期: row[headerIndices.終止合約或歇業日期],
            固定看診時段: row[headerIndices.固定看診時段],
            備註: row[headerIndices.備註],
            縣市別代碼: row[headerIndices.縣市別代碼],
            合約起日: row[headerIndices.合約起日],
          };

          const popupData = {
            name: row[headerIndices.醫事機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            醫事機構名稱: row[headerIndices.醫事機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.醫事機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 三段年齡組性別人口統計
export async function loadPopulation3LevelsGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/long-term-care-web/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    let minValue = 0;
    let maxValue = 0;

    const values = geoJsonData.features
      .map((f) => parseFloat(f.properties[fieldName]))
      .filter((v) => !isNaN(v));

    minValue = d3.min(values);
    maxValue = d3.max(values);

    // ----------------------------

    // 您想使用的顏色數量
    const numColors = 10;
    const colors = d3.schemeRdBu[numColors];

    // --- 關鍵修改從這裡開始 ---

    // 1. 動態計算並產生 9 個 (numColors - 1)「整數」的間隔點
    const step = (maxValue - minValue) / numColors; // 每個區間的約略寬度
    const thresholds = d3.range(1, numColors).map((i) => {
      // d3.range(1, 10) 會產生 [1, 2, 3, 4, 5, 6, 7, 8, 9]
      // 我們用 Math.round() 來確保每個間隔點都是整數
      return Math.round(minValue + i * step);
    });

    // 此時 thresholds 可能會是像 [50, 100, 150, 200, 250, 300, 350, 400, 450] 這樣的整數陣列

    // 2. 使用 d3.scaleThreshold 並傳入我們計算好的間隔點
    const colorScale = d3
      .scaleThreshold()
      .domain(thresholds) // 輸入範圍：您定義的整數門檻
      .range(colors); // 輸出範圍：10 個顏色

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = `${feature.properties.COUNTY}${feature.properties.TOWN}${feature.properties.VILLAGE}`;
      feature.properties.value = parseFloat(feature.properties[fieldName]);
      feature.properties.fillColor = colorScale(feature.properties.value);

      const propertyData = {
        里名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        里名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: colorScale(feature.properties.value),
        里名: feature.properties.name,
        [fieldName]: feature.properties[fieldName],
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = colors.map((color, index) => {
      let label = '';
      let extent = [];

      // 判斷式：我們針對第一筆、最後一筆、以及中間的資料，給予不同的標籤格式

      if (index === 0) {
        // 【修正第一筆】顯示為 "< [第一個門檻值]"
        const upperBound = thresholds[0];
        label = `< ${Math.round(upperBound)}`;
        extent = [null, upperBound]; // 範圍的起始值用 null 表示
      } else if (index === colors.length - 1) {
        // 【修正最後一筆】顯示為 "> [最後一個門檻值]"
        const lowerBound = thresholds[thresholds.length - 1];
        label = `> ${Math.round(lowerBound)}`;
        extent = [lowerBound, null]; // 範圍的結束值用 null 表示
      } else {
        // 【中間項目】維持原本的 "起始 - 結束" 格式
        const lowerBound = thresholds[index - 1];
        const upperBound = thresholds[index];
        label = `${Math.round(lowerBound)} - ${Math.round(upperBound)}`;
        extent = [lowerBound, upperBound];
      }

      // 回傳結構化的物件
      return {
        color: color,
        label: label,
        extent: extent,
      };
    });

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 綜稅綜合所得總額
export async function loadIncomeGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/long-term-care-web/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    let minValue = 0;
    let maxValue = 0;

    const values = geoJsonData.features
      .map((f) => parseFloat(f.properties[fieldName]))
      .filter((v) => !isNaN(v));

    minValue = d3.min(values);
    maxValue = d3.max(values);

    // ----------------------------

    // 建立一個使用內建「紅白藍」色帶的發散型比例尺
    // const colorScale = d3
    //   .scaleSequential()
    //   .domain([minValue, maxValue]) // 輸入範圍：[最小值, 最大值]
    //   .interpolator(d3.interpolateYlGnBu); // [關鍵] 直接使用 D3 內建的顏色產生器

    const colorScale = d3
      .scaleQuantize()
      .domain([minValue, maxValue]) // 輸入範圍：[最小值, 最大值]
      // [關鍵] 輸出範圍：直接從 D3 的色彩方案中取 5 個顏色
      // d3.schemeRdBu 是 D3 內建的「紅-白-藍」發散型色彩方案
      .range(d3.schemeRdBu[10]);

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.FULL;
      feature.properties.value = parseFloat(feature.properties[fieldName]);
      feature.properties.fillColor = colorScale(feature.properties.value);

      const propertyData = {
        里名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        里名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: colorScale(feature.properties.value),
        里名: feature.properties.name,
        [fieldName]: feature.properties[fieldName],
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = colorScale.range().map((color) => {
      // 1. 使用 invertExtent() 找出顏色對應的數值區間 [start, end]
      const extent = colorScale.invertExtent(color);

      // 2. 組合出標籤文字
      const label = `${extent[0]} - ${extent[1]}`;

      // 3. 回傳結構化的物件
      return {
        color: color,
        label: label,
        extent: extent, // 也可以把原始區間放進來，以備不時之需
      };
    });

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 4大超商
export async function loadConvenienceStoreData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/long-term-care-web/data/csv/${layer.fileName}`;

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
      公司統一編號: headers.indexOf('公司統一編號'),
      公司名稱: headers.indexOf('公司名稱'),
      分公司統一編號: headers.indexOf('分公司統一編號'),
      分公司名稱: headers.indexOf('分公司名稱'),
      分公司地址: headers.indexOf('分公司地址'),
      分公司狀態: headers.indexOf('分公司狀態'),
      分公司核准設立日期: headers.indexOf('分公司核准設立日期'),
      分公司最後核准變更日期: headers.indexOf('分公司最後核准變更日期'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            公司統一編號: row[headerIndices.公司統一編號],
            公司名稱: row[headerIndices.公司名稱],
            分公司統一編號: row[headerIndices.分公司統一編號],
            分公司名稱: row[headerIndices.分公司名稱],
            分公司地址: row[headerIndices.分公司地址],
            分公司狀態: row[headerIndices.分公司狀態],
            分公司核准設立日期: row[headerIndices.分公司核准設立日期],
          };

          const popupData = {
            name: row[headerIndices.分公司名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            公司名稱: row[headerIndices.公司名稱],
            分公司名稱: row[headerIndices.分公司名稱],
            分公司地址: row[headerIndices.分公司地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.分公司名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 捷運站點
export async function loadMRTStationGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/long-term-care-web/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.NAME;
      feature.properties.fillColor = null;

      const propertyData = {
        站名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        站名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: layer.color,
        站名: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = null;

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 公車站點
export async function loadBusStopGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/long-term-care-web/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.BSM_CHINES;
      feature.properties.fillColor = null;

      const propertyData = {
        站名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        站名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: layer.color,
        站名: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = null;

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 臺北市區界圖
export async function loadTaipeiDistrictGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/long-term-care-web/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.PTNAME;
      feature.properties.fillColor = null;

      const propertyData = {
        區名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        區名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: layer.color,
        區名: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = null;

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

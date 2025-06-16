import * as d3 from 'd3';

// 老人福利機
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

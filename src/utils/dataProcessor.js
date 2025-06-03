import * as XLSX from 'xlsx'

/**
 * 讀取GeoJSON文件並自動轉換座標系統
 * @param {string} filePath - 文件路徑
 * @param {boolean} autoConvert - 是否自動轉換座標系統 (預設: true)
 * @returns {Promise<Object>} GeoJSON數據 (已轉換為 WGS84)
 */
export async function loadGeoJSON(filePath, autoConvert = true) {
  try {
    console.log(`🔽 載入 GeoJSON: ${filePath}`)
    
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const geojsonData = await response.json()
    
    console.log(`✅ GeoJSON 載入成功: ${geojsonData.features?.length || 0} 個要素`)
    
    // 🔥 自動檢測並轉換座標系統
    if (autoConvert && geojsonData.features && geojsonData.features.length > 0) {
      try {
        // 動態導入座標分析函數
        const { detectCoordinateSystem, transformGeoJSONCoordinates } = await import('./spatialAnalysis.js')
        
        // 檢測座標系統
        const firstFeature = geojsonData.features[0]
        if (firstFeature.geometry && firstFeature.geometry.coordinates) {
          // 提取樣本座標進行檢測
          let sampleCoord = null
          const geometry = firstFeature.geometry
          
          switch (geometry.type) {
            case 'Point':
              sampleCoord = geometry.coordinates
              break
            case 'LineString':
            case 'MultiPoint':
              sampleCoord = geometry.coordinates[0]
              break
            case 'Polygon':
            case 'MultiLineString':
              sampleCoord = geometry.coordinates[0][0]
              break
            case 'MultiPolygon':
              sampleCoord = geometry.coordinates[0][0][0]
              break
          }
          
          if (sampleCoord && Array.isArray(sampleCoord) && sampleCoord.length >= 2) {
            const detectedSystem = detectCoordinateSystem(sampleCoord)
            console.log(`🔍 檢測到座標系統: ${detectedSystem}`)
            console.log(`🔍 樣本座標: [${sampleCoord[0]}, ${sampleCoord[1]}]`)
            
            // 如果是 TWD97，自動轉換為 WGS84
            if (detectedSystem === 'TWD97') {
              console.log('🌐 自動轉換座標系統: TWD97 → WGS84')
              const convertedGeoJSON = transformGeoJSONCoordinates(geojsonData, 'TWD97', 'WGS84')
              
              // 添加轉換標記
              convertedGeoJSON._autoConverted = true
              convertedGeoJSON._conversionInfo = {
                from: 'TWD97',
                to: 'WGS84',
                timestamp: Date.now(),
                source: 'loadGeoJSON'
              }
              
              console.log('✅ 座標自動轉換完成')
              return convertedGeoJSON
            } else if (detectedSystem === 'WGS84') {
              console.log('✅ 座標已是 WGS84，無需轉換')
              // 添加標記表示無需轉換
              geojsonData._autoConverted = false
              geojsonData._conversionInfo = {
                detected: 'WGS84',
                needsConversion: false,
                timestamp: Date.now()
              }
            } else {
              console.log('⚠️ 未知座標系統，保持原樣')
              geojsonData._autoConverted = false
              geojsonData._conversionInfo = {
                detected: 'UNKNOWN',
                needsConversion: false,
                timestamp: Date.now()
              }
            }
          }
        }
      } catch (conversionError) {
        console.error('⚠️ 座標轉換過程中發生錯誤，保持原始資料:', conversionError)
        geojsonData._autoConverted = false
        geojsonData._conversionError = conversionError.message
      }
    }
    
    return geojsonData
  } catch (error) {
    console.error('❌ 載入 GeoJSON 失敗:', error)
    throw error
  }
}

/**
 * 讀取Excel文件的特定工作表
 * @param {string} filePath - 文件路徑
 * @param {string} sheetName - 工作表名稱
 * @returns {Promise<Array>} Excel數據陣列
 */
export async function loadExcelSheet(filePath, sheetName) {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`)
    }
    
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    
    return jsonData
  } catch (error) {
    console.error('Error loading Excel file:', error)
    throw error
  }
}

/**
 * 合併GeoJSON和Excel數據
 * @param {Object} geojsonData - GeoJSON數據
 * @param {Array} excelData - Excel數據陣列
 * @param {string} geojsonKey - GeoJSON中的合併欄位 (預設: 'CODE2')
 * @param {string} excelKey - Excel中的合併欄位 (預設: 'name')
 * @returns {Object} 合併後的數據
 */
export function mergeGeoJSONWithExcel(geojsonData, excelData, geojsonKey = 'CODE2', excelKey = 'name') {
  try {
    // 創建Excel數據的查找表，處理大小寫問題
    const excelLookup = {}
    excelData.forEach(row => {
      const key = row[excelKey]
      if (key) {
        // 將Excel的name轉換為大寫以匹配GeoJSON的CODE2
        const normalizedKey = String(key).toUpperCase()
        excelLookup[normalizedKey] = row
      }
    })
    
    console.log('Excel lookup keys sample:', Object.keys(excelLookup).slice(0, 10))
    
    // 複製GeoJSON數據避免修改原始數據
    const mergedGeoJSON = {
      ...geojsonData,
      features: geojsonData.features.map(feature => {
        const geoKey = feature.properties[geojsonKey]
        console.log('GeoJSON key:', geoKey)
        
        // GeoJSON的CODE2已經是大寫，直接使用
        const normalizedGeoKey = String(geoKey || '').toUpperCase()
        const matchedExcelRow = excelLookup[normalizedGeoKey]
        
        if (matchedExcelRow) {
          console.log(`匹配成功: ${geoKey} -> ${matchedExcelRow[excelKey]}`)
        }
        
        return {
          ...feature,
          properties: {
            ...feature.properties,
            // 合併Excel數據，如果有的話
            ...(matchedExcelRow || {}),
            // 確保基本欄位有預設值（覆蓋任何undefined值）
            count: matchedExcelRow ? (matchedExcelRow.count || 0) : 0,
            name: matchedExcelRow ? (matchedExcelRow.name || '') : '',
            // 添加合併狀態標記
            _merged: !!matchedExcelRow,
            // 保留原始鍵值
            originalGeoKey: geoKey,
            originalExcelKey: matchedExcelRow ? matchedExcelRow[excelKey] : null
          }
        }
      })
    }
    
    // 創建表格數據
    const tableData = mergedGeoJSON.features.map((feature, index) => {
      const props = feature.properties
      return {
        id: index + 1,
        [geojsonKey.toLowerCase()]: props[geojsonKey] || '',
        [excelKey]: props[excelKey] || '',
        count: props.count || 0,
        merged: props._merged ? '成功' : '失敗',
        originalGeoKey: props.originalGeoKey,
        originalExcelKey: props.originalExcelKey,
        // 添加所有properties以便完整顯示
        ...props
      }
    })
    
    const mergedCount = tableData.filter(row => row.merged === '成功').length
    
    console.log(`合併結果: ${mergedCount}/${geojsonData.features.length} 成功合併`)
    console.log('Sample merged feature:', mergedGeoJSON.features[0]?.properties)
    
    return {
      mergedGeoJSON,
      tableData,
      summary: {
        totalFeatures: geojsonData.features.length,
        mergedCount: mergedCount,
        excelRows: excelData.length,
        mergeRate: ((mergedCount / geojsonData.features.length) * 100).toFixed(1)
      }
    }
  } catch (error) {
    console.error('Error merging data:', error)
    throw error
  }
}

/**
 * TWD97 (EPSG:3826) 轉 WGS84 (EPSG:4326) 座標轉換
 * 簡化的座標轉換，適用於台灣地區
 * @param {number} x - TWD97 X座標
 * @param {number} y - TWD97 Y座標  
 * @returns {Array} [lng, lat] WGS84座標
 */
export function twd97ToWgs84(x, y) {
  // TWD97轉換參數（簡化版本，適用於台灣地區）
  const k0 = 0.9999 // 比例因子
  const dx = 250000 // 東偏移量
  
  const y_norm = y / k0
  const x_norm = (x - dx) / k0
  
  // 概算轉換（適用於台灣地區的近似轉換）
  const lat = 23.0 + (y_norm - 2500000) / 111000
  const lng = 121.0 + x_norm / (111000 * Math.cos(lat * Math.PI / 180))
  
  return [lng, lat]
}

/**
 * 色票定義 - 多種配色方案
 */
export const COLOR_SCHEMES = {
  // 預設藍綠漸變
  default: {
    name: '預設 (藍→綠→黃→紅)',
    colors: ['#e0e0e0', '#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
    description: '經典的冷暖色調漸變'
  },
  // 熱力圖
  heat: {
    name: '熱力圖 (黑→紅→黃→白)',
    colors: ['#e0e0e0', '#000000', '#8B0000', '#FF0000', '#FF4500', '#FFA500', '#FFFF00', '#FFFFFF'],
    description: '模擬熱力圖效果'
  },
  // 藍色系
  blues: {
    name: '藍色系 (淺藍→深藍)',
    colors: ['#e0e0e0', '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0'],
    description: '藍色單色漸變'
  },
  // 綠色系
  greens: {
    name: '綠色系 (淺綠→深綠)',
    colors: ['#e0e0e0', '#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32'],
    description: '綠色單色漸變'
  },
  // 紅色系 
  reds: {
    name: '紅色系 (淺紅→深紅)',
    colors: ['#e0e0e0', '#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828'],
    description: '紅色單色漸變'
  },
  // 彩虹光譜
  rainbow: {
    name: '彩虹光譜 (紫→藍→綠→黃→橙→紅)',
    colors: ['#e0e0e0', '#9C27B0', '#3F51B5', '#2196F3', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'],
    description: '完整光譜顏色'
  },
  // 地形圖
  terrain: {
    name: '地形圖 (綠→棕→白)',
    colors: ['#e0e0e0', '#1a472a', '#2d5c3e', '#4a7c59', '#6b8e3d', '#8fac3c', '#b8c54f', '#d4d967', '#e8e383', '#f5f0a5'],
    description: '模擬地形高度'
  },
  // 海洋
  ocean: {
    name: '海洋 (深藍→淺藍)',
    colors: ['#e0e0e0', '#001f3f', '#002a5c', '#003d82', '#0056b3', '#0077be', '#009ffd', '#66ccff', '#b3e0ff', '#e0f2ff'],
    description: '海洋深度模擬'
  }
}

/**
 * 根據色票和count值生成顏色
 * @param {number} count - 數值
 * @param {number} maxCount - 最大值
 * @param {string} scheme - 色票方案名稱
 * @returns {string} 顏色值
 */
export function getColorByCount(count, maxCount, scheme = 'default') {
  if (!count || count === 0) return COLOR_SCHEMES[scheme]?.colors[0] || '#e0e0e0'
  
  const colors = COLOR_SCHEMES[scheme]?.colors || COLOR_SCHEMES.default.colors
  const ratio = Math.min(count / maxCount, 1) // 確保不超過1
  
  // 跳過第一個顏色（無數據顏色），使用剩餘顏色進行漸變
  const gradientColors = colors.slice(1)
  
  if (gradientColors.length === 0) return colors[0]
  if (gradientColors.length === 1) return gradientColors[0]
  
  // 計算在漸變中的位置
  const position = ratio * (gradientColors.length - 1)
  const index = Math.floor(position)
  const remainder = position - index
  
  // 如果正好在顏色點上
  if (remainder === 0 || index >= gradientColors.length - 1) {
    return gradientColors[Math.min(index, gradientColors.length - 1)]
  }
  
  // 線性插值兩個顏色
  const color1 = gradientColors[index]
  const color2 = gradientColors[index + 1]
  
  return interpolateColor(color1, color2, remainder)
}

/**
 * 線性插值兩個顏色
 * @param {string} color1 - 起始顏色 (hex)
 * @param {string} color2 - 結束顏色 (hex)
 * @param {number} factor - 插值因子 (0-1)
 * @returns {string} 插值後的顏色
 */
function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  
  if (!c1 || !c2) return color1
  
  const r = Math.round(c1.r + (c2.r - c1.r) * factor)
  const g = Math.round(c1.g + (c2.g - c1.g) * factor)
  const b = Math.round(c1.b + (c2.b - c1.b) * factor)
  
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * 將hex顏色轉換為RGB
 * @param {string} hex - hex顏色值
 * @returns {Object|null} RGB對象或null
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * 載入並合併台南市數據
 * @returns {Promise<Object>} 合併後的數據
 */
export async function loadTainanData() {
  try {
    console.log('🚀 開始載入台南市數據...')
    
    // 🔥 步驟 1: 並行載入兩個原始文件（GeoJSON 會自動轉換為 WGS84）
    console.log('📊 步驟 1: 載入 GeoJSON 和 Excel 文件...')
    const [geojsonData, excelData] = await Promise.all([
      loadGeoJSON('/donkey-fever-analysis/data/geojson/台南市區_2.geojson'), // 自動轉換為 WGS84
      loadExcelSheet('/donkey-fever-analysis/data/xlsx/Dengue Daily.xlsx', '15_台南市區_合併位置_2')
    ])
    
    console.log('✅ 資料載入完成:')
    console.log(`   - GeoJSON features: ${geojsonData.features.length}`)
    console.log(`   - Excel rows: ${excelData.length}`)
    
    // 🔥 檢查座標轉換結果
    if (geojsonData._autoConverted) {
      console.log('✅ GeoJSON 座標已自動轉換為 WGS84')
    } else if (geojsonData._conversionInfo?.detected === 'WGS84') {
      console.log('✅ GeoJSON 座標已是 WGS84 格式')
    } else {
      console.log('⚠️ GeoJSON 座標轉換狀態未知')
    }
    
    // 🔥 步驟 2: 合併 GeoJSON 和 Excel 數據
    console.log('🔗 步驟 2: 合併 GeoJSON 和 Excel 數據...')
    
    // 檢查數據樣本
    if (geojsonData.features.length > 0) {
      console.log('   - GeoJSON sample properties:', geojsonData.features[0].properties)
      console.log('   - GeoJSON sample coordinates:', geojsonData.features[0].geometry.coordinates[0][0])
    }
    if (excelData.length > 0) {
      console.log('   - Excel sample row:', excelData[0])
    }
    
    // 合併數據，使用正確的欄位名稱
    const mergedData = mergeGeoJSONWithExcel(geojsonData, excelData, 'CODE2', 'name')
    
    console.log('✅ 數據合併完成:', mergedData.summary)
    
    // 🔥 返回完整的處理結果
    const finalResult = {
      // 原始 GeoJSON（已轉換為 WGS84）
      rawGeoJSON: geojsonData,
      // 合併後的 GeoJSON（WGS84）- 這個用於地圖顯示
      mergedGeoJSON: mergedData.mergedGeoJSON,
      // 為了向後相容，convertedGeoJSON 指向相同的合併資料
      convertedGeoJSON: mergedData.mergedGeoJSON,
      // Excel 數據
      excelData,
      // 表格數據
      tableData: mergedData.tableData,
      // 統計摘要
      summary: {
        ...mergedData.summary,
        coordinateSystem: 'WGS84',
        autoConverted: geojsonData._autoConverted,
        conversionInfo: geojsonData._conversionInfo
      }
    }
    
    console.log('🎉 台南市數據處理完成!')
    console.log('📋 處理摘要:')
    console.log(`   - 總要素數: ${finalResult.summary.totalFeatures}`)
    console.log(`   - 成功合併: ${finalResult.summary.mergedCount}`)
    console.log(`   - 合併率: ${finalResult.summary.mergeRate}%`)
    console.log(`   - 座標系統: WGS84 ${geojsonData._autoConverted ? '(已自動轉換)' : '(原始格式)'}`)
    
    return finalResult
    
  } catch (error) {
    console.error('❌ 載入台南市數據失敗:', error)
    throw error
  }
}

/**
 * 🔥 載入測試數據（當檔案無法存取時的後備方案）
 * @returns {Promise<Object>} 測試數據 (已轉換為 WGS84)
 */
export async function loadTestData() {
  console.log('📊 載入測試數據...')
  
  // 建立假的 TWD97 GeoJSON 數據
  const testGeoJSON = {
    "type": "FeatureCollection",
    "crs": {
      "type": "name",
      "properties": {
        "name": "urn:ogc:def:crs:EPSG::3826"
      }
    },
    "features": [
      {
        "type": "Feature",
        "properties": {
          "CODE2": "A6733-36",
          "TOWN_ID": "67000330",
          "TOWN": "南區",
          "COUNTY_ID": "67000",
          "COUNTY": "臺南市",
          "U_ID": 7379,
          "AREA": 8706028.2661,
          "X": 165859.5201,
          "Y": 2539484.716
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[
            [165295.003478, 2540755.067444],
            [165352.703178, 2540655.499944],
            [165456.484378, 2540459.749944],
            [165474.265678, 2540427.249944],
            [165496.515678, 2540409.499944],
            [165295.003478, 2540755.067444]
          ]]]
        }
      },
      {
        "type": "Feature", 
        "properties": {
          "CODE2": "A6735-16",
          "TOWN_ID": "67000350",
          "TOWN": "安南區",
          "COUNTY_ID": "67000", 
          "COUNTY": "臺南市",
          "U_ID": 7447,
          "AREA": 5652502.0812,
          "X": 165075.7151,
          "Y": 2551011.177
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[
            [165091.617678, 2551702.102044],
            [165134.046178, 2551687.928844],
            [165175.440378, 2551708.420044],
            [165238.602778, 2551726.759844],
            [165091.617678, 2551702.102044]
          ]]]
        }
      }
    ]
  }
  
  // 建立假的 Excel 數據
  const testExcelData = [
    {
      "name": "南區",
      "count": 25,
      "population": 125000,
      "density": 0.2
    },
    {
      "name": "安南區", 
      "count": 18,
      "population": 195000,
      "density": 0.092
    }
  ]
  
  try {
    // 🔥 步驟 1: 自動轉換座標系統（模擬 loadGeoJSON 的行為）
    console.log('🌐 自動轉換測試資料座標系統 TWD97 → WGS84...')
    
    // 動態導入座標轉換函數
    const { transformGeoJSONCoordinates } = await import('./spatialAnalysis.js')
    
    // 轉換 GeoJSON 座標
    const convertedGeoJSON = transformGeoJSONCoordinates(testGeoJSON, 'TWD97', 'WGS84')
    
    // 添加轉換標記（模擬 loadGeoJSON 的行為）
    convertedGeoJSON._autoConverted = true
    convertedGeoJSON._conversionInfo = {
      from: 'TWD97',
      to: 'WGS84',
      timestamp: Date.now(),
      source: 'loadTestData'
    }
    
    console.log('✅ 測試資料座標轉換完成')
    
    // 🔥 步驟 2: 合併數據（使用 TOWN 欄位匹配）
    const mergedData = mergeGeoJSONWithExcel(convertedGeoJSON, testExcelData, 'TOWN', 'name')
    
    // 🔥 返回與 loadTainanData 相同的數據結構
    const finalResult = {
      // 原始 GeoJSON（已轉換為 WGS84）
      rawGeoJSON: convertedGeoJSON,
      // 合併後的 GeoJSON（WGS84）- 這個用於地圖顯示
      mergedGeoJSON: mergedData.mergedGeoJSON,
      // 為了向後相容，convertedGeoJSON 指向相同的合併資料
      convertedGeoJSON: mergedData.mergedGeoJSON,
      // Excel 數據
      excelData: testExcelData,
      // 表格數據
      tableData: mergedData.tableData,
      // 統計摘要
      summary: {
        ...mergedData.summary,
        coordinateSystem: 'WGS84',
        autoConverted: convertedGeoJSON._autoConverted,
        conversionInfo: convertedGeoJSON._conversionInfo
      }
    }
    
    console.log('✅ 測試數據載入完成:', finalResult.summary)
    console.log(`   - 總要素數: ${finalResult.summary.totalFeatures}`)
    console.log(`   - 成功合併: ${finalResult.summary.mergedCount}`)
    console.log(`   - 座標系統: WGS84 (已自動轉換)`)
    
    return finalResult
    
  } catch (error) {
    console.error('❌ 測試數據載入失敗:', error)
    
    // 如果轉換失敗，返回原始數據作為後備
    const mergedData = mergeGeoJSONWithExcel(testGeoJSON, testExcelData, 'TOWN', 'name')
    
    return {
      rawGeoJSON: testGeoJSON,
      mergedGeoJSON: mergedData.mergedGeoJSON,
      convertedGeoJSON: mergedData.mergedGeoJSON,
      excelData: testExcelData,
      tableData: mergedData.tableData,
      summary: {
        ...mergedData.summary,
        coordinateSystem: 'TWD97',
        autoConverted: false,
        conversionError: error.message
      }
    }
  }
} 
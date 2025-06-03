import * as XLSX from 'xlsx'

/**
 * 讀取GeoJSON文件
 * @param {string} filePath - 文件路徑
 * @returns {Promise<Object>} GeoJSON數據
 */
export async function loadGeoJSON(filePath) {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const geojsonData = await response.json()
    return geojsonData
  } catch (error) {
    console.error('Error loading GeoJSON:', error)
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
 * @param {string} geojsonKey - GeoJSON中的合併欄位 (預設: 'code2')
 * @param {string} excelKey - Excel中的合併欄位 (預設: 'name')
 * @returns {Object} 合併後的數據
 */
export function mergeGeoJSONWithExcel(geojsonData, excelData, geojsonKey = 'code2', excelKey = 'name') {
  try {
    // 創建Excel數據的查找表
    const excelLookup = {}
    excelData.forEach(row => {
      const key = row[excelKey]
      if (key) {
        excelLookup[key] = row
      }
    })
    
    // 複製GeoJSON數據避免修改原始數據
    const mergedGeoJSON = {
      ...geojsonData,
      features: geojsonData.features.map(feature => {
        const geoKey = feature.properties[geojsonKey]
        const matchedExcelRow = excelLookup[geoKey]
        
        return {
          ...feature,
          properties: {
            ...feature.properties,
            ...(matchedExcelRow || {}),
            // 添加合併狀態標記
            _merged: !!matchedExcelRow
          }
        }
      })
    }
    
    // 創建表格數據
    const tableData = mergedGeoJSON.features.map((feature, index) => {
      const props = feature.properties
      return {
        id: index + 1,
        [geojsonKey]: props[geojsonKey] || '',
        [excelKey]: props[excelKey] || '',
        count: props.count || 0,
        merged: props._merged ? '成功' : '失敗',
        ...props
      }
    })
    
    return {
      mergedGeoJSON,
      tableData,
      summary: {
        totalFeatures: geojsonData.features.length,
        mergedCount: tableData.filter(row => row.merged === '成功').length,
        excelRows: excelData.length
      }
    }
  } catch (error) {
    console.error('Error merging data:', error)
    throw error
  }
}

/**
 * 根據count值生成顏色
 * @param {number} count - 數值
 * @param {number} maxCount - 最大值
 * @returns {string} 顏色值
 */
export function getColorByCount(count, maxCount) {
  if (!count || count === 0) return '#e0e0e0' // 灰色表示無數據
  
  const ratio = count / maxCount
  
  // 使用色彩漸變：藍色(低) -> 綠色(中) -> 黃色(高) -> 紅色(最高)
  if (ratio <= 0.25) {
    return `rgb(${Math.floor(ratio * 4 * 255)}, 0, 255)` // 藍到紫
  } else if (ratio <= 0.5) {
    return `rgb(0, ${Math.floor((ratio - 0.25) * 4 * 255)}, 255)` // 紫到藍
  } else if (ratio <= 0.75) {
    return `rgb(0, 255, ${Math.floor(255 - (ratio - 0.5) * 4 * 255)})` // 藍到綠
  } else {
    return `rgb(${Math.floor((ratio - 0.75) * 4 * 255)}, 255, 0)` // 綠到黃到紅
  }
}

/**
 * 載入並合併台南市數據
 * @returns {Promise<Object>} 合併後的數據
 */
export async function loadTainanData() {
  try {
    console.log('開始載入台南市數據...')
    
    // 並行載入兩個文件
    const [geojsonData, excelData] = await Promise.all([
      loadGeoJSON('/donkey-fever-analysis/data/geojson/台南市區_2.geojson'),
      loadExcelSheet('/donkey-fever-analysis/data/xlsx/Dengue Daily.xlsx', '14_台南市區_合併位置_2')
    ])
    
    console.log('GeoJSON features:', geojsonData.features.length)
    console.log('Excel rows:', excelData.length)
    
    // 合併數據
    const mergedData = mergeGeoJSONWithExcel(geojsonData, excelData, 'code2', 'name')
    
    console.log('數據合併完成:', mergedData.summary)
    
    return mergedData
  } catch (error) {
    console.error('載入台南市數據失敗:', error)
    throw error
  }
} 
/**
 * 空間分析計算工具庫
 * 提供進階空間分析功能，包括K最近鄰、空間滯後、座標轉換等
 */

import proj4 from 'proj4'
import { calculateDistance } from './geographicCalculate.js'

// 🔥 修正：使用正確的 TWD97 座標系統定義（參考 mapStore.js）
proj4.defs('EPSG:3826', '+title=TWD97 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs')
proj4.defs('EPSG:4326', '+title=WGS84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')

/**
 * 初始化座標系統定義（確保在任何轉換前都已定義）
 */
export function initializeCoordinateSystem() {
  // 確保座標系統已正確定義
  console.log('🌐 SpatialAnalysis: 初始化座標系統定義')
  console.log('🌐 TWD97 (EPSG:3826): 台灣大地測量系統1997二度分帶投影')
  console.log('🌐 WGS84 (EPSG:4326): 世界大地測量系統1984經緯度座標')
}

/**
 * 🔥 新增：解析 GeoJSON 的 CRS 資訊
 * @param {Object} geojson - GeoJSON 物件
 * @returns {string} 座標系統代碼 ('TWD97', 'WGS84', 'UNKNOWN')
 */
export function parseGeoJSONCRS(geojson) {
  if (!geojson) return 'UNKNOWN'
  
  // 檢查 crs 屬性
  if (geojson.crs && geojson.crs.properties) {
    const crsName = geojson.crs.properties.name
    console.log(`🔍 檢測到 GeoJSON CRS: ${crsName}`)
    
    // 支援多種 CRS 格式
    if (crsName.includes('3826') || crsName.includes('TWD97')) {
      console.log('✅ 識別為 TWD97 座標系統')
      return 'TWD97'
    }
    if (crsName.includes('4326') || crsName.includes('WGS84')) {
      console.log('✅ 識別為 WGS84 座標系統')
      return 'WGS84'
    }
  }
  
  // 如果沒有 CRS 資訊，嘗試從座標範圍判斷
  if (geojson.features && geojson.features.length > 0) {
    const sampleCoords = getSampleCoordinates(geojson.features[0].geometry)
    if (sampleCoords) {
      const detected = detectCoordinateSystem(sampleCoords)
      console.log(`🔍 透過座標範圍檢測座標系統: ${detected}，樣本座標: [${sampleCoords[0]}, ${sampleCoords[1]}]`)
      return detected
    }
  }
  
  return 'UNKNOWN'
}

/**
 * 轉換座標從 TWD97 到 WGS84
 * @param {number} x - TWD97 東座標
 * @param {number} y - TWD97 北座標
 * @returns {Array} [lng, lat] WGS84 經緯度座標
 */
export function transformTWD97ToWGS84(x, y) {
  try {
    // 🔥 修正：確保座標系統已定義
    initializeCoordinateSystem()
    
    // 🔥 驗證輸入座標範圍
    if (x < 100000 || x > 400000) {
      console.warn(`⚠️ TWD97 東座標超出正常範圍: ${x}`)
    }
    if (y < 2400000 || y > 2800000) {
      console.warn(`⚠️ TWD97 北座標超出正常範圍: ${y}`)
    }
    
    const [lng, lat] = proj4('EPSG:3826', 'EPSG:4326', [x, y])
    
    // 🔥 驗證輸出座標範圍（台灣地區）
    if (lng < 119 || lng > 122 || lat < 21.5 || lat > 25.5) {
      console.warn(`⚠️ 轉換後座標超出台灣範圍: [${lng}, ${lat}]`)
    }
    
    return [lng, lat]
  } catch (error) {
    console.error('❌ TWD97→WGS84 座標轉換失敗:', error)
    console.error(`❌ 輸入座標: TWD97[${x}, ${y}]`)
    return [x, y] // 返回原座標作為後備
  }
}

/**
 * 轉換座標從 WGS84 到 TWD97
 * @param {number} lng - WGS84 經度
 * @param {number} lat - WGS84 緯度
 * @returns {Array} [x, y] TWD97 平面座標
 */
export function transformWGS84ToTWD97(lng, lat) {
  try {
    // 🔥 修正：確保座標系統已定義
    initializeCoordinateSystem()
    
    // 🔥 驗證輸入座標範圍（台灣地區）
    if (lng < 119 || lng > 122 || lat < 21.5 || lat > 25.5) {
      console.warn(`⚠️ WGS84 座標超出台灣範圍: [${lng}, ${lat}]`)
    }
    
    const [x, y] = proj4('EPSG:4326', 'EPSG:3826', [lng, lat])
    
    // 🔥 驗證輸出座標範圍
    if (x < 100000 || x > 400000 || y < 2400000 || y > 2800000) {
      console.warn(`⚠️ 轉換後TWD97座標超出正常範圍: [${x}, ${y}]`)
    }
    
    return [x, y]
  } catch (error) {
    console.error('❌ WGS84→TWD97 座標轉換失敗:', error)
    console.error(`❌ 輸入座標: WGS84[${lng}, ${lat}]`)
    return [lng, lat] // 返回原座標作為後備
  }
}

/**
 * 🔥 新增：檢測座標系統類型
 * @param {Array} coordinates - 座標陣列 [x, y] 或 [lng, lat]
 * @returns {string} 'TWD97' | 'WGS84' | 'UNKNOWN'
 */
export function detectCoordinateSystem(coordinates) {
  // 🔥 加強輸入驗證
  if (!coordinates) {
    console.warn('detectCoordinateSystem: coordinates is null or undefined')
    return 'UNKNOWN'
  }
  
  if (!Array.isArray(coordinates)) {
    console.warn('detectCoordinateSystem: coordinates is not an array:', typeof coordinates)
    return 'UNKNOWN'
  }
  
  if (coordinates.length < 2) {
    console.warn('detectCoordinateSystem: coordinates array too short:', coordinates.length)
    return 'UNKNOWN'
  }
  
  const [x, y] = coordinates
  
  // 🔥 檢查座標值是否為數字
  if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
    console.warn('detectCoordinateSystem: invalid coordinate values:', [x, y])
    return 'UNKNOWN'
  }
  
  // TWD97 座標範圍檢測
  if (x >= 100000 && x <= 400000 && y >= 2400000 && y <= 2800000) {
    return 'TWD97'
  }
  
  // WGS84 座標範圍檢測（台灣地區）
  if (x >= 119 && x <= 122 && y >= 21.5 && y <= 25.5) {
    return 'WGS84'
  }
  
  // 模糊判斷：大數值可能是 TWD97
  if (x > 10000 || y > 10000) {
    return 'TWD97'
  }
  
  // 小數值可能是 WGS84
  if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
    return 'WGS84'
  }
  
  return 'UNKNOWN'
}

/**
 * 🔥 強化：轉換GeoJSON座標系統（支援 CRS 檢測和自動轉換）
 * @param {Object} geojson - GeoJSON物件
 * @param {string} fromCRS - 來源座標系統 (可選，自動檢測)
 * @param {string} toCRS - 目標座標系統 (預設 'WGS84')
 * @returns {Object} 轉換後的GeoJSON物件
 */
export function transformGeoJSONCoordinates(geojson, fromCRS = null, toCRS = 'WGS84') {
  if (!geojson || !geojson.features) return geojson

  // 🔥 首先檢查 GeoJSON 的 CRS 定義
  let detectedFromCRS = fromCRS
  if (!detectedFromCRS) {
    detectedFromCRS = parseGeoJSONCRS(geojson)
  }
  
  console.log(`🔄 開始轉換GeoJSON座標系統: ${detectedFromCRS} → ${toCRS}`)
  
  // 如果來源和目標座標系統相同，直接返回
  if (detectedFromCRS === toCRS) {
    console.log(`✅ 座標系統已是 ${toCRS}，無需轉換`)
    return geojson
  }
  
  const transformedGeoJSON = { ...geojson }
  transformedGeoJSON.features = geojson.features.map((feature, index) => {
    const transformedFeature = { ...feature }
    
    if (feature.geometry && feature.geometry.coordinates) {
      // 🔥 如果還沒檢測到座標系統，從個別要素檢測
      let finalFromCRS = detectedFromCRS
      if (finalFromCRS === 'UNKNOWN') {
        const sampleCoords = getSampleCoordinates(feature.geometry)
        if (sampleCoords) {
          finalFromCRS = detectCoordinateSystem(sampleCoords)
          if (index === 0) {
            console.log(`🔍 從要素檢測座標系統: ${finalFromCRS}，樣本座標: [${sampleCoords[0]}, ${sampleCoords[1]}]`)
          }
        }
      }
      
      if (finalFromCRS && finalFromCRS !== toCRS && finalFromCRS !== 'UNKNOWN') {
        transformedFeature.geometry = {
          ...feature.geometry,
          coordinates: transformCoordinates(
            feature.geometry.coordinates, 
            feature.geometry.type, 
            finalFromCRS, 
            toCRS
          )
        }
        
        // 🔥 新增轉換標記
        if (!transformedFeature.properties) {
          transformedFeature.properties = {}
        }
        transformedFeature.properties._coordinateTransform = {
          from: finalFromCRS,
          to: toCRS,
          timestamp: Date.now()
        }
      }
    }
    
    return transformedFeature
  })

  // 🔥 移除原始 CRS 定義，設定為 WGS84
  if (toCRS === 'WGS84') {
    transformedGeoJSON.crs = {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:EPSG::4326"
      }
    }
  }

  // 🔥 新增轉換紀錄到 GeoJSON 元數據
  transformedGeoJSON._coordinateTransform = {
    from: detectedFromCRS,
    to: toCRS,
    timestamp: Date.now(),
    featureCount: transformedGeoJSON.features.length
  }

  console.log(`✅ GeoJSON座標轉換完成: ${transformedGeoJSON.features.length} 個要素`)
  return transformedGeoJSON
}

/**
 * 🔥 新增：取得幾何體的樣本座標（用於座標系統檢測）
 * @param {Object} geometry - GeoJSON 幾何物件
 * @returns {Array|null} 樣本座標 [x, y]
 */
function getSampleCoordinates(geometry) {
  switch (geometry.type) {
    case 'Point':
      return geometry.coordinates
    
    case 'LineString':
    case 'MultiPoint':
      return geometry.coordinates[0]
    
    case 'Polygon':
    case 'MultiLineString':
      return geometry.coordinates[0][0]
    
    case 'MultiPolygon':
      return geometry.coordinates[0][0][0]
    
    default:
      return null
  }
}

/**
 * 遞迴轉換座標陣列
 * @param {Array} coordinates - 座標陣列
 * @param {string} geometryType - 幾何類型
 * @param {string} fromCRS - 來源座標系統
 * @param {string} toCRS - 目標座標系統
 * @returns {Array} 轉換後的座標陣列
 */
function transformCoordinates(coordinates, geometryType, fromCRS, toCRS) {
  const transformFunction = fromCRS === 'TWD97' && toCRS === 'WGS84' ? 
    transformTWD97ToWGS84 : 
    transformWGS84ToTWD97

  switch (geometryType) {
    case 'Point':
      return transformFunction(coordinates[0], coordinates[1])
    
    case 'LineString':
    case 'MultiPoint':
      return coordinates.map(coord => transformFunction(coord[0], coord[1]))
    
    case 'Polygon':
    case 'MultiLineString':
      return coordinates.map(ring => 
        ring.map(coord => transformFunction(coord[0], coord[1]))
      )
    
    case 'MultiPolygon':
      return coordinates.map(polygon =>
        polygon.map(ring => 
          ring.map(coord => transformFunction(coord[0], coord[1]))
        )
      )
    
    default:
      return coordinates
  }
}

/**
 * 計算K最近鄰
 * @param {Array} points - 點座標陣列 [[lng, lat], ...]
 * @param {number} targetIndex - 目標點索引
 * @param {number} k - K值（最近鄰數量）
 * @returns {Array} K個最近鄰的信息 [{index, distance, point}, ...]
 */
export function calculateKNearestNeighbors(points, targetIndex, k) {
  if (!points || points.length === 0 || targetIndex < 0 || targetIndex >= points.length) {
    return []
  }

  const targetPoint = points[targetIndex]
  const neighbors = []

  // 計算到所有其他點的距離
  points.forEach((point, index) => {
    if (index === targetIndex) return

    const distance = calculateDistance(
      targetPoint[1], targetPoint[0],
      point[1], point[0]
    )

    neighbors.push({
      index,
      distance,
      point: [...point]
    })
  })

  // 按距離排序並取前K個
  neighbors.sort((a, b) => a.distance - b.distance)
  return neighbors.slice(0, k)
}

/**
 * 計算所有點的K最近鄰
 * @param {Array} points - 點座標陣列 [[lng, lat], ...]
 * @param {number} k - K值（最近鄰數量）
 * @returns {Array} 每個點的K最近鄰信息
 */
export function calculateAllKNearestNeighbors(points, k) {
  if (!points || points.length === 0) return []

  return points.map((_, index) => ({
    pointIndex: index,
    point: points[index],
    neighbors: calculateKNearestNeighbors(points, index, k)
  }))
}

/**
 * 計算空間滯後值 (Spatial Lag)
 * @param {Array} points - 點陣列，每個點包含 {lng, lat, value}
 * @param {number} targetIndex - 目標點索引
 * @param {number} k - K值（最近鄰數量）
 * @param {string} weightType - 權重類型 ('distance', 'inverse_distance', 'equal')
 * @returns {number} 空間滯後值
 */
export function calculateSpatialLag(points, targetIndex, k, weightType = 'inverse_distance') {
  if (!points || points.length === 0 || targetIndex < 0 || targetIndex >= points.length) {
    return 0
  }

  // 取得點座標用於計算距離
  const coordPoints = points.map(p => [p.lng, p.lat])
  const neighbors = calculateKNearestNeighbors(coordPoints, targetIndex, k)

  if (neighbors.length === 0) return 0

  let weightedSum = 0
  let totalWeight = 0

  neighbors.forEach(neighbor => {
    const neighborValue = points[neighbor.index].value || 0
    let weight = 1

    switch (weightType) {
      case 'distance':
        weight = neighbor.distance
        break
      case 'inverse_distance':
        weight = neighbor.distance > 0 ? 1 / neighbor.distance : 1
        break
      case 'equal':
      default:
        weight = 1
        break
    }

    weightedSum += weight * neighborValue
    totalWeight += weight
  })

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

/**
 * 計算所有點的空間滯後值
 * @param {Array} points - 點陣列，每個點包含 {lng, lat, value}
 * @param {number} k - K值（最近鄰數量）
 * @param {string} weightType - 權重類型
 * @returns {Array} 包含原始值和空間滯後值的陣列
 */
export function calculateAllSpatialLags(points, k, weightType = 'inverse_distance') {
  if (!points || points.length === 0) return []

  return points.map((point, index) => ({
    ...point,
    spatialLag: calculateSpatialLag(points, index, k, weightType),
    neighbors: calculateKNearestNeighbors(points.map(p => [p.lng, p.lat]), index, k)
  }))
}

/**
 * 計算空間自相關係數 (Local Moran's I)
 * @param {Array} points - 點陣列，每個點包含 {lng, lat, value}
 * @param {number} k - K值（最近鄰數量）
 * @returns {Array} 每個點的局部Moran's I值
 */
export function calculateLocalMoransI(points, k) {
  if (!points || points.length === 0) return []

  // 計算全域平均值
  const mean = points.reduce((sum, p) => sum + (p.value || 0), 0) / points.length
  
  // 計算變異數
  const variance = points.reduce((sum, p) => sum + Math.pow((p.value || 0) - mean, 2), 0) / points.length

  return points.map((point, index) => {
    const coordPoints = points.map(p => [p.lng, p.lat])
    const neighbors = calculateKNearestNeighbors(coordPoints, index, k)
    
    if (neighbors.length === 0) return { ...point, localMoransI: 0 }

    // 計算局部Moran's I
    const zi = (point.value || 0) - mean
    let spatialLag = 0

    neighbors.forEach(neighbor => {
      const weight = 1 / (neighbor.distance + 1) // 避免除以零
      const zj = (points[neighbor.index].value || 0) - mean
      spatialLag += weight * zj
    })

    spatialLag = spatialLag / neighbors.length
    const localMoransI = variance > 0 ? (zi * spatialLag) / variance : 0

    return {
      ...point,
      localMoransI,
      spatialLag,
      standardizedValue: zi
    }
  })
}

/**
 * 空間聚集檢測
 * @param {Array} points - 點陣列，每個點包含 {lng, lat, value}
 * @param {number} k - K值（最近鄰數量）
 * @param {number} threshold - 聚集閾值
 * @returns {Object} 聚集分析結果
 */
export function detectSpatialClusters(points, k, threshold = 0.5) {
  const localMoransResults = calculateLocalMoransI(points, k)
  
  const clusters = {
    highHigh: [], // 高值被高值圍繞
    lowLow: [],   // 低值被低值圍繞
    highLow: [],  // 高值被低值圍繞
    lowHigh: [],  // 低值被高值圍繞
    noSignificant: [] // 無顯著空間相關
  }

  const mean = points.reduce((sum, p) => sum + (p.value || 0), 0) / points.length

  localMoransResults.forEach((result, index) => {
    const isHighValue = result.value > mean
    const isHighSpatialLag = result.spatialLag > 0
    const isSignificant = Math.abs(result.localMoransI) > threshold

    if (!isSignificant) {
      clusters.noSignificant.push({ ...result, index })
    } else if (isHighValue && isHighSpatialLag) {
      clusters.highHigh.push({ ...result, index })
    } else if (!isHighValue && !isHighSpatialLag) {
      clusters.lowLow.push({ ...result, index })
    } else if (isHighValue && !isHighSpatialLag) {
      clusters.highLow.push({ ...result, index })
    } else {
      clusters.lowHigh.push({ ...result, index })
    }
  })

  return {
    clusters,
    summary: {
      totalPoints: points.length,
      significantClusters: clusters.highHigh.length + clusters.lowLow.length,
      outliers: clusters.highLow.length + clusters.lowHigh.length,
      noSignificant: clusters.noSignificant.length
    }
  }
}

/**
 * 建立空間權重矩陣
 * @param {Array} points - 點座標陣列 [[lng, lat], ...]
 * @param {number} k - K值（最近鄰數量）
 * @param {string} weightType - 權重類型
 * @returns {Array} 空間權重矩陣（二維陣列）
 */
export function createSpatialWeightMatrix(points, k, weightType = 'inverse_distance') {
  const n = points.length
  const weightMatrix = Array(n).fill().map(() => Array(n).fill(0))

  points.forEach((_, i) => {
    const neighbors = calculateKNearestNeighbors(points, i, k)
    
    neighbors.forEach(neighbor => {
      let weight = 1

      switch (weightType) {
        case 'distance':
          weight = neighbor.distance
          break
        case 'inverse_distance':
          weight = neighbor.distance > 0 ? 1 / neighbor.distance : 1
          break
        case 'equal':
        default:
          weight = 1
          break
      }

      weightMatrix[i][neighbor.index] = weight
    })
  })

  return weightMatrix
}

/**
 * 🔥 測試函數：驗證座標轉換是否正確
 * 使用台南市實際座標進行測試
 */
export function testCoordinateTransformation() {
  console.log('🧪 開始座標轉換測試...')
  
  // 台南市實際 TWD97 座標（從 GeoJSON 取得）
  const testPoints = [
    {
      name: '台南市南區',
      twd97: [165295.003478, 2540755.067444],
      expectedWgs84: [120.202, 22.998] // 預期的 WGS84 座標
    },
    {
      name: '台南市安南區', 
      twd97: [165091.617678, 2551702.102044],
      expectedWgs84: [120.187, 23.084] // 預期的 WGS84 座標
    }
  ]
  
  testPoints.forEach((point, index) => {
    console.log(`\n🔍 測試點 ${index + 1}: ${point.name}`)
    console.log(`原始 TWD97: [${point.twd97[0]}, ${point.twd97[1]}]`)
    
    // 檢測座標系統
    const detected = detectCoordinateSystem(point.twd97)
    console.log(`座標系統檢測: ${detected}`)
    
    // 轉換座標
    const converted = transformTWD97ToWGS84(point.twd97[0], point.twd97[1])
    console.log(`轉換後 WGS84: [${converted[0].toFixed(6)}, ${converted[1].toFixed(6)}]`)
    console.log(`預期 WGS84: [${point.expectedWgs84[0]}, ${point.expectedWgs84[1]}]`)
    
    // 計算誤差
    const errorLng = Math.abs(converted[0] - point.expectedWgs84[0])
    const errorLat = Math.abs(converted[1] - point.expectedWgs84[1]) 
    console.log(`經度誤差: ${errorLng.toFixed(6)}°`)
    console.log(`緯度誤差: ${errorLat.toFixed(6)}°`)
    
    // 誤差小於 0.01 度（約 1 公里）算正確
    const isAccurate = errorLng < 0.01 && errorLat < 0.01
    console.log(`轉換結果: ${isAccurate ? '✅ 正確' : '❌ 誤差過大'}`)
  })
  
  console.log('\n🔥 測試完成！如果看到 ✅ 正確，表示座標轉換功能正常運作。')
}

// 🔥 自動執行測試（可以在瀏覽器控制台看到結果）
if (typeof window !== 'undefined') {
  console.log('🌐 座標轉換模組已載入，執行測試...')
  setTimeout(testCoordinateTransformation, 1000)
} 
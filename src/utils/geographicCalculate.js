/**
 * 🌐 地理計算工具庫
 *
 * 長照空間分析系統的核心地理計算模組
 * 提供專業級 GIS 地理計算功能，支援複雜的空間分析需求
 *
 * 主要功能：
 * - 📏 距離與面積計算 (Haversine 公式)
 * - 🔍 空間幾何分析 (點線面關係)
 * - 📊 空間統計分析 (聚類、插值)
 * - 🗺️ 緩衝區分析與邊界計算
 * - 🎯 熱力圖生成與密度分析
 * - 📈 空間自相關分析 (Moran's I)
 *
 * 適用場景：
 * - 長照機構服務範圍分析
 * - 人口密度空間分布
 * - 醫療資源可及性評估
 * - 交通便利性分析
 *
 * @author 長照空間分析團隊
 * @version 1.0.0
 * @since 2024
 */

/**
 * 地球半徑（公里）
 */
const EARTH_RADIUS_KM = 6371;

/**
 * 度數轉弧度
 * @param {number} degrees 度數
 * @returns {number} 弧度
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * 弧度轉度數
 * @param {number} radians 弧度
 * @returns {number} 度數
 */
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * 計算兩點間的球面距離（Haversine公式）
 * @param {number} lat1 第一點緯度
 * @param {number} lng1 第一點經度
 * @param {number} lat2 第二點緯度
 * @param {number} lng2 第二點經度
 * @returns {number} 距離（公里）
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * 計算點到線段的最短距離
 * @param {Array} point 點座標 [lng, lat]
 * @param {Array} lineStart 線段起點 [lng, lat]
 * @param {Array} lineEnd 線段終點 [lng, lat]
 * @returns {number} 最短距離（公里）
 */
export function pointToLineDistance(point, lineStart, lineEnd) {
  const [px, py] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  // 計算線段長度平方
  const lengthSquared = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);

  if (lengthSquared === 0) {
    // 線段退化為點
    return calculateDistance(py, px, y1, x1);
  }

  // 計算投影參數
  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSquared)
  );

  // 計算投影點
  const projectionX = x1 + t * (x2 - x1);
  const projectionY = y1 + t * (y2 - y1);

  return calculateDistance(py, px, projectionY, projectionX);
}

/**
 * 判斷點是否在多邊形內（射線法）
 * @param {Array} point 點座標 [lng, lat]
 * @param {Array} polygon 多邊形座標陣列 [[lng, lat], ...]
 * @returns {boolean} 是否在多邊形內
 */
export function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * 計算多邊形的面積（球面面積近似）
 * @param {Array} polygon 多邊形座標陣列 [[lng, lat], ...]
 * @returns {number} 面積（平方公里）
 */
export function calculatePolygonArea(polygon) {
  if (polygon.length < 3) return 0;

  let area = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const [lng1, lat1] = polygon[i];
    const [lng2, lat2] = polygon[j];

    area += toRadians(lng2 - lng1) * (2 + Math.sin(toRadians(lat1)) + Math.sin(toRadians(lat2)));
  }

  area = (Math.abs(area) * EARTH_RADIUS_KM * EARTH_RADIUS_KM) / 2;

  return area;
}

/**
 * 計算多邊形的周長
 * @param {Array} polygon 多邊形座標陣列 [[lng, lat], ...]
 * @returns {number} 周長（公里）
 */
export function calculatePolygonPerimeter(polygon) {
  if (polygon.length < 2) return 0;

  let perimeter = 0;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const [lng1, lat1] = polygon[i];
    const [lng2, lat2] = polygon[j];

    perimeter += calculateDistance(lat1, lng1, lat2, lng2);
  }

  return perimeter;
}

/**
 * 創建點的緩衝區（圓形）
 * @param {Array} center 中心點 [lng, lat]
 * @param {number} radius 半徑（公里）
 * @param {number} segments 圓形分段數，預設32
 * @returns {Array} 緩衝區多邊形座標
 */
export function createPointBuffer(center, radius, segments = 32) {
  const [lng, lat] = center;
  const buffer = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i * 2 * Math.PI) / segments;

    // 計算偏移量
    const deltaLat = (radius / EARTH_RADIUS_KM) * Math.cos(angle);
    const deltaLng = ((radius / EARTH_RADIUS_KM) * Math.sin(angle)) / Math.cos(toRadians(lat));

    buffer.push([lng + toDegrees(deltaLng), lat + toDegrees(deltaLat)]);
  }

  // 閉合多邊形
  if (buffer.length > 0) {
    buffer.push([...buffer[0]]);
  }

  return buffer;
}

/**
 * 計算點集的重心
 * @param {Array} points 點座標陣列 [[lng, lat], ...]
 * @returns {Array} 重心座標 [lng, lat]
 */
export function calculateCentroid(points) {
  if (points.length === 0) return [0, 0];

  let sumLng = 0;
  let sumLat = 0;

  points.forEach(([lng, lat]) => {
    sumLng += lng;
    sumLat += lat;
  });

  return [sumLng / points.length, sumLat / points.length];
}

/**
 * 計算點集的邊界框
 * @param {Array} points 點座標陣列 [[lng, lat], ...]
 * @returns {Object} 邊界框 {minLng, minLat, maxLng, maxLat}
 */
export function calculateBounds(points) {
  if (points.length === 0) return { minLng: 0, minLat: 0, maxLng: 0, maxLat: 0 };

  let minLng = points[0][0];
  let maxLng = points[0][0];
  let minLat = points[0][1];
  let maxLat = points[0][1];

  points.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  return { minLng, minLat, maxLng, maxLat };
}

/**
 * K-means聚類分析
 * @param {Array} points 點座標陣列 [[lng, lat], ...]
 * @param {number} k 聚類數量
 * @param {number} maxIterations 最大迭代次數
 * @returns {Object} 聚類結果 {clusters, centroids}
 */
export function kMeansClustering(points, k, maxIterations = 100) {
  if (points.length === 0 || k <= 0) return { clusters: [], centroids: [] };

  // 初始化聚類中心
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * points.length);
    centroids.push([...points[randomIndex]]);
  }

  let clusters = [];

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // 初始化聚類
    clusters = Array.from({ length: k }, () => []);

    // 分配每個點到最近的聚類中心
    points.forEach((point, index) => {
      let minDistance = Infinity;
      let closestCluster = 0;

      centroids.forEach((centroid, clusterIndex) => {
        const distance = calculateDistance(point[1], point[0], centroid[1], centroid[0]);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = clusterIndex;
        }
      });

      clusters[closestCluster].push({ point, index });
    });

    // 更新聚類中心
    const newCentroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[clusters.indexOf(cluster)];

      const clusterPoints = cluster.map((item) => item.point);
      return calculateCentroid(clusterPoints);
    });

    // 檢查收斂性
    let converged = true;
    for (let i = 0; i < k; i++) {
      const distance = calculateDistance(
        centroids[i][1],
        centroids[i][0],
        newCentroids[i][1],
        newCentroids[i][0]
      );
      if (distance > 0.001) {
        // 收斂閾值 1 米
        converged = false;
        break;
      }
    }

    centroids = newCentroids;

    if (converged) break;
  }

  return { clusters, centroids };
}

/**
 * 密度聚類分析（DBSCAN簡化版）
 * @param {Array} points 點座標陣列 [[lng, lat], ...]
 * @param {number} eps 鄰域半徑（公里）
 * @param {number} minPts 最小點數
 * @returns {Array} 聚類結果，-1表示噪聲點
 */
export function dbscanClustering(points, eps, minPts) {
  const labels = new Array(points.length).fill(-1); // -1表示未處理
  let clusterId = 0;

  for (let i = 0; i < points.length; i++) {
    if (labels[i] !== -1) continue; // 已處理

    const neighbors = getNeighbors(points, i, eps);

    if (neighbors.length < minPts) {
      labels[i] = -1; // 標記為噪聲
      continue;
    }

    // 開始新聚類
    labels[i] = clusterId;
    const seedSet = [...neighbors];

    for (let j = 0; j < seedSet.length; j++) {
      const neighborIndex = seedSet[j];

      if (labels[neighborIndex] === -1) {
        labels[neighborIndex] = clusterId;
      }

      if (labels[neighborIndex] !== -1) continue;

      labels[neighborIndex] = clusterId;
      const neighborNeighbors = getNeighbors(points, neighborIndex, eps);

      if (neighborNeighbors.length >= minPts) {
        seedSet.push(...neighborNeighbors);
      }
    }

    clusterId++;
  }

  return labels;
}

/**
 * 獲取點的鄰居
 * @param {Array} points 所有點
 * @param {number} pointIndex 目標點索引
 * @param {number} eps 半徑
 * @returns {Array} 鄰居點索引陣列
 */
function getNeighbors(points, pointIndex, eps) {
  const neighbors = [];
  const [lng, lat] = points[pointIndex];

  for (let i = 0; i < points.length; i++) {
    if (i === pointIndex) continue;

    const [otherLng, otherLat] = points[i];
    const distance = calculateDistance(lat, lng, otherLat, otherLng);

    if (distance <= eps) {
      neighbors.push(i);
    }
  }

  return neighbors;
}

/**
 * 計算熱力圖權重
 * @param {Array} points 點陣列，每個點包含 {lng, lat, weight}
 * @param {Array} gridBounds 網格邊界 {minLng, minLat, maxLng, maxLat}
 * @param {number} gridSize 網格大小
 * @param {number} radius 影響半徑（公里）
 * @returns {Array} 熱力圖網格數據
 */
export function calculateHeatMap(points, gridBounds, gridSize, radius) {
  const { minLng, minLat, maxLng, maxLat } = gridBounds;
  const lngStep = (maxLng - minLng) / gridSize;
  const latStep = (maxLat - minLat) / gridSize;

  const heatMap = [];

  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      const gridLng = minLng + (j + 0.5) * lngStep;
      const gridLat = minLat + (i + 0.5) * latStep;

      let totalWeight = 0;

      points.forEach((point) => {
        const distance = calculateDistance(gridLat, gridLng, point.lat, point.lng);

        if (distance <= radius) {
          // 使用高斯權重函數
          const weight =
            point.weight * Math.exp(-(distance * distance) / (2 * (radius / 3) * (radius / 3)));
          totalWeight += weight;
        }
      });

      row.push({
        lng: gridLng,
        lat: gridLat,
        weight: totalWeight,
      });
    }
    heatMap.push(row);
  }

  return heatMap;
}

/**
 * 空間插值（反距離權重法）
 * @param {Array} knownPoints 已知點陣列 [{lng, lat, value}, ...]
 * @param {Array} targetPoint 目標點 [lng, lat]
 * @param {number} power 權重指數，預設2
 * @returns {number} 插值結果
 */
export function inverseDistanceWeighting(knownPoints, targetPoint, power = 2) {
  const [targetLng, targetLat] = targetPoint;

  let weightedSum = 0;
  let weightSum = 0;

  knownPoints.forEach((point) => {
    const distance = calculateDistance(targetLat, targetLng, point.lat, point.lng);

    if (distance === 0) {
      // 如果目標點與已知點重合，直接返回該點的值
      return point.value;
    }

    const weight = 1 / Math.pow(distance, power);
    weightedSum += weight * point.value;
    weightSum += weight;
  });

  return weightSum > 0 ? weightedSum / weightSum : 0;
}

/**
 * 計算空間自相關性（Moran's I）
 * @param {Array} features 地理要素陣列，每個要素包含 {geometry, properties: {value}}
 * @param {Function} weightFunction 權重函數，預設使用距離倒數
 * @returns {number} Moran's I 值
 */
export function calculateMoransI(features, weightFunction = null) {
  const n = features.length;
  if (n < 2) return 0;

  // 計算均值
  const mean = features.reduce((sum, feature) => sum + feature.properties.value, 0) / n;

  // 計算權重矩陣和統計量
  let numerator = 0;
  let denominator = 0;
  let weightSum = 0;

  for (let i = 0; i < n; i++) {
    const fi = features[i];
    const vi = fi.properties.value;
    denominator += Math.pow(vi - mean, 2);

    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      const fj = features[j];
      const vj = fj.properties.value;

      // 計算權重（這裡簡化為距離倒數）
      const weight = weightFunction
        ? weightFunction(fi, fj)
        : 1 /
          calculateDistance(
            fi.geometry.coordinates[1],
            fi.geometry.coordinates[0],
            fj.geometry.coordinates[1],
            fj.geometry.coordinates[0]
          );

      numerator += weight * (vi - mean) * (vj - mean);
      weightSum += weight;
    }
  }

  if (denominator === 0 || weightSum === 0) return 0;

  return (n / weightSum) * (numerator / denominator);
}

/**
 * 最近鄰分析
 * @param {Array} points 點座標陣列 [[lng, lat], ...]
 * @returns {Object} 分析結果 {averageDistance, nearestNeighborIndex, randomExpectation, zScore}
 */
export function nearestNeighborAnalysis(points) {
  if (points.length < 2) return null;

  let totalDistance = 0;
  const nearestDistances = [];

  points.forEach((point, i) => {
    let minDistance = Infinity;
    let nearestIndex = -1;

    points.forEach((otherPoint, j) => {
      if (i === j) return;

      const distance = calculateDistance(point[1], point[0], otherPoint[1], otherPoint[0]);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = j;
      }
    });

    nearestDistances.push({ distance: minDistance, index: nearestIndex });
    totalDistance += minDistance;
  });

  const averageDistance = totalDistance / points.length;

  // 計算研究區域面積（使用邊界框近似）
  const bounds = calculateBounds(points);
  const area =
    (bounds.maxLng - bounds.minLng) *
    (bounds.maxLat - bounds.minLat) *
    Math.pow((EARTH_RADIUS_KM * Math.PI) / 180, 2);

  // 隨機分佈的期望最近鄰距離
  const density = points.length / area;
  const randomExpectation = 0.5 * Math.sqrt(1 / density);

  // 計算 Z 分數
  const standardError = 0.26136 * Math.sqrt(1 / (points.length * density));
  const zScore = (averageDistance - randomExpectation) / standardError;

  return {
    averageDistance,
    nearestDistances,
    randomExpectation,
    zScore,
    interpretation: zScore < -1.96 ? 'clustered' : zScore > 1.96 ? 'dispersed' : 'random',
  };
}

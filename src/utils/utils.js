// 工具函數集合
// 用於存放常用的計算和輔助函數

/**
 * 計算兩個地理座標之間的距離（公里）
 * @param {number} lat1 - 第一個點的緯度
 * @param {number} lon1 - 第一個點的經度
 * @param {number} lat2 - 第二個點的緯度
 * @param {number} lon2 - 第二個點的經度
 * @returns {number} 距離（公里）
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // 地球半徑（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const d = R * c
  return d
}

/**
 * 格式化數字（加入千分位逗號）
 * @param {number} num - 要格式化的數字
 * @returns {string} 格式化後的字串
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * 計算陣列的平均值
 * @param {number[]} array - 數字陣列
 * @returns {number} 平均值
 */
export function calculateAverage(array) {
  if (!array || array.length === 0) return 0
  const sum = array.reduce((a, b) => a + b, 0)
  return sum / array.length
}

/**
 * 計算陣列的標準差
 * @param {number[]} array - 數字陣列
 * @returns {number} 標準差
 */
export function calculateStandardDeviation(array) {
  if (!array || array.length === 0) return 0
  const avg = calculateAverage(array)
  const squareDiffs = array.map(value => Math.pow(value - avg, 2))
  const avgSquareDiff = calculateAverage(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

/**
 * 深度複製對象
 * @param {object} obj - 要複製的對象
 * @returns {object} 複製後的對象
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 防抖函數
 * @param {function} func - 要執行的函數
 * @param {number} wait - 延遲時間（毫秒）
 * @returns {function} 防抖後的函數
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 節流函數
 * @param {function} func - 要執行的函數
 * @param {number} limit - 時間間隔（毫秒）
 * @returns {function} 節流後的函數
 */
export function throttle(func, limit) {
  let lastFunc
  let lastRan
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

/**
 * 生成隨機顏色
 * @returns {string} HEX顏色碼
 */
export function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16)
}

/**
 * 將日期轉換為指定格式的字串
 * @param {Date} date - 日期對象
 * @param {string} format - 格式（例如：'YYYY-MM-DD'）
 * @returns {string} 格式化後的日期字串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
} 
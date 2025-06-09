/**
 * 🐍 Python 風格色票系統
 * 
 * 長照空間分析系統的色彩視覺化模組
 * 完整移植 Python 科學計算生態系統的色票配置
 * 確保與主流資料科學工具的視覺化一致性
 * 
 * 支援色票庫：
 * - 🔥 Matplotlib (viridis, plasma, inferno, magma, cividis)
 * - 📊 Seaborn (deep, muted, bright, pastel, dark, colorblind)
 * - 📈 Plotly (plotly, hot, earth)
 * - 🔬 Scientific (temperature, elevation, density)
 * 
 * 色票分類：
 * - 📈 順序色票 (Sequential): 適合連續數值資料
 * - 🔀 發散色票 (Diverging): 適合正負值或對比資料
 * - 🎨 類別色票 (Qualitative): 適合分類資料
 * 
 * 特色功能：
 * - 🎯 色盲友善設計
 * - 🔧 動態色彩插值
 * - 📊 資料類型自動推薦
 * - 🌈 四層級色彩生成
 * 
 * 科學應用：
 * - 人口密度熱力圖
 * - 醫療資源分布圖
 * - 長照需求強度視覺化
 * - 地理統計分析圖表
 * 
 * @author 長照空間分析團隊
 * @version 1.0.0
 * @since 2024
 * @reference https://matplotlib.org/stable/tutorials/colors/colormaps.html
 * @reference https://seaborn.pydata.org/tutorial/color_palettes.html
 */

/**
 * Matplotlib 基本色票
 * 參考: https://matplotlib.org/stable/tutorials/colors/colormaps.html
 */
export const matplotlibColorMaps = {
  // ==================== 順序色票 (Sequential) ====================
  
  // Viridis 系列（推薦用於科學視覺化）
  viridis: [
    '#440154', '#482777', '#3f4a8a', '#31678e', '#26838f',
    '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'
  ],
  
  plasma: [
    '#0c0786', '#40039a', '#6a00a7', '#8f0da4', '#b02a8f',
    '#cc4677', '#de6757', '#f0892d', '#fac127', '#f9fb0e'
  ],
  
  inferno: [
    '#000003', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60',
    '#cf4446', '#ed6925', '#f98e09', '#fbb61a', '#fcffa4'
  ],
  
  magma: [
    '#000003', '#0b0724', '#231151', '#410f75', '#5d1a86',
    '#7a2182', '#952c80', '#af3f7c', '#c85b7c', '#de7a79',
    '#f19c73', '#fdc468', '#fcfdbf'
  ],
  
  // Blues 系列
  blues: [
    '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6',
    '#4292c6', '#2171b5', '#08519c', '#08306b'
  ],
  
  // Reds 系列
  reds: [
    '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a',
    '#ef3b2c', '#cb181d', '#a50f15', '#67000d'
  ],
  
  // Greens 系列
  greens: [
    '#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476',
    '#41ab5d', '#238b45', '#006d2c', '#00441b'
  ],
  
  // ==================== 發散色票 (Diverging) ====================
  
  // RdYlBu (Red-Yellow-Blue)
  rdylbu: [
    '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090',
    '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'
  ],
  
  // RdBu (Red-Blue)
  rdbu: [
    '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7',
    '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'
  ],
  
  // Spectral
  spectral: [
    '#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b',
    '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'
  ],
  
  // ==================== 類別色票 (Qualitative) ====================
  
  // Set1 (最多9種類別)
  set1: [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00',
    '#ffff33', '#a65628', '#f781bf', '#999999'
  ],
  
  // Set2 (最多8種類別)
  set2: [
    '#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854',
    '#ffd92f', '#e5c494', '#b3b3b3'
  ],
  
  // Set3 (最多12種類別)
  set3: [
    '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3',
    '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd',
    '#ccebc5', '#ffed6f'
  ],
  
  // Tab10 (現代類別色票)
  tab10: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ]
}

/**
 * Seaborn 色票系統
 * 參考: https://seaborn.pydata.org/tutorial/color_palettes.html
 */
export const seabornColorPalettes = {
  // 深色調色板
  deep: [
    '#4C72B0', '#DD8452', '#55A868', '#C44E52', '#8172B3',
    '#937860', '#DA8BC3', '#8C8C8C', '#CCB974', '#64B5CD'
  ],
  
  // 柔和色調
  muted: [
    '#4878D0', '#EE854A', '#6ACC64', '#D65F5F', '#956CB4',
    '#8C613C', '#DC7EC0', '#797979', '#D5BB67', '#82C6E2'
  ],
  
  // 明亮色調
  bright: [
    '#023EFF', '#FF7C00', '#1AC938', '#E8000B', '#8B2BE2',
    '#9F4800', '#F14CC1', '#A3A3A3', '#FFC400', '#00D7FF'
  ],
  
  // 柔和色調
  pastel: [
    '#A1C9F4', '#FFB482', '#8DE5A1', '#FF9F9B', '#D0BBFF',
    '#DEBB9B', '#FAB0E4', '#CFCFCF', '#FFFEA3', '#B9F2F0'
  ],
  
  // 暗色調
  dark: [
    '#001C7F', '#B1400D', '#12711C', '#8C0800', '#591E71',
    '#592F0D', '#A23582', '#3C3C3C', '#B8850A', '#006374'
  ],
  
  // 色盲友好色票
  colorblind: [
    '#0173B2', '#DE8F05', '#029E73', '#CC78BC', '#CA9161',
    '#FBAFE4', '#949494', '#ECE133', '#56B4E9'
  ]
}

/**
 * Plotly 色票系統
 * 參考: https://plotly.com/python/builtin-colorscales/
 */
export const plotlyColorScales = {
  // 連續色票
  plotly: [
    '#0508b8', '#1910d8', '#3c19f0', '#6b1cfb', '#9c1aff',
    '#ca0df8', '#e312d3', '#f61cc7', '#ff50ac', '#ff8690',
    '#ffb46e', '#ffd94e', '#fff000'
  ],
  
  // 熱力圖
  hot: [
    '#000000', '#230000', '#460000', '#690000', '#8b0000',
    '#b40000', '#dc0000', '#ff0000', '#ff2300', '#ff4600',
    '#ff6900', '#ff8c00', '#ffaf00', '#ffd200', '#fff500',
    '#ffff19', '#ffff58', '#ffff96', '#ffffd4', '#ffffff'
  ],
  
  // 地形圖
  earth: [
    '#000082', '#00267e', '#004c7a', '#007276', '#009872',
    '#00be6e', '#3ce466', '#7cff5e', '#bfff56', '#fff84e',
    '#ffb846', '#ff783e', '#ff3836', '#cd2e2e', '#9b2426'
  ]
}

/**
 * 科學計算專用色票
 * 參考各種科學期刊和專業軟體
 */
export const scientificColorMaps = {
  // 溫度映射
  temperature: [
    '#000080', '#0040ff', '#0080ff', '#00c0ff', '#40e0ff',
    '#80ffff', '#c0ff80', '#ffff00', '#ffc000', '#ff8000',
    '#ff4000', '#ff0000', '#c00000', '#800000'
  ],
  
  // 高度映射
  elevation: [
    '#0d47a1', '#1976d2', '#42a5f5', '#81c784', '#aed581',
    '#dce775', '#fff176', '#ffb74d', '#ff8a65', '#a1887f',
    '#8d6e63', '#795548', '#6d4c41', '#5d4037'
  ],
  
  // 密度映射
  density: [
    '#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696',
    '#737373', '#525252', '#252525', '#000000'
  ]
}

/**
 * 色票實用工具函數
 */
export class ColorSchemeUtils {
  /**
   * 取得指定色票
   * @param {string} scheme - 色票名稱
   * @param {string} library - 色票庫 ('matplotlib', 'seaborn', 'plotly', 'scientific')
   * @returns {Array} 色彩陣列
   */
  static getColorScheme(scheme, library = 'matplotlib') {
    const libraries = {
      matplotlib: matplotlibColorMaps,
      seaborn: seabornColorPalettes,
      plotly: plotlyColorScales,
      scientific: scientificColorMaps
    }
    
    const colorLib = libraries[library]
    if (!colorLib || !colorLib[scheme]) {
      console.warn(`色票 ${scheme} 在 ${library} 中不存在，使用預設色票`)
      return matplotlibColorMaps.viridis
    }
    
    return colorLib[scheme]
  }
  
  /**
   * 插值色票到指定數量
   * @param {Array} colors - 原始色彩陣列
   * @param {number} count - 目標色彩數量
   * @returns {Array} 插值後的色彩陣列
   */
  static interpolateColors(colors, count) {
    if (count <= colors.length) {
      return colors.slice(0, count)
    }
    
    const result = []
    const step = (colors.length - 1) / (count - 1)
    
    for (let i = 0; i < count; i++) {
      const index = i * step
      const lower = Math.floor(index)
      const upper = Math.ceil(index)
      const ratio = index - lower
      
      if (lower === upper) {
        result.push(colors[lower])
      } else {
        const color1 = this.hexToRgb(colors[lower])
        const color2 = this.hexToRgb(colors[upper])
        const interpolated = {
          r: Math.round(color1.r + (color2.r - color1.r) * ratio),
          g: Math.round(color1.g + (color2.g - color1.g) * ratio),
          b: Math.round(color1.b + (color2.b - color1.b) * ratio)
        }
        result.push(this.rgbToHex(interpolated.r, interpolated.g, interpolated.b))
      }
    }
    
    return result
  }
  
  /**
   * 根據數值映射色彩
   * @param {number} value - 數值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {Array} colors - 色彩陣列
   * @returns {string} 映射的色彩
   */
  static mapValueToColor(value, min, max, colors) {
    if (value <= min) return colors[0]
    if (value >= max) return colors[colors.length - 1]
    
    const normalizedValue = (value - min) / (max - min)
    const index = normalizedValue * (colors.length - 1)
    
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const ratio = index - lower
    
    if (lower === upper) {
      return colors[lower]
    }
    
    const color1 = this.hexToRgb(colors[lower])
    const color2 = this.hexToRgb(colors[upper])
    const interpolated = {
      r: Math.round(color1.r + (color2.r - color1.r) * ratio),
      g: Math.round(color1.g + (color2.g - color1.g) * ratio),
      b: Math.round(color1.b + (color2.b - color1.b) * ratio)
    }
    
    return this.rgbToHex(interpolated.r, interpolated.g, interpolated.b)
  }
  
  /**
   * 生成四級色彩系統（100, 200, 400, 800）
   * @param {Array} baseColors - 基礎色彩陣列
   * @returns {Object} 四級色彩對應
   */
  static generateFourLevelColors(baseColors) {
    if (baseColors.length < 4) {
      // 如果色彩不足，進行插值
      baseColors = this.interpolateColors(baseColors, 4)
    }
    
    return {
      100: baseColors[0],      // 最淺色
      200: baseColors[1],      // 淺色
      400: baseColors[2],      // 中等色
      800: baseColors[3]       // 深色
    }
  }
  
  /**
   * Hex 轉 RGB
   * @param {string} hex - Hex 色彩值
   * @returns {Object} RGB 色彩值
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  /**
   * RGB 轉 Hex
   * @param {number} r - 紅色值 (0-255)
   * @param {number} g - 綠色值 (0-255)
   * @param {number} b - 藍色值 (0-255)
   * @returns {string} Hex 色彩值
   */
  static rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }
  
  /**
   * 取得所有可用的色票列表
   * @returns {Object} 所有色票的分類列表
   */
  static getAllColorSchemes() {
    return {
      matplotlib: Object.keys(matplotlibColorMaps),
      seaborn: Object.keys(seabornColorPalettes),
      plotly: Object.keys(plotlyColorScales),
      scientific: Object.keys(scientificColorMaps)
    }
  }
  
  /**
   * 取得推薦的色票組合（依據資料類型）
   * @param {string} dataType - 資料類型 ('sequential', 'diverging', 'categorical', 'binary')
   * @returns {Array} 推薦的色票列表
   */
  static getRecommendedSchemes(dataType) {
    const recommendations = {
      sequential: [
        { name: 'viridis', library: 'matplotlib', description: '科學視覺化推薦' },
        { name: 'plasma', library: 'matplotlib', description: '高對比度' },
        { name: 'blues', library: 'matplotlib', description: '藍色漸層' }
      ],
      diverging: [
        { name: 'rdbu', library: 'matplotlib', description: '紅藍對比' },
        { name: 'rdylbu', library: 'matplotlib', description: '紅黃藍' },
        { name: 'spectral', library: 'matplotlib', description: '光譜色彩' }
      ],
      categorical: [
        { name: 'tab10', library: 'matplotlib', description: '現代類別色票' },
        { name: 'set2', library: 'matplotlib', description: '柔和類別色票' },
        { name: 'deep', library: 'seaborn', description: 'Seaborn 深色調' }
      ],
      binary: [
        { name: 'density', library: 'scientific', description: '二元密度映射' },
        { name: 'rdbu', library: 'matplotlib', description: '紅藍二分' }
      ]
    }
    
    return recommendations[dataType] || recommendations.sequential
  }
}

/**
 * 預設色票配置（與現有系統兼容）
 */
export const defaultColorConfig = {
  // 四級色彩系統（與全域 CSS 變數對應）
  levels: {
    100: '#dbeafe', // 最淺藍色
    200: '#93c5fd', // 淺藍色
    400: '#3b82f6', // 藍色
    800: '#1e40af'  // 深藍色
  },
  
  // Python 風格的預設色票
  default: ColorSchemeUtils.getColorScheme('viridis', 'matplotlib'),
  
  // 空間分析專用色票
  spatial: ColorSchemeUtils.getColorScheme('spectral', 'matplotlib'),
  
  // 熱力圖色票
  heatmap: ColorSchemeUtils.getColorScheme('hot', 'plotly'),
  
  // 類別分析色票
  categorical: ColorSchemeUtils.getColorScheme('tab10', 'matplotlib')
}

console.log('🎨 Python 色票系統已載入')
console.log('🎨 可用色票庫:', Object.keys({
  matplotlib: matplotlibColorMaps,
  seaborn: seabornColorPalettes,
  plotly: plotlyColorScales,
  scientific: scientificColorMaps
})) 
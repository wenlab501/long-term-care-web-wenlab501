import * as XLSX from 'xlsx'

/**
 * 加載並解析 CSV 文件
 * @param {string} filePath - CSV 文件的路徑
 * @returns {Promise<Array>} - 解析後的數據數組
 */
export const loadCSVData = async (filePath) => {
  try {
    console.log('開始加載 CSV 文件:', filePath)
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    console.log('CSV 文件加載成功，開始解析...')
    const csvText = await response.text()
    console.log('CSV 文本內容:', csvText.substring(0, 200) + '...') // 只顯示前200個字符
    
    // 使用 XLSX 解析 CSV
    const workbook = XLSX.read(csvText, { type: 'string' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    
    // 將工作表轉換為 JSON 數組
    const data = XLSX.utils.sheet_to_json(worksheet)
    
    console.log('CSV 解析完成:', {
      rows: data.length,
      fields: Object.keys(data[0] || {}),
      firstRow: data[0]
    })
    
    return data
  } catch (error) {
    console.error('加載 CSV 文件失敗:', error)
    throw error
  }
} 
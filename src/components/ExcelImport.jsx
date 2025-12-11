import { useState } from 'react'
import * as XLSX from 'xlsx'

const ExcelImport = ({ onConfirmImport }) => {
  const [importedData, setImportedData] = useState([])
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle file selection and parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')
    setIsProcessing(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: ''
        })

        if (jsonData.length < 2) {
          setError('Excel file must have at least a header row and one data row.')
          setIsProcessing(false)
          return
        }

        // Parse the data
        const parsedData = parseExcelData(jsonData)
        setImportedData(parsedData)
      } catch (err) {
        console.error('Error parsing Excel file:', err)
        setError('Failed to parse Excel file. Please ensure it is a valid Excel file.')
      } finally {
        setIsProcessing(false)
      }
    }

    reader.onerror = () => {
      setError('Failed to read file. Please try again.')
      setIsProcessing(false)
    }

    reader.readAsArrayBuffer(file)
  }

  // Parse Excel data and map to our entry format
  const parseExcelData = (jsonData) => {
    // First row is headers - find column indices
    const headers = jsonData[0].map(h => String(h).toLowerCase().trim())
    
    // Find column indices
    const dateIndex = findColumnIndex(headers, ['date'])
    const mcIndex = findColumnIndex(headers, ['mc'])
    const carrierNameIndex = findColumnIndex(headers, ['carrier name', 'carriername', 'carrier'])
    const amountIndex = findColumnIndex(headers, ['amount'])
    const approvedIndex = findColumnIndex(headers, ['approved', 'approval'])
    const checkedByIndex = findColumnIndex(headers, ['checked by', 'checkedby', 'checker'])
    const noteIndex = findColumnIndex(headers, ['note', 'notes'])

    // Validate required columns - only MC is required
    if (mcIndex === -1) {
      throw new Error('Missing required column: MC')
    }

    // Parse data rows (skip header row)
    const entries = []
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      
      // Skip empty rows
      if (!row || row.every(cell => !cell || String(cell).trim() === '')) {
        continue
      }

      // Extract values - handle null/undefined/empty
      const dateValue = row[dateIndex] ?? ''
      const mcValue = row[mcIndex] ?? ''
      const carrierNameValue = row[carrierNameIndex] ?? ''
      const amountValue = row[amountIndex] ?? ''
      const approvedValue = row[approvedIndex] ?? 'NO'
      const checkedByValue = row[checkedByIndex] ?? ''
      const noteValue = row[noteIndex] ?? ''

      // Format date - use today if empty
      let formattedDate = dateValue ? formatDate(dateValue) : new Date().toISOString().split('T')[0]

      // Format amount - default to 0 if empty
      const amount = amountValue ? parseAmount(amountValue) : 0

      // Format approved (must be YES or NO) - default to NO if empty
      const approved = approvedValue ? formatApproved(approvedValue) : 'NO'

      // Only require MC field - keep row if MC exists
      if (mcValue && String(mcValue).trim()) {
        entries.push({
          id: `import-${i}`,
          date: formattedDate,
          mc: String(mcValue).trim(),
          carrierName: carrierNameValue ? String(carrierNameValue).trim() : '',
          amount: amount.toString(),
          approved: approved,
          checkedBy: checkedByValue ? String(checkedByValue).trim() : '',
          note: noteValue ? String(noteValue).trim() : ''
        })
      }
    }

    return entries
  }

  // Find column index by matching header names
  const findColumnIndex = (headers, possibleNames) => {
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      for (const name of possibleNames) {
        if (header.includes(name) || name.includes(header)) {
          return i
        }
      }
    }
    return -1
  }

  // Format date to YYYY-MM-DD
  const formatDate = (dateValue) => {
    if (!dateValue) {
      // Default to today if no date
      const today = new Date()
      return today.toISOString().split('T')[0]
    }

    // If it's already a date object
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0]
    }

    // If it's a number (Excel date serial number)
    if (typeof dateValue === 'number') {
      const date = XLSX.SSF.parse_date_code(dateValue)
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
    }

    // If it's a string, try to parse it
    const dateStr = String(dateValue).trim()
    if (dateStr.includes('/')) {
      // MM/DD/YYYY or DD/MM/YYYY
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        // Assume MM/DD/YYYY
        const [month, day, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }

    // Try to parse as ISO date
    const parsed = new Date(dateValue)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }

    // Default to today
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Parse amount value
  const parseAmount = (amountValue) => {
    if (!amountValue) return 0
    
    // Remove currency symbols and commas
    const cleaned = String(amountValue).replace(/[$,]/g, '').trim()
    const parsed = parseFloat(cleaned)
    
    return isNaN(parsed) ? 0 : parsed
  }

  // Format approved value
  const formatApproved = (approvedValue) => {
    const value = String(approvedValue).toUpperCase().trim()
    if (value === 'YES' || value === 'Y' || value === 'TRUE' || value === '1') {
      return 'YES'
    }
    return 'NO'
  }

  // Handle editing a row
  const handleEditRow = (index, field, value) => {
    const updated = [...importedData]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    setImportedData(updated)
  }

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    setImportedData(importedData.filter((_, i) => i !== index))
  }

  // Handle confirm import
  const handleConfirm = async () => {
    if (importedData.length === 0) {
      setError('No data to import.')
      return
    }

    // Validate all entries - only MC is required
    const invalidEntries = importedData.filter(
      entry => !entry.mc || !entry.mc.trim()
    )

    if (invalidEntries.length > 0) {
      setError(`Please ensure all entries have an MC value.`)
      return
    }

    setError('')
    await onConfirmImport(importedData)
    setImportedData([])
    // Reset file input
    const fileInput = document.getElementById('excel-file-input')
    if (fileInput) fileInput.value = ''
  }

  // Handle cancel
  const handleCancel = () => {
    setImportedData([])
    setError('')
    const fileInput = document.getElementById('excel-file-input')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <label htmlFor="excel-file-input" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Click to upload Excel file
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Supports .xlsx, .xls files
              </span>
            </div>
          </label>
          <input
            id="excel-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      </div>

      {isProcessing && (
        <div className="text-center py-4 text-gray-600">
          Processing Excel file...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Imported Data Table */}
      {importedData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Review Imported Data ({importedData.length} entries)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                Confirm Import ({importedData.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MC
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Checked By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {importedData.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="date"
                        value={entry.date || ''}
                        onChange={(e) => handleEditRow(index, 'date', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={entry.mc}
                        onChange={(e) => handleEditRow(index, 'mc', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={entry.carrierName}
                        onChange={(e) => handleEditRow(index, 'carrierName', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={entry.amount}
                        onChange={(e) => handleEditRow(index, 'amount', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={entry.approved}
                        onChange={(e) => handleEditRow(index, 'approved', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={entry.checkedBy}
                        onChange={(e) => handleEditRow(index, 'checkedBy', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        value={entry.note}
                        onChange={(e) => handleEditRow(index, 'note', e.target.value)}
                        rows="2"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                        title="Remove row"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExcelImport


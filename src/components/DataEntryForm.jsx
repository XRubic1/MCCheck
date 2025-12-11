import { useState } from 'react'

const DataEntryForm = ({ onAddEntry }) => {
  const [formData, setFormData] = useState({
    mc: '',
    carrierName: '',
    amount: '',
    approved: 'NO',
    checkedBy: '',
    note: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.mc.trim()) {
      newErrors.mc = 'MC is required'
    }
    if (!formData.carrierName.trim()) {
      newErrors.carrierName = 'Carrier Name is required'
    }
    if (!formData.checkedBy.trim()) {
      newErrors.checkedBy = 'Checked By is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Create new entry with current date
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      mc: formData.mc.trim(),
      carrierName: formData.carrierName.trim(),
      amount: formData.amount || '0',
      approved: formData.approved,
      checkedBy: formData.checkedBy.trim(),
      note: formData.note.trim()
    }

    onAddEntry(newEntry)

    // Reset form
    setFormData({
      mc: '',
      carrierName: '',
      amount: '',
      approved: 'NO',
      checkedBy: '',
      note: ''
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MC Field */}
        <div>
          <label htmlFor="mc" className="block text-sm font-medium text-gray-700 mb-1">
            MC <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="mc"
            name="mc"
            value={formData.mc}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
              errors.mc ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter MC number"
          />
          {errors.mc && <p className="mt-1 text-sm text-red-600">{errors.mc}</p>}
        </div>

        {/* Carrier Name Field */}
        <div>
          <label htmlFor="carrierName" className="block text-sm font-medium text-gray-700 mb-1">
            Carrier Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="carrierName"
            name="carrierName"
            value={formData.carrierName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
              errors.carrierName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter carrier name"
          />
          {errors.carrierName && <p className="mt-1 text-sm text-red-600">{errors.carrierName}</p>}
        </div>

        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="0.00"
          />
        </div>

        {/* Approved Field */}
        <div>
          <label htmlFor="approved" className="block text-sm font-medium text-gray-700 mb-1">
            Approved
          </label>
          <select
            id="approved"
            name="approved"
            value={formData.approved}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>

        {/* Checked By Field */}
        <div>
          <label htmlFor="checkedBy" className="block text-sm font-medium text-gray-700 mb-1">
            Checked By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="checkedBy"
            name="checkedBy"
            value={formData.checkedBy}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
              errors.checkedBy ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter checker name"
          />
          {errors.checkedBy && <p className="mt-1 text-sm text-red-600">{errors.checkedBy}</p>}
        </div>
      </div>

      {/* Note Field - Full Width */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Enter any additional notes"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Add Entry
        </button>
      </div>
    </form>
  )
}

export default DataEntryForm


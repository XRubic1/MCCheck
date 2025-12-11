import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DataEntryForm from './DataEntryForm'
import DataTable from './DataTable'
import MCSearch from './MCSearch'
import ExcelImport from './ExcelImport'
import { getEntries, addEntry, deleteEntry } from '../services/entryService'

const Dashboard = () => {
  const { username, logout } = useAuth()
  const [entries, setEntries] = useState([])
  const [activeTab, setActiveTab] = useState('dataEntry')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load entries from Supabase on component mount
  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getEntries()
      // Transform data to match component format
      const transformedEntries = data.map(entry => ({
        id: entry.id,
        date: entry.date,
        mc: entry.mc,
        carrierName: entry.carrier_name,
        amount: entry.amount?.toString() || '0',
        approved: entry.approved,
        checkedBy: entry.checked_by,
        note: entry.note || ''
      }))
      setEntries(transformedEntries)
    } catch (err) {
      console.error('Error loading entries:', err)
      setError('Failed to load entries. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  // Handle new entry submission
  const handleAddEntry = async (newEntry) => {
    try {
      setError('')
      // Add entry to Supabase
      const createdEntry = await addEntry(newEntry)
      
      // Transform to match component format
      const transformedEntry = {
        id: createdEntry.id,
        date: createdEntry.date,
        mc: createdEntry.mc,
        carrierName: createdEntry.carrier_name,
        amount: createdEntry.amount?.toString() || '0',
        approved: createdEntry.approved,
        checkedBy: createdEntry.checked_by,
        note: createdEntry.note || ''
      }
      
      setEntries([transformedEntry, ...entries])
    } catch (err) {
      console.error('Error adding entry:', err)
      // Show more detailed error message
      const errorMessage = err.message || 'Failed to add entry. Please try again.'
      setError(`Failed to add entry: ${errorMessage}. Check browser console for details.`)
    }
  }

  // Handle entry deletion
  const handleDeleteEntry = async (index) => {
    const entryToDelete = entries[index]
    if (!entryToDelete?.id) {
      // Fallback for entries without ID (shouldn't happen with Supabase)
      setEntries(entries.filter((_, i) => i !== index))
      return
    }

    try {
      setError('')
      await deleteEntry(entryToDelete.id)
      setEntries(entries.filter((_, i) => i !== index))
    } catch (err) {
      console.error('Error deleting entry:', err)
      setError('Failed to delete entry. Please try again.')
    }
  }

  // Handle bulk import from Excel
  const handleBulkImport = async (importedEntries) => {
    try {
      setError('')
      setLoading(true)
      
      // Add all entries one by one
      const addedEntries = []
      let successCount = 0
      let failCount = 0

      for (const entry of importedEntries) {
        try {
          const createdEntry = await addEntry(entry)
          
          // Transform to match component format
          const transformedEntry = {
            id: createdEntry.id,
            date: createdEntry.date,
            mc: createdEntry.mc,
            carrierName: createdEntry.carrier_name,
            amount: createdEntry.amount?.toString() || '0',
            approved: createdEntry.approved,
            checkedBy: createdEntry.checked_by,
            note: createdEntry.note || ''
          }
          
          addedEntries.push(transformedEntry)
          successCount++
        } catch (err) {
          console.error('Error adding imported entry:', err)
          failCount++
        }
      }

      // Reload all entries to get the latest data
      await loadEntries()

      // Show success message
      if (successCount > 0) {
        setError('')
        alert(`Successfully imported ${successCount} ${successCount === 1 ? 'entry' : 'entries'}${failCount > 0 ? `. ${failCount} failed.` : '.'}`)
      } else {
        setError(`Failed to import entries. Please check the data and try again.`)
      }
    } catch (err) {
      console.error('Error during bulk import:', err)
      setError('An error occurred during import. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">MC Carrier Management</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, {username}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('dataEntry')}
                className={`${
                  activeTab === 'dataEntry'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Data Entry
              </button>
              <button
                onClick={() => setActiveTab('mcSearch')}
                className={`${
                  activeTab === 'mcSearch'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                MC Search
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'dataEntry' ? (
            <>
              {/* Excel Import */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Import from Excel</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Upload an Excel file (.xlsx or .xls) with columns: Date, MC, Carrier Name, Amount, Approved (YES/NO), Checked By, Note
                </p>
                <ExcelImport onConfirmImport={handleBulkImport} />
              </div>

              {/* Data Entry Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Entry</h2>
                <DataEntryForm onAddEntry={handleAddEntry} />
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Entries</h2>
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>Loading entries...</p>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No entries yet. Add your first entry using the form above or import from Excel.</p>
                  </div>
                ) : (
                  <DataTable entries={entries} onDeleteEntry={handleDeleteEntry} />
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">MC Search</h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Loading MCs...</p>
                </div>
              ) : (
                <MCSearch entries={entries} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard


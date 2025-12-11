import { supabase } from '../lib/supabase'

/**
 * Get all entries from the database
 * @returns {Promise<Array>} Array of entries
 */
export const getEntries = async () => {
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching entries:', error)
    throw error
  }
}

/**
 * Add a new entry to the database
 * @param {Object} entry - Entry object with date, mc, carrier_name, amount, approved, checked_by, note
 * @returns {Promise<Object>} Created entry
 */
export const addEntry = async (entry) => {
  try {
    // Convert date string to proper format (YYYY-MM-DD)
    const dateStr = entry.date
    let formattedDate = dateStr
    
    // Handle different date formats
    if (dateStr.includes('/')) {
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const [month, day, year] = dateStr.split('/')
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    
    // Convert amount to number
    const amountValue = entry.amount ? parseFloat(entry.amount) : 0
    
    const { data, error } = await supabase
      .from('entries')
      .insert([
        {
          date: formattedDate,
          mc: entry.mc,
          carrier_name: entry.carrierName,
          amount: amountValue,
          approved: entry.approved,
          checked_by: entry.checkedBy,
          note: entry.note || null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    return data
  } catch (error) {
    console.error('Error adding entry:', error)
    throw error
  }
}

/**
 * Delete an entry from the database
 * @param {number} id - Entry ID
 * @returns {Promise<void>}
 */
export const deleteEntry = async (id) => {
  try {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting entry:', error)
    throw error
  }
}

/**
 * Update an entry in the database
 * @param {number} id - Entry ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated entry
 */
export const updateEntry = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating entry:', error)
    throw error
  }
}


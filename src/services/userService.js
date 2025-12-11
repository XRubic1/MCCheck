import { supabase } from '../lib/supabase'

/**
 * Check if a username exists in the database
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} True if user exists
 */
export const checkUserExists = async (username) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim())
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected
      throw error
    }

    return !!data
  } catch (error) {
    console.error('Error checking user:', error)
    throw error
  }
}

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.trim())
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data || null
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}


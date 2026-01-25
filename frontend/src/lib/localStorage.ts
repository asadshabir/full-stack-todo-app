/**
 * LocalStorage Utility
 *
 * Type-safe localStorage operations with error handling
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") {
      return false
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    if (typeof window === "undefined") {
      return false
    }

    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    if (typeof window === "undefined") {
      return false
    }

    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },
}

/**
 * Notifications Utility
 *
 * Handles Web Notifications API for todo reminders
 * Features:
 * - Permission request with user-friendly UI
 * - Browser notification display
 * - Graceful fallback for unsupported browsers
 * - SSR-safe implementation
 */

export type NotificationPermission = "granted" | "denied" | "default"

/**
 * Check if the browser supports notifications
 */
export function isNotificationSupported(): boolean {
  if (typeof window === "undefined") return false
  return "Notification" in window
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return "denied"
  return Notification.permission as NotificationPermission
}

/**
 * Request notification permission from the user
 * Returns the permission status after request
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn("Notifications are not supported in this browser")
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  try {
    const permission = await Notification.requestPermission()
    return permission as NotificationPermission
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return "denied"
  }
}

/**
 * Show a notification to the user
 * @param title - Notification title
 * @param options - Notification options
 * @returns Notification instance or null if failed
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn("Notifications are not supported")
    return null
  }

  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted")
    return null
  }

  try {
    const notification = new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      requireInteraction: false,
      ...options,
    })

    return notification
  } catch (error) {
    console.error("Error showing notification:", error)
    return null
  }
}

/**
 * Show a todo reminder notification
 * @param todoTitle - Title of the todo
 * @param todoDescription - Optional description
 */
export function showTodoReminder(
  todoTitle: string,
  todoDescription?: string
): Notification | null {
  return showNotification(`⏰ Reminder: ${todoTitle}`, {
    body: todoDescription || "You have a task due soon!",
    tag: `todo-reminder-${Date.now()}`,
    requireInteraction: true,
  })
}

/**
 * Schedule a notification for a specific time
 * @param reminderTime - ISO string of when to show notification
 * @param todoTitle - Title of the todo
 * @param todoDescription - Optional description
 * @returns timeout ID that can be used to cancel
 */
export function scheduleNotification(
  reminderTime: string,
  todoTitle: string,
  todoDescription?: string
): number | null {
  if (!isNotificationSupported()) return null
  if (Notification.permission !== "granted") return null

  const reminderDate = new Date(reminderTime)
  const now = new Date()
  const timeUntilReminder = reminderDate.getTime() - now.getTime()

  // If the reminder time is in the past, don't schedule
  if (timeUntilReminder <= 0) {
    console.warn("Reminder time is in the past")
    return null
  }

  // Schedule the notification
  const timeoutId = window.setTimeout(() => {
    showTodoReminder(todoTitle, todoDescription)
  }, timeUntilReminder)

  return timeoutId
}

/**
 * Cancel a scheduled notification
 * @param timeoutId - The timeout ID returned from scheduleNotification
 */
export function cancelScheduledNotification(timeoutId: number): void {
  if (typeof window === "undefined") return
  window.clearTimeout(timeoutId)
}

/**
 * Request permission with a user-friendly flow
 * Returns true if permission was granted, false otherwise
 */
export async function requestPermissionWithUI(): Promise<boolean> {
  if (!isNotificationSupported()) {
    alert(
      "⚠️ Notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari."
    )
    return false
  }

  const currentPermission = getNotificationPermission()

  if (currentPermission === "granted") {
    return true
  }

  if (currentPermission === "denied") {
    alert(
      "⚠️ Notification permissions have been denied. Please enable notifications in your browser settings to receive reminders."
    )
    return false
  }

  // Permission is "default", so we can request it
  const permission = await requestNotificationPermission()

  if (permission === "granted") {
    // Show a test notification to confirm it works
    showNotification("🎉 Notifications Enabled!", {
      body: "You'll now receive reminders for your todos.",
      tag: "permission-granted",
    })
    return true
  } else {
    return false
  }
}

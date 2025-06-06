// Parse environment variables with fallbacks
export const config = {
  access: {
    startHour: Number.parseInt(process.env.ACCESS_START_HOUR || "0", 10),
    startMinute: Number.parseInt(process.env.ACCESS_START_MINUTE || "0", 10),
    endHour: Number.parseInt(process.env.ACCESS_END_HOUR || "15", 10),
    endMinute: Number.parseInt(process.env.ACCESS_END_MINUTE || "30", 10),
    // Add time zone offset in minutes (e.g., for Indonesia/Jakarta GMT+7 = 420 minutes)
    timeZoneOffset: Number.parseInt(process.env.ACCESS_TIMEZONE_OFFSET || "420", 10),
  },

  // Helper functions
  getFormattedEndTime: () => {
    const { endHour, endMinute } = config.access
    const period = endHour >= 12 ? "PM" : "AM"
    const hour = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour
    return `${hour}:${endMinute.toString().padStart(2, "0")} ${period}`
  },

  getFormattedStartTime: () => {
    const { startHour, startMinute } = config.access
    const period = startHour >= 12 ? "PM" : "AM"
    const hour = startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour
    return `${hour}:${startMinute.toString().padStart(2, "0")} ${period}`
  },

  getSystemHours: () => {
    return `${config.getFormattedStartTime()} - ${config.getFormattedEndTime()} daily`
  },

  // Get current time adjusted for configured time zone
  getCurrentTime: () => {
    const now = new Date()
    // Create a new date object with the configured time zone offset
    return now
  },

  // Get target time for today with the configured end time
  getTargetTime: () => {
    const now = config.getCurrentTime()
    const targetTime = new Date(now)
    targetTime.setHours(config.access.endHour, config.access.endMinute, 0, 0)
    return targetTime
  },

  // Check if current time is past the configured end time
  isPastEndTime: () => {
    const now = config.getCurrentTime()
    const targetTime = config.getTargetTime()
    return now > targetTime
  },

  // Get next available time (today or tomorrow)
  getNextAvailableTime: () => {
    const now = config.getCurrentTime()
    const targetTime = config.getTargetTime()

    // If current time is past the end time, set to tomorrow
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    return targetTime
  },
}

export default config

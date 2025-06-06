"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { config } from "@/lib/config"

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isPastDeadline, setIsPastDeadline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time
      const now = new Date()

      // Create target time for today with the configured end time
      const targetTime = new Date(now)
      targetTime.setHours(config.access.endHour, config.access.endMinute, 0, 0)

      // Debug information
      console.log("Current time:", now.toLocaleTimeString())
      console.log("Target time:", targetTime.toLocaleTimeString())
      console.log("Time difference (ms):", targetTime.getTime() - now.getTime())

      // If current time is past the end time, set target to end time tomorrow
      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1)
        console.log("Using tomorrow's target:", targetTime.toLocaleTimeString(), targetTime.toLocaleDateString())

        // Check if we need to redirect to error page
        // Only redirect once when we detect we're past the deadline
        if (!isPastDeadline) {
          setIsPastDeadline(true)
          // Use 307 temporary redirect to error page
          router.push("/error?code=307&reason=time")
          return
        }
      } else {
        // We're before the deadline, make sure flag is reset
        setIsPastDeadline(false)
      }

      // Calculate time difference
      const difference = targetTime.getTime() - now.getTime()

      // Calculate hours, minutes, seconds
      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      console.log("Time left:", hours, "hours,", minutes, "minutes,", seconds, "seconds")

      setTimeLeft({ hours, minutes, seconds })
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [isPastDeadline, router])

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0")
  }

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="flex justify-center items-center gap-4">
        <TimeUnit value={formatNumber(timeLeft.hours)} label="HOURS" />
        <div className="text-2xl font-light text-gray-400">:</div>
        <TimeUnit value={formatNumber(timeLeft.minutes)} label="MINUTES" />
        <div className="text-2xl font-light text-gray-400">:</div>
        <TimeUnit value={formatNumber(timeLeft.seconds)} label="SECONDS" />
      </div>
    </div>
  )
}

interface TimeUnitProps {
  value: string
  label: string
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Moon, Sun, Clock, Shield, RefreshCw, Zap, Printer, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// DEVELOPER ONLY - Override report release timing for testing
const OverrideOpen = true // Set to false for production

// Student data from the provided JSON
const studentDatabase = [
  {
    NIS: "TT.8801",
    name: "FAVIAN BHAGASKARA MURTI",
    Class: "8F",
    pin: "123456",
    PresenceRecap: {
      Hadir: 3,
      Sakit: 0,
      Izin: 2,
      Alfa: 0,
      Terlambat: 0,
      Total: 5,
      Percentage: 60,
    },
  },
  {
    NIS: "TT.8802",
    name: "FABIAN AQSO SAPUTRA",
    Class: "8G",
    pin: "654321",
    PresenceRecap: {
      Hadir: 2,
      Sakit: 0,
      Izin: 1,
      Alfa: 0,
      Terlambat: 0,
      Total: 3,
      Percentage: 67,
    },
  },
  {
    NIS: "TT.8803",
    name: "SULTAN ADHI PRABU NATANEGARA",
    Class: "8D",
    pin: "789012",
    PresenceRecap: {
      Hadir: 2,
      Sakit: 2,
      Izin: 0,
      Alfa: 0,
      Terlambat: 0,
      Total: 4,
      Percentage: 50,
    },
  },
  {
    NIS: "TT.8804",
    name: "FARIS AZHAR KURNIAWAN",
    Class: "8F",
    pin: "345678",
    PresenceRecap: {
      Hadir: 2,
      Sakit: 1,
      Izin: 1,
      Alfa: 1,
      Terlambat: 0,
      Total: 5,
      Percentage: 40,
    },
  },
  {
    NIS: "TT.8805",
    name: "NAZLY AQILLA NABIL",
    Class: "8F",
    pin: "901234",
    PresenceRecap: {
      Hadir: 2,
      Sakit: 0,
      Izin: 1,
      Alfa: 2,
      Terlambat: 0,
      Total: 5,
      Percentage: 40,
    },
  },
]

// Report release dates
const reportDates = [new Date("2024-06-27"), new Date("2024-12-25")]

export default function ParentPortal() {
  const [darkMode, setDarkMode] = useState(true)
  const [nis, setNis] = useState("")
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeUntilNextReport, setTimeUntilNextReport] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [canViewReports, setCanViewReports] = useState(true)

  // Format NIS input
  const formatNIS = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
    } else {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 6)}`
    }
  }

  const handleNISChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNIS(e.target.value)
    setNis(formatted)
  }

  // Calculate countdown to next report date
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const nextReportDate = reportDates.find((date) => date > now) || reportDates[0]

      // If no future date this year, use next year's first date
      const targetDate =
        nextReportDate > now
          ? nextReportDate
          : new Date(nextReportDate.getFullYear() + 1, nextReportDate.getMonth(), nextReportDate.getDate())

      const timeDiff = targetDate.getTime() - now.getTime()

      if (timeDiff <= 0) {
        setCanViewReports(true)
        return
      }

      // Check if we're within a report viewing period (7 days after report date)
      const isWithinViewingPeriod = reportDates.some((date) => {
        const viewingEndDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
        return now >= date && now <= viewingEndDate
      })

      setCanViewReports(OverrideOpen || isWithinViewingPeriod)

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      setTimeUntilNextReport({ days, hours, minutes, seconds })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogin = async () => {
    setError("")
    setIsLoading(true)

    // Start the minimum 3-second timer
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate data fetching (in real app, this would be an API call)
    const dataFetchPromise = new Promise((resolve, reject) => {
      // Simulate network delay (0-1 second)
      const networkDelay = Math.random() * 1000

      setTimeout(() => {
        if (!nis || !pin) {
          reject("Please enter both NIS and PIN")
          return
        }

        const student = studentDatabase.find((s) => s.NIS === nis && s.pin === pin)
        if (!student) {
          reject("Invalid NIS or PIN")
          return
        }

        if (!canViewReports) {
          reject("Reports are not available yet. Please wait for the next release date.")
          return
        }

        resolve(student)
      }, networkDelay)
    })

    try {
      // Wait for both the minimum loading time AND data fetching to complete
      const [student] = await Promise.all([dataFetchPromise, minLoadingTime])

      setStudentData(student)
      setIsAuthenticated(true)
    } catch (errorMessage) {
      // Still wait for minimum loading time even on error
      await minLoadingTime
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handlePrint = () => {
    window.print()
  }

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#22c55e"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-green-400">{percentage}%</span>
          <span className="text-xs text-gray-400">Kehadiran</span>
        </div>
      </div>
    )
  }

  const AttendanceChart = ({ data }: { data: any }) => {
    const maxValue = Math.max(data.Hadir, data.Sakit, data.Izin, data.Alfa, data.Terlambat)
    const chartData = [
      { label: "Hadir", value: data.Hadir, color: "#22c55e" },
      { label: "Sakit", value: data.Sakit, color: "#3b82f6" },
      { label: "Izin", value: data.Izin, color: "#8b5cf6" },
      { label: "Alpha", value: data.Alfa, color: "#ef4444" },
      { label: "Terlambat", value: data.Terlambat, color: "#f59e0b" },
    ]

    return (
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm text-gray-300 text-right">{item.label}</div>
            <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : "0%",
                  backgroundColor: item.color,
                }}
              />
            </div>
            <div className="w-8 text-sm text-gray-300 text-center">{item.value}</div>
          </div>
        ))}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span className="text-center">Jumlah</span>
          <span>{maxValue}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      {/* Grid background */}
      <div className={`fixed inset-0 ${darkMode ? "futuristic-grid-dark" : "futuristic-grid-light"}`}></div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
        <div className="floating-particle particle-4"></div>
        <div className="floating-particle particle-5"></div>
      </div>

      {/* Top controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className={`${
            darkMode
              ? "bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700 backdrop-blur-sm"
              : "bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 backdrop-blur-sm"
          }`}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className={`${
            darkMode
              ? "bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700 backdrop-blur-sm"
              : "bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 backdrop-blur-sm"
          }`}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* App Header */}
        {!isAuthenticated && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
                  darkMode ? "bg-blue-600" : "bg-blue-500"
                } futuristic-glow`}
              >
                <Zap className="h-8 w-8 text-white" />
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-pulse"></div>
              </div>
            </div>
            <h1
              className={`text-5xl font-bold mb-4 tracking-wider ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } futuristic-gradient-text`}
            >
              PARENT PORTAL
            </h1>
            <div className={`h-1 w-32 mx-auto rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-400"} mb-4`}></div>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Secure access to your child's attendance reports
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full max-w-6xl">
          {/* Countdown Timer */}
          {!canViewReports && !isAuthenticated && (
            <Card
              className={`mb-8 ${
                darkMode
                  ? "bg-slate-800/30 border-slate-600/50 backdrop-blur-xl"
                  : "bg-white/30 border-gray-200/50 backdrop-blur-xl"
              } futuristic-card-glow`}
            >
              <CardHeader className="text-center">
                <CardTitle
                  className={`flex items-center justify-center gap-2 text-2xl ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Clock className="h-6 w-6" />
                  Next Report Available In
                </CardTitle>
                <CardDescription className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Reports are released on June 27th and December 25th each year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6 text-center">
                  {[
                    { label: "Days", value: timeUntilNextReport.days },
                    { label: "Hours", value: timeUntilNextReport.hours },
                    { label: "Minutes", value: timeUntilNextReport.minutes },
                    { label: "Seconds", value: timeUntilNextReport.seconds },
                  ].map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div
                        className={`text-4xl font-bold p-6 rounded-xl relative overflow-hidden ${
                          darkMode ? "bg-slate-700/50 text-white" : "bg-gray-900 text-white"
                        } futuristic-counter`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                        <div className="relative z-10">{item.value.toString().padStart(2, "0")}</div>
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Login Form */}
          {!isAuthenticated && canViewReports && (
            <Card
              className={`max-w-md mx-auto ${
                darkMode
                  ? "bg-slate-800/30 border-slate-600/50 backdrop-blur-xl"
                  : "bg-white/30 border-gray-200/50 backdrop-blur-xl"
              } futuristic-card-glow`}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <Shield className="h-5 w-5" />
                  Student Authentication
                </CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Enter your child's NIS and PIN to view attendance reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    NIS (Student ID)
                  </label>
                  <Input
                    type="text"
                    placeholder="XX.0000"
                    value={nis}
                    onChange={handleNISChange}
                    maxLength={7}
                    disabled={isLoading}
                    className={`futuristic-input ${
                      darkMode
                        ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                        : "bg-white/50 border-gray-300 text-gray-900"
                    } ${isLoading ? "opacity-50" : ""}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>PIN</label>
                  <div className="relative">
                    <Input
                      type={showPin ? "text" : "password"}
                      placeholder="Enter PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      disabled={isLoading}
                      className={`pr-10 futuristic-input ${
                        darkMode
                          ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                          : "bg-white/50 border-gray-300 text-gray-900"
                      } ${isLoading ? "opacity-50" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded-md backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className={`w-full py-6 text-lg font-semibold ${
                    darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                  } text-white futuristic-button disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Report"
                  )}
                </Button>

                <div className={`text-xs text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Demo: TT.8801/123456, TT.8802/654321, TT.8803/789012
                </div>
              </CardContent>
            </Card>
          )}

          {/* Student Report */}
          {isAuthenticated && studentData && (
            <div className="w-full">
              {/* Report Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{studentData.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">Class: {studentData.Class}</span>
                    <span className="text-gray-400">NIS: {studentData.NIS}</span>
                  </div>
                </div>
                <Button
                  onClick={handlePrint}
                  className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              {/* Report Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section - Progress and Stats */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Circular Progress */}
                  <div className="flex justify-center lg:justify-start">
                    <CircularProgress percentage={studentData.PresenceRecap.Percentage} />
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Hadir</div>
                        <div className="text-2xl font-bold text-green-400">{studentData.PresenceRecap.Hadir}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Sakit</div>
                        <div className="text-2xl font-bold text-blue-400">{studentData.PresenceRecap.Sakit}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Izin</div>
                        <div className="text-2xl font-bold text-purple-400">{studentData.PresenceRecap.Izin}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Alpha</div>
                        <div className="text-2xl font-bold text-red-400">{studentData.PresenceRecap.Alfa}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Terlambat</div>
                        <div className="text-2xl font-bold text-yellow-400">{studentData.PresenceRecap.Terlambat}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Section - Chart */}
                <div className="lg:col-span-1">
                  <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <AttendanceChart data={studentData.PresenceRecap} />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Logout Button */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAuthenticated(false)
                    setStudentData(null)
                    setNis("")
                    setPin("")
                    setError("")
                  }}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700 backdrop-blur-sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

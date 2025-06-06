"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, UserX, XCircle } from "lucide-react"
import { CircularProgress } from "@/components/circular-progress"
import {
  Chart,
  ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "@/components/ui/chart"
import Cookies from 'js-cookie'
import {useState, useEffect} from 'react'

// Weekly attendance data
const weeklyAttendanceData = [
  { name: "Senin", hadir: 92, izin: 5, alpha: 2, telat: 1 },
  { name: "Selasa", hadir: 88, izin: 7, alpha: 3, telat: 2 },
  { name: "Rabu", hadir: 90, izin: 6, alpha: 1, telat: 3 },
  { name: "Kamis", hadir: 85, izin: 8, alpha: 4, telat: 3 },
  { name: "Jumat", hadir: 95, izin: 3, alpha: 1, telat: 1 },
]

// Attendance distribution data


// Top classes data
const topClassesData = [
  { name: "X IPA 1", attendance: 95 },
  { name: "XI IPS 2", attendance: 92 },
  { name: "XII IPA 3", attendance: 90 },
  { name: "X IPS 1", attendance: 88 },
  { name: "XI IPA 2", attendance: 87 },
]

interface PercentageResponseAPI{
  Alfa: number,
  Hadir: number,
  Izin: number,
  Sakit: number,
  Terlambat: number
}
interface NumberResponseAPI{
  Alfa: number,
  Hadir: number,
  Izin: number,
  Sakit: number,
  Terlambat: number
}

export default function DashboardPage() {

  const [percentage, setPercentage] = useState<PercentageResponseAPI | null>(null)
const [dataNum, setDataNum] = useState<NumberResponseAPI | null>(null)
const [isFetch, setIsFetch] = useState(false)

const fetchData = async () => {
  const token = Cookies.get('token')
  const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/analytics/get-analytics-percentage', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
  if (response.ok) {
    const data = await response.json()
    setPercentage(data.data)
    setIsFetch(false)
  }
}

const fetchDataNumber = async () => {
  const token = Cookies.get('token')
  const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/analytics/get-analytics-number', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
  if (response.ok) {
    const data = await response.json()
    setDataNum(data.data.analytics)
    setIsFetch(true) // biar gak looping
  }
}

useEffect(() => {
  if (!isFetch) {
    fetchData()
    fetchDataNumber()
  }
}, [isFetch]) // ← ini penting: trigger ulang hanya kalau isFetch berubah

// Ini harus ada setelah dataNum diisi
const attendanceDistributionData = dataNum ? [
  { name: "Hadir", value: dataNum.Hadir, color: "#22c55e" },
  { name: "Izin", value: dataNum.Izin, color: "#3b82f6" },
  { name: "Sakit", value: dataNum.Sakit, color: "#14b8a6" },
  { name: "Alpha", value: dataNum.Alfa, color: "#9ca3af" },
  { name: "Telat", value: dataNum.Terlambat, color: "#f59e0b" },
] : []

console.log(attendanceDistributionData)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight futuristic-gradient-text">Dashboard</h2>
        <p className="text-muted-foreground">
          Ringkasan kehadiran siswa hari ini,{" "}
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="futuristic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Hadir</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <CircularProgress value={percentage?.Hadir || 0} color="#22c55e" textColor="#22c55e" label="Kehadiran" />
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Izin</CardTitle>
            <XCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <CircularProgress value={percentage?.Izin || 0} color="#3b82f6" textColor="#3b82f6" label="Izin" />
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Alpha</CardTitle>
            <UserX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <CircularProgress value={percentage?.Alfa || 0} color="#9ca3af" textColor="#9ca3af" label="Alpha" />
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Terlambat</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <CircularProgress value={percentage?.Terlambat || 0} color="#f59e0b" textColor="#f59e0b" label="Terlambat" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 futuristic-card">
          <CardHeader>
            <CardTitle>Kehadiran Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyAttendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hadir"
                    name="Hadir"
                    stroke="#22c55e"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="izin" name="Izin" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="alpha" name="Alpha" stroke="#9ca3af" strokeWidth={2} />
                  <Line type="monotone" dataKey="telat" name="Telat" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>

        <Card className="col-span-3 futuristic-card">
          <CardHeader>
            <CardTitle>Distribusi Kehadiran</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Chart>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={attendanceDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Chart>
            <div className="mt-4 w-full space-y-2">
              <h3 className="text-sm font-medium">Kelas dengan Kehadiran Tertinggi</h3>
              <div className="space-y-2">
                {topClassesData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded-md bg-blue-950/20 border border-blue-900/20"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="ml-auto text-green-400">{item.attendance}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

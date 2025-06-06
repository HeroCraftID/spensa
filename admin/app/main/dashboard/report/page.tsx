"use client"

import { useEffect, useState } from "react"
import { Download, FileText, Printer, TableIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Chart,
  ChartTooltip,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "@/components/ui/chart"
import { CircularProgress } from "@/components/circular-progress"

const allClasses = [
  "7A", "7B", "7C", "7D", "7E", "7F", "7G", "7H",
  "8A", "8B", "8C", "8D", "8E", "8F", "8G", "8H",
  "9A", "9B", "9C", "9D", "9E", "9F", "9G", "9H",
]

interface StudentReport {
  _id:string,
  NIS:string,
  name:string,
  Class:string,
  presenceNum: string,
  PresenceRecap:{
    Hadir: number,
    Sakit: number,
    Izin: number,
    Alfa: number,
    Terlambat:number
  }
}

export default function ReportPage() {
  const [students, setStudents] = useState<StudentReport[]>([
   
  ])
  const router = useRouter()
  const [selectedName, setSelectedName] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("semester1")
  const [isFetch, setIsFetch] = useState(false)
  const [fullStudentList, setFullStudentList] = useState<StudentReport[]>([])

  // Function to export individual student report to PDF
  const exportToPDF = (student: StudentReport) => {
    // In a real application, we would use a library like jsPDF
    // This is a simulation
    console.log(`Exporting ${student.name}'s report to PDF`)
    alert(`Laporan ${student.name} sedang diunduh sebagai PDF`)
  }
  const printDocument = (nis: string) => {
    router.replace(`/dashboard/report/print/${nis}`)
  }
  const setFilter = (searchName: string) => {
    const filtered = fullStudentList.filter(student =>
      student.name.toLowerCase().includes(searchName.toLowerCase())
    )
    setStudents(filtered)
  }
  const setFilterbyClass = async (Class: string) => {
  setSelectedClass(Class)

  if (Class === "all") {
    // Ambil semua data siswa
    fetchData()
    return
  }

  const token = Cookies.get("token")
  const response = await fetch(`https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/get-presence-report-all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })

  if (response.ok) {
    const data = await response.json()
    // Filter berdasarkan kelas yang dipilih
    const filtered = data.data.filter((student: StudentReport) => student.Class === Class)
    setStudents(filtered)
  } else {
    console.error("Gagal mengambil data siswa.")
  }
}
  // Function to export all students to Excel
  const exportToExcel = () => {
    // In a real application, we would use a library like xlsx
    // This is a simulation
    console.log("Exporting all students to Excel")
    alert("Laporan semua siswa sedang diunduh sebagai Excel")
  }
  const fetchData = async() => {
    const token = Cookies.get('token')
    const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/get-presence-report-all', {
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    if(response.ok){
      const data = await response.json()
      setStudents(data.data)
      setFullStudentList(data.data)
    }
  }

  useEffect(() => {
    if(!isFetch){
      fetchData()
      setIsFetch(true)
    }
  })
  // Function to prepare chart data for a student
  const getStudentChartData = (student: StudentReport) => {
    return [
      { name: "Hadir", value: student.PresenceRecap.Hadir, color: "#22c55e" },
      { name: "Sakit", value: student.PresenceRecap.Sakit, color: "#14b8a6" },
      { name: "Izin", value: student.PresenceRecap.Izin, color: "#3b82f6" },
      { name: "Alpha", value: student.PresenceRecap.Alfa, color: "#9ca3af" },
      { name: "Terlambat", value: student.PresenceRecap.Terlambat, color: "#f59e0b" },
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight futuristic-gradient-text">Report of Attendance</h2>
        <p className="text-muted-foreground">Laporan kehadiran siswa</p>
      </div>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Cari Siswa</Label>
              <Input id="search" placeholder="Cari berdasarkan nama" className="futuristic-input" onChange={(e)=>setFilter(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Select value={selectedClass} onValueChange={setFilterbyClass}>
                <SelectTrigger id="class" className="futuristic-input">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>Semua Kelas</SelectItem>
                  {allClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Periode</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period" className="futuristic-input">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester1">Semester 1</SelectItem>
                  <SelectItem value="semester2">Semester 2</SelectItem>
                  <SelectItem value="full">Tahun Ajaran Penuh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Laporan Kehadiran Siswa</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400"
                  onClick={exportToExcel}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Export XLSX
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export semua data siswa ke Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="accordion" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-950/30">
              <TabsTrigger value="accordion">Tampilan Accordion</TabsTrigger>
              <TabsTrigger value="table">Tampilan Tabel</TabsTrigger>
            </TabsList>
            <TabsContent value="accordion" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {students.map((student) => (
                  <AccordionItem key={student._id} value={student._id} className="border-blue-900/20">
                    <AccordionTrigger className="hover:bg-blue-950/30 px-4 py-2 rounded-md">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.Class}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <CircularProgress
                              value={student.PresenceRecap.Hadir}
                              max={student.PresenceRecap.Hadir + student.PresenceRecap.Sakit + student.PresenceRecap.Izin + student.PresenceRecap.Alfa + student.PresenceRecap.Terlambat}
                              color="#22c55e"
                              textColor="#22c55e"
                              label="Kehadiran"
                            />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-950/20 p-4 rounded-md border border-blue-900/20">
                              <div className="text-sm text-muted-foreground">Hadir</div>
                              <div className="text-2xl font-bold text-green-400">{student.PresenceRecap.Hadir}</div>
                            </div>
                            <div className="bg-blue-950/20 p-4 rounded-md border border-blue-900/20">
                              <div className="text-sm text-muted-foreground">Sakit</div>
                              <div className="text-2xl font-bold text-teal-500">{student.PresenceRecap.Sakit}</div>
                            </div>
                            <div className="bg-blue-950/20 p-4 rounded-md border border-blue-900/20">
                              <div className="text-sm text-muted-foreground">Izin</div>
                              <div className="text-2xl font-bold text-blue-400">{student.PresenceRecap.Izin}</div>
                            </div>
                            <div className="bg-blue-950/20 p-4 rounded-md border border-blue-900/20">
                              <div className="text-sm text-muted-foreground">Alpha</div>
                              <div className="text-2xl font-bold text-gray-400">{student.PresenceRecap.Alfa}</div>
                            </div>
                            <div className="bg-blue-950/20 p-4 rounded-md border border-blue-900/20">
                              <div className="text-sm text-muted-foreground">Terlambat</div>
                              <div className="text-2xl font-bold text-yellow-400">{student.PresenceRecap.Terlambat}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Chart>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={getStudentChartData(student)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                                <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => value.toString().replace(/,/g, '')}/>
                                <YAxis dataKey="name" type="category" stroke="#9ca3af" />
                                <Legend />
                                <Bar dataKey="value" name="Jumlah">
                                  {getStudentChartData(student).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </Chart>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400"
                                onClick={() => printDocument(student.NIS)}
                              >
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Export laporan {student.name} ke PDF</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            <TabsContent value="table" className="mt-4">
              <div className="border border-blue-900/20 rounded-md overflow-hidden">
                <table className="w-full futuristic-table">
                  <thead>
                    <tr>
                      <th className="text-left p-3">Nama</th>
                      <th className="text-left p-3">Kelas</th>
                      <th className="text-center p-3">Hadir</th>
                      <th className="text-center p-3">Sakit</th>
                      <th className="text-center p-3">Izin</th>
                      <th className="text-center p-3">Alpha</th>
                      <th className="text-center p-3">Terlambat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="p-3 font-medium">{student.name}</td>
                        <td className="p-3">{student.Class}</td>
                        <td className="p-3 text-center text-green-400 font-medium">{student.PresenceRecap.Hadir}</td>
                        <td className="p-3 text-center text-teal-500 font-medium">{student.PresenceRecap.Sakit}</td>
                        <td className="p-3 text-center text-blue-400 font-medium">{student.PresenceRecap.Izin}</td>
                        <td className="p-3 text-center text-gray-400 font-medium">{student.PresenceRecap.Alfa}</td>
                        <td className="p-3 text-center text-yellow-400 font-medium">{student.PresenceRecap.Terlambat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400"
                  onClick={exportToExcel}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Export XLSX
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

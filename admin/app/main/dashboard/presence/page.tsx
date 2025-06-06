"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, Eye, ThumbsDown, ThumbsUp, UserX, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Cookies from 'js-cookie'
import Modal from'@/components/Modal'
import { modal } from "@/lib/modal";
import { RefreshCw } from "lucide-react"

type AttendanceStatus = "Hadir" | "Belum Absen" | "Izin" | "Sakit" | "Alfa" | "Terlambat"
type ActionStatus = "Accepted" | "Rejected" | "Pending"| null

interface Student {
  _id: string
  NIS: string
  name: string
  Class: string
  presenceNum: number
  PresenceType: AttendanceStatus
  PresenceTime: string | null
  PresenceStatus: ActionStatus
  LeaveDetail: {
    reason: string
    startTime: string
    endTime: string
  }
}

export default function PresencePage() {
  const [students, setStudents] = useState<Student[]>([])

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  const [selectedClass, setSelectedClass] = useState<string>("XI IPA 1")

  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [isFetch, setIsFetch] = useState(false)

  const fetchData = async () => {
    const token = Cookies.get('token')
    const response = await fetch(`https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/get-today-presence`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    })
    if(response.ok){
      const data = await response.json()
      setStudents(data.data)
      
      setIsFetch(true)
    }
  }
  const fetchDataRefresh = async () => {
    const token = Cookies.get('token')
    const response = await fetch(`https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/get-today-presence`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    })
    if(response.ok){
      const data = await response.json()
      setStudents(data.data)
    }
  }
  useEffect(() => {
    if(!isFetch){
      fetchData()
    }
  })
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "Hadir":
        return (
          <span className="status-badge status-present">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Hadir
          </span>
        )
      case "Belum Absen":
        return (
          <span className="status-badge status-absent">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Belum Absen
          </span>
        )
      case "Izin":
        return (
          <span className="status-badge status-excused">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Izin
          </span>
        )
      case "Alfa":
        return (
          <span className="status-badge status-alpha">
            <UserX className="h-3.5 w-3.5 mr-1" />
            Alpha
          </span>
        )
      case "Terlambat":
        return (
          <span className="status-badge status-late">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Telat
          </span>
        )
    }
  }

  const getActionStatusBadge = (status: ActionStatus) => {
    if (!status) return null

    switch (status) {
      case "Accepted":
        return (
          <span className="status-badge status-present">
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            Accepted
          </span>
        )
      case "Rejected":
        return (
          <span className="status-badge status-absent">
            <ThumbsDown className="h-3.5 w-3.5 mr-1" />
            Declined
          </span>
        )
    }
  }

  const handleApproval = async (NIS:string, isAccept: boolean, category:string) => {
    const token = Cookies.get('token')
    const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/set-approval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        NIS: NIS,
        isAccept: isAccept,
        category: category
      })
    })
    if(response.ok){
      const data = await response.json()
      fetchData()
      await modal({
      title: "Sukses",
      message: "Absensi dari NIS : " + NIS + " telah Di" + (isAccept ? "Terima" : "Tolak"),
      type: "success",
    });
      
    }else{
      const data = await response.json()
      console.log('error')
      console.error(data.message)
    }
  }
  const handleView = (student: Student) => {
    setViewStudent(student)
    setViewDialogOpen(true)
  }

  

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight futuristic-gradient-text">Presence</h2>
        <p className="text-muted-foreground">Kelola kehadiran siswa hari ini</p>
      </div>
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="futuristic-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class" className="futuristic-input">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X IPA 1">X IPA 1</SelectItem>
                  <SelectItem value="X IPA 2">X IPA 2</SelectItem>
                  <SelectItem value="XI IPA 1">XI IPA 1</SelectItem>
                  <SelectItem value="XI IPA 2">XI IPA 2</SelectItem>
                  <SelectItem value="XII IPA 1">XII IPA 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <div className="inline-flex items-center space-x-2">
            <CardTitle>Daftar Kehadiran Siswa</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDataRefresh()}
              className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400 p-1"
              aria-label="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="futuristic-table">
            <TableHeader>
              <TableRow>
                <TableHead>NIS/NISN</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>No. Absen</TableHead>
                <TableHead>Status Absen</TableHead>
                <TableHead>Waktu Presensi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.NIS}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.Class}</TableCell>
                  <TableCell>{student.presenceNum}</TableCell>
                  <TableCell>{getStatusBadge(student.PresenceType)}</TableCell>
                  <TableCell>{student.PresenceType === "Izin" || student.PresenceType ==="Sakit" ? student.LeaveDetail?.startTime + " - " + student.LeaveDetail?.endTime : student.PresenceType === "Alfa" ? " - " : student.PresenceTime}</TableCell>
                  <TableCell>{getActionStatusBadge(student.PresenceStatus)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400"
                        onClick={() => handleView(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {student.PresenceStatus === "Pending" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500/30 hover:bg-green-900/30 text-green-400 hover:text-green-300"
                            onClick={() => handleApproval(student.NIS, true, student.PresenceType)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 hover:bg-red-900/30 text-red-400 hover:text-red-300"
                            onClick={() => handleApproval(student.NIS, false, student.PresenceType)}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="futuristic-card">
          <DialogHeader>
            <DialogTitle>Detail Kehadiran Siswa</DialogTitle>
            <DialogDescription>Informasi lengkap kehadiran siswa</DialogDescription>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>NIS/NISN</Label>
                  <div className="font-medium">{viewStudent.NIS}</div>
                </div>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>Nama</Label>
                  <div className="font-medium">{viewStudent.name}</div>
                </div>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>Kelas</Label>
                  <div>{viewStudent.Class}</div>
                </div>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>No. Absen</Label>
                  <div>{viewStudent.presenceNum}</div>
                </div>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>Status Absen</Label>
                  <div>{getStatusBadge(viewStudent.PresenceType)}</div>
                </div>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>Waktu Presensi</Label>
                  <div>{viewStudent.PresenceType === "Izin" || viewStudent.PresenceType ==="Sakit" ? viewStudent.LeaveDetail?.startTime + " - " + viewStudent.LeaveDetail?.endTime : viewStudent.PresenceType === "Alfa" ? "Alfa" : viewStudent.PresenceTime}</div>
                </div>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>Status</Label>
                  <div>{getActionStatusBadge(viewStudent.PresenceStatus) || "-"}</div>
                </div>
              </div>

              {viewStudent.PresenceType === "Izin" && (
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
                  <Label>Keterangan Izin</Label>
                  <div className="p-3 border border-blue-900/20 rounded-md mt-1 bg-blue-950/30">
                    Izin karena sakit demam dan flu. Surat keterangan dokter telah dilampirkan.
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

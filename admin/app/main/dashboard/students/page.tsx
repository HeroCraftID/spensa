"use client"

import { useState, useEffect } from "react"
import { PlusCircle, SquarePen, Eye, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Student {
  _id: string
  NIS: string
  name: string
  Class: string
  presenceNum: string
  gender: string
  address: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const router = useRouter()

  // Add / Edit modal open
  const [openModal, setOpenModal] = useState(false)

  // View modal open
  const [viewModalOpen, setViewModalOpen] = useState(false)

  // Delete confirm modal open
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Mode: edit or add
  const [editMode, setEditMode] = useState(false)

  // Selected student for view/edit/delete
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const [formData, setFormData] = useState({
    NIS: "",
    name: "",
    Class: "",
    presenceNum: "",
    gender: "",
    address: "",
  })

  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token')
      if (!token) {
        router.replace('/main/login')
      }
      const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      if (!response.ok) {
        router.replace('/main/login')
      }
    }

    verifyToken()
    handleGetData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddStudent = async () => {
    const token = Cookies.get("token")
    try {
      const res = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal menambahkan siswa")
      }

      toast.success("Siswa berhasil ditambahkan!")
      setOpenModal(false)
      setFormData({ NIS: "", name: "", Class: "", presenceNum: "", gender: "", address: "" })
      handleGetData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleEditStudent = async () => {
    if (!selectedStudent) return;
    const token = Cookies.get("token")
    try {
      const res = await fetch(`https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/user/update/${selectedStudent.NIS}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal mengupdate siswa")
      }

      toast.success("Siswa berhasil diupdate!")
      setOpenModal(false)
      setSelectedStudent(null)
      setFormData({ NIS: "", name: "", Class: "", presenceNum: "", gender: "", address: "" })
      handleGetData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return
    const token = Cookies.get("token")
    try {
      const res = await fetch(`https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/user/delete/${selectedStudent.NIS}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal menghapus siswa")
      }

      toast.success("Siswa berhasil dihapus!")
      setDeleteModalOpen(false)
      setSelectedStudent(null)
      handleGetData()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }

  const handleGetData = async () => {
    const token = Cookies.get('token')
    const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/user/get-all-users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
    if (response.ok) {
      const data = await response.json()
      setStudents(data.data.users)
    }
  }

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const matchNameOrNIS =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.NIS.toLowerCase().includes(searchTerm.toLowerCase())

    const matchClass = selectedClass === "all" || student.Class === selectedClass

    return matchNameOrNIS && matchClass
  })

  // Open edit modal with pre-filled form
  const openEditModal = (student: Student) => {
    setSelectedStudent(student)
    setFormData({
      NIS: student.NIS,
      name: student.name,
      Class: student.Class,
      presenceNum: student.presenceNum,
      gender: student.gender,
      address: student.address,
    })
    setEditMode(true)
    setOpenModal(true)
  }

  // Open view modal
  const openViewModal = (student: Student) => {
    setSelectedStudent(student)
    setViewModalOpen(true)
  }

  // Open delete modal
  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student)
    setDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight futuristic-gradient-text">Students</h2>
          <p className="text-muted-foreground">Kelola data siswa</p>
        </div>

        {/* Add Student Modal */}
        <Dialog open={openModal} onOpenChange={(open) => {
          setOpenModal(open)
          if (!open) {
            setEditMode(false)
            setSelectedStudent(null)
            setFormData({ NIS: "", name: "", Class: "", presenceNum: "", gender: "", address: "" })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="futuristic-button">
              <PlusCircle className="h-4 w-4 mr-2" />
              {editMode ? "Edit Siswa" : "Tambah Siswa"}
            </Button>
          </DialogTrigger>
          <DialogContent className="futuristic-card w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input name="NIS" placeholder="NIS" value={formData.NIS} onChange={handleInputChange} />
              <Input name="name" placeholder="Nama" value={formData.name} onChange={handleInputChange} />
              <Input name="Class" placeholder="Kelas (contoh: 9B)" value={formData.Class} onChange={handleInputChange} />
              <Input name="presenceNum" placeholder="Nomor Absen" value={formData.presenceNum} onChange={handleInputChange} />
              <Input name="gender" placeholder="Jenis Kelamin" value={formData.gender} onChange={handleInputChange} />
              <Textarea name="address" placeholder="Alamat" value={formData.address} onChange={handleInputChange} />
            </div>
            <DialogFooter>
              <Button
                onClick={editMode ? handleEditStudent : handleAddStudent}
                className="futuristic-button-green"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Card */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Cari Siswa</Label>
              <Input
                id="search"
                placeholder="Cari berdasarkan nama atau NIS"
                className="futuristic-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class" className="futuristic-input">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  <SelectItem value="7A">7A</SelectItem>
                  <SelectItem value="7B">7B</SelectItem>
                  <SelectItem value="7C">7C</SelectItem>
                  <SelectItem value="7D">7D</SelectItem>
                  <SelectItem value="7E">7E</SelectItem>
                  <SelectItem value="7F">7F</SelectItem>
                  <SelectItem value="7G">7G</SelectItem>
                  <SelectItem value="7H">7H</SelectItem>
                  <SelectItem value="8A">8A</SelectItem>
                  <SelectItem value="8B">8B</SelectItem>
                  <SelectItem value="8C">8C</SelectItem>
                  <SelectItem value="8D">8D</SelectItem>
                  <SelectItem value="8E">8E</SelectItem>
                  <SelectItem value="8F">8F</SelectItem>
                  <SelectItem value="8G">8G</SelectItem>
                  <SelectItem value="8H">8H</SelectItem>
                  <SelectItem value="9A">9A</SelectItem>
                  <SelectItem value="9B">9B</SelectItem>
                  <SelectItem value="9C">9C</SelectItem>
                  <SelectItem value="9D">9D</SelectItem>
                  <SelectItem value="9E">9E</SelectItem>
                  <SelectItem value="9F">9F</SelectItem>
                  <SelectItem value="9G">9G</SelectItem>
                  <SelectItem value="9H">9H</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="text-white">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">NIS</TableHead>
                <TableHead className="text-white">Nama</TableHead>
                <TableHead className="text-white">Kelas</TableHead>
                <TableHead className="text-white">No. Absen</TableHead>
                <TableHead className="text-white">Jenis Kelamin</TableHead>
                <TableHead className="text-white">Alamat</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Tidak ada data siswa
                  </TableCell>
                </TableRow>
              )}
              {filteredStudents.map((student) => (
                <TableRow key={student._id} className="hover:bg-gray-800 cursor-pointer">
                  <TableCell>{student.NIS}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.Class}</TableCell>
                  <TableCell>{student.presenceNum}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openViewModal(student)}
                      title="Lihat Detail"
                      className="text-cyan-400 hover:text-cyan-600"
                    >
                      <Eye />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(student)}
                      title="Edit Siswa"
                      className="text-green-400 hover:text-green-600"
                    >
                      <SquarePen />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(student)}
                      title="Hapus Siswa"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Student Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="futuristic-card max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-white">
            <p><strong>NIS:</strong> {selectedStudent?.NIS}</p>
            <p><strong>Nama:</strong> {selectedStudent?.name}</p>
            <p><strong>Kelas:</strong> {selectedStudent?.Class}</p>
            <p><strong>No. Absen:</strong> {selectedStudent?.presenceNum}</p>
            <p><strong>Jenis Kelamin:</strong> {selectedStudent?.gender}</p>
            <p><strong>Alamat:</strong> {selectedStudent?.address}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewModalOpen(false)} className="futuristic-button">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="futuristic-card max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p className="text-white mb-6">
            Apakah Anda yakin ingin menghapus siswa <strong>{selectedStudent?.name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter className="flex justify-end space-x-3">
            <Button
            variant="outline"
            onClick={() => setDeleteModalOpen(false)}
            className="text-white border-white hover:bg-gray-700"
            >
            Batal
            </Button>
            <Button onClick={handleDeleteStudent} className="bg-red-600 hover:bg-red-700 text-white" >
            Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
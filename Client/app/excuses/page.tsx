"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { CheckCircle, Lock, KeyRound, ArrowRight, User, Search, Info } from "lucide-react"
import Link from "next/link"
import { differenceInDays } from "date-fns"
import Cookies from 'js-cookie'


interface Response{
  name:string
  Class:string
  presenceNum:number
}
// Simulated API function to fetch student data based on NIS
const fetchStudentDataByNIS = async (nis: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate different student data based on NIS
  // In a real implementation, this would be an actual API call
  const numericPart = nis.substring(3) // Get the numeric part after XX.
  const firstDigit = numericPart.charAt(0)

  // Generate some sample data based on the first digit of the numeric part
  if (firstDigit >= "0" && firstDigit <= "3") {
    return {
      nama: "Ahmad Rizky",
      kelas: "XII IPA 1",
      nomorAbsen: "01",
    }
  } else if (firstDigit >= "4" && firstDigit <= "7") {
    return {
      nama: "Nadia Putri",
      kelas: "XI IPS 2",
      nomorAbsen: "15",
    }
  } else {
    return {
      nama: "Budi Santoso",
      kelas: "X RPL 3",
      nomorAbsen: "22",
    }
  }
}

export default function ExcusePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"token" | "form">("token")
  const [token, setToken] = useState("")
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const [formData, setFormData] = useState({
    nis: "",
    nama: "",
    kelas: "",
    nomorAbsen: "",

    jenisIzin: "",
    alasanIzin: "",
    emailOrtu: "",
  })
  const [isLoadingStudentData, setIsLoadingStudentData] = useState(false)
  const [nisError, setNisError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [durationDays, setDurationDays] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [studentDataFetched, setStudentDataFetched] = useState(false)

  // Calculate duration when dates change
  useEffect(() => {
  if (startDate && endDate) {
    let count = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const day = current.getDay();
      const isWeekday = day >= 1 && day <= 5; // Senin (1) s.d Jumat (5)
      if (isWeekday) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    setDurationDays(count);
  } else {
    setDurationDays(0);
  }
}, [startDate, endDate]);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value)
    if (tokenError) {
      setTokenError(null)
    }
  }

  const verifyToken = async () => {
  if (!token.trim()) {
    setTokenError("Token harus diisi");
    return;
  }

  setIsVerifying(true);

  try {
    const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/token/excuse/compare-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      setTokenError(data.message || "Token tidak valid");
      return;
    }
    if(response.ok){
      Cookies.set('token', token)
    }


    // Token is valid, proceed to form
    console.log("Author:", data.author); // optional: do something with author
    setCurrentStep("form");

  } catch (error) {
    setTokenError("Terjadi kesalahan saat memverifikasi token");
  } finally {
    setIsVerifying(false);
  }
};

  // Format NIS as user types
  const handleNisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()

    // Remove any characters that don't match our format
    let formattedValue = value

    // If we're entering the first part (the letters)
    if (value.length <= 2) {
      // Only allow letters
      formattedValue = value.replace(/[^A-Z]/g, "")
    }
    // If we're at position 3, ensure it's a dot
    else if (value.length === 3 && value[2] !== ".") {
      formattedValue = value.substring(0, 2) + "."
    }
    // If we're past the dot, only allow numbers for the remaining part
    else if (value.length > 3) {
      const letters = value.substring(0, 2)
      let numbers = value.substring(3).replace(/[^0-9]/g, "")

      // Limit numbers to 4 digits
      if (numbers.length > 4) {
        numbers = numbers.substring(0, 4)
      }

      formattedValue = letters + "." + numbers
    }

    setFormData((prev) => ({
      ...prev,
      nis: formattedValue,
    }))

    if (nisError) {
      setNisError(null)
    }

    // Reset student data if NIS changes
    if (studentDataFetched) {
      setFormData((prev) => ({
        ...prev,
        nama: "",
        kelas: "",
        nomorAbsen: "",
        nis: formattedValue,
      }))
      setStudentDataFetched(false)
    }
  }

  // Validate NIS format
  const isValidNisFormat = (nis: string): boolean => {
    // Check format: XX.0000 where XX are identical letters
    const regex = /^([A-Z])\1\.\d{4}$/
    return regex.test(nis)
  }

  const fetchStudentData = async () => {
  const token = Cookies.get('token');
  if (!formData.nis) {
    setNisError("NIS harus diisi");
    return;
  }

  if (!isValidNisFormat(formData.nis)) {
    setNisError("Format NIS tidak valid. Gunakan format XX.0000 dengan XX adalah huruf kembar (contoh: AA.1234)");
    return;
  }

  setIsLoadingStudentData(true);
  setNisError(null);

  try {
    const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/token/excuse/get-student-identity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ NIS: formData.nis })
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Gagal mendapatkan data siswa");
    }

    const studentData = json.data;

    setFormData((prev) => ({
      ...prev,
      nama: studentData.name,
      kelas: studentData.Class,
      nomorAbsen: studentData.presenceNum.toString(),
    }));

    setStudentDataFetched(true);
  } catch (error) {
    setNisError("Gagal mendapatkan data siswa");
    setStudentDataFetched(false);
  } finally {
    setIsLoadingStudentData(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string },
  ) => {
    const { name, value } = "target" in e ? e.target : e

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    handleChange({ name, value })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nis.trim()) {
      newErrors.nis = "NIS harus diisi"
    } else if (!isValidNisFormat(formData.nis)) {
      newErrors.nis = "Format NIS tidak valid. Gunakan format XX.0000 dengan XX adalah huruf kembar (contoh: AA.1234)"
    }

    if (!studentDataFetched) {
      newErrors.nis = "Data siswa belum diambil"
    }

    if (!formData.jenisIzin) {
      newErrors.jenisIzin = "Jenis izin harus dipilih"
    }

    // Always check if reason is provided, but with different error messages based on duration
    if (!formData.alasanIzin.trim()) {
        newErrors.alasanIzin = "Alasan izin harus diisi"
    } else if (formData.alasanIzin.length > 550) {
      newErrors.alasanIzin = "Alasan izin maksimal 550 karakter"
    }

    

    if (!startDate) {
      newErrors.startDate = "Tanggal mulai harus diisi"
    }

    if (!endDate) {
      newErrors.endDate = "Tanggal selesai harus diisi"
    }

    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "Tanggal selesai tidak boleh sebelum tanggal mulai"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const token = Cookies.get('token')
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/set-excuse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          NIS: formData.nis,
          excuseType: formData.jenisIzin,
          startDate,
          endDate,
          reason: formData.alasanIzin,
        }),

      })
      if(response.ok){
        const data = await response.json()
        // Show success state
        setIsSuccess(true)

        // Reset form after 5 seconds and redirect to home
        setTimeout(() => {
          router.push("/")
        }, 5000)
      }else{
        console.log(response)
      }
      
      

      
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({
        submit: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 blur-3xl -z-10" />

          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
              IZIN TERKIRIM
            </h1>

            <div className="space-y-2">
              <p className="text-gray-400">Permintaan izin Anda telah berhasil dikirim.</p>
              <p className="text-gray-500 text-sm">
                Nama: <span className="text-green-400">{formData.nama}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Jenis Izin: <span className="text-green-400">{formData.jenisIzin}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Durasi: <span className="text-green-400">{durationDays} hari</span>
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300 ease-linear animate-[progress_5s_ease-in-out]" />
              </div>
              <p className="text-gray-500 text-sm">KEMBALI KE HALAMAN UTAMA DALAM BEBERAPA DETIK...</p>
            </div>

            <div className="pt-4">
              <Link href="/">
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 transition-all duration-300">
                  KEMBALI SEKARANG
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Token verification step
  if (currentStep === "token") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl -z-10" />

          <div className="text-center space-y-2 mb-6">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              VERIFIKASI TOKEN
            </h1>
            <p className="text-gray-400">Masukkan token untuk mengakses form izin</p>
          </div>

          <div className="space-y-6 bg-black/30 p-6 rounded-lg border border-gray-800">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                <KeyRound className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-gray-300">
                  Token Akses
                </Label>
                <div className="relative">
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={handleTokenChange}
                    placeholder="Masukkan token akses"
                    className="bg-black/50 border-gray-700 pl-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        verifyToken()
                      }
                    }}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                {tokenError && <p className="text-red-500 text-xs">{tokenError}</p>}
              </div>

              <Button
                onClick={verifyToken}
                disabled={isVerifying}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    MEMVERIFIKASI...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    LANJUTKAN
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                Kembali ke halaman utama
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Main form step
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl -z-10" />

        <div className="text-center space-y-2 mb-6">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            FORM IZIN
          </h1>
          <p className="text-gray-400">Isi formulir di bawah untuk mengajukan izin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4 bg-black/30 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-purple-400">Informasi Siswa</h2>
              {studentDataFetched && (
                <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                  <User size={12} />
                  <span>Data Terverifikasi</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="nis" className="text-gray-300 flex items-center gap-2">
                  NIS
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-black border border-gray-700 rounded-md text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Format: XX.0000 (XX adalah huruf kembar, contoh: AA, BB, CC)
                      <div className="absolute left-0 top-full h-2 w-2 bg-black border-r border-b border-gray-700 transform rotate-45 -translate-y-1 translate-x-2"></div>
                    </div>
                  </div>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="nis"
                      name="nis"
                      value={formData.nis}
                      onChange={handleNisChange}
                      placeholder="XX.0000"
                      className="bg-black/50 border-gray-700 pl-10 uppercase"
                      disabled={isLoadingStudentData}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <Button
                    type="button"
                    onClick={() => fetchStudentData()}
                    disabled={isLoadingStudentData || !formData.nis || !isValidNisFormat(formData.nis)}
                    className="bg-purple-600 hover:bg-purple-500 transition-all duration-300"
                  >
                    {isLoadingStudentData ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {nisError && <p className="text-red-500 text-xs">{nisError}</p>}
                {errors.nis && <p className="text-red-500 text-xs">{errors.nis}</p>}
                <p className="text-gray-500 text-xs">Format: XX.0000 (contoh: TT.8801)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama" className="text-gray-300">
                  Nama
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  readOnly
                  className="bg-black/50 border-gray-700 opacity-80 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="kelas" className="text-gray-300">
                    Kelas
                  </Label>
                  <Input
                    id="kelas"
                    name="kelas"
                    value={formData.kelas}
                    readOnly
                    className="bg-black/50 border-gray-700 opacity-80 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorAbsen" className="text-gray-300">
                    Nomor Absen
                  </Label>
                  <Input
                    id="nomorAbsen"
                    name="nomorAbsen"
                    value={formData.nomorAbsen}
                    readOnly
                    className="bg-black/50 border-gray-700 opacity-80 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Excuse Details Section */}
          <div className="space-y-4 bg-black/30 p-4 rounded-lg border border-gray-800">
            <h2 className="text-lg font-medium text-purple-400">Detail Izin</h2>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="jenisIzin" className="text-gray-300">
                  Jenis Izin
                </Label>
                <Select value={formData.jenisIzin} onValueChange={(value) => handleSelectChange(value, "jenisIzin")}>
                  <SelectTrigger className="bg-black/50 border-gray-700">
                    <SelectValue placeholder="Pilih jenis izin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Izin">Izin</SelectItem>
                    <SelectItem value="Sakit">Sakit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.jenisIzin && <p className="text-red-500 text-xs">{errors.jenisIzin}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-300">
                    Tanggal Mulai
                  </Label>
                  <DatePicker date={startDate} setDate={setStartDate} label="Pilih tanggal" />
                  {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-300">
                    Tanggal Selesai
                  </Label>
                  <DatePicker date={endDate} setDate={setEndDate} label="Pilih tanggal" />
                  {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}
                </div>
              </div>

              {startDate && endDate && durationDays > 0 && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-md p-2">
                  <p className="text-sm text-center">
                    Durasi izin: <span className="font-bold text-purple-400">{durationDays} hari</span>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alasanIzin" className="text-gray-300 flex items-center">
                  Alasan Izin
                </Label>
                <Textarea
                  id="alasanIzin"
                  name="alasanIzin"
                  value={formData.alasanIzin}
                  onChange={handleChange}
                  placeholder={"Jelaskan alasan izin (maksimal 550 karakter)"}
                  className={`bg-black/50 border-gray-700 min-h-[100px] `}
                  maxLength={550}
                />
                <p className="text-gray-500 text-xs text-right">{formData.alasanIzin.length}/550 karakter</p>
                {errors.alasanIzin && <p className="text-red-500 text-xs">{errors.alasanIzin}</p>}
              </div>
            </div>
          </div>

          

          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500 rounded-md p-3">
              <p className="text-red-500 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !studentDataFetched}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  MENGIRIM...
                </span>
              ) : (
                "KIRIM IZIN"
              )}
            </Button>

            <Link href="/" className="text-center text-gray-400 hover:text-white text-sm">
              Kembali ke halaman utama
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

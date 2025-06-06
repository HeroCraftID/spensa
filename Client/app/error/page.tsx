"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Router } from "lucide-react"
import { useEffect, useState } from "react"
import { config } from "@/lib/config"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get("code") || ""
  const reason = searchParams.get("reason") || ""
  const [nextAvailableTime, setNextAvailableTime] = useState<string>("")

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  // Determine the type of error
  const errorType = reason === "time"
    ? "time"
    : reason === "invalid-nis"
    ? "nis"
    : reason === "already-attend"
    ? "already-attend"
    : "general"

  useEffect(() => {
   ;
    if (errorType === "time") {
      const now = new Date()
      const targetTime = new Date(now)
      targetTime.setHours(config.access.startHour, config.access.startMinute, 0, 0)

      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1)
      }
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }

      setNextAvailableTime(targetTime.toLocaleString("en-US", options))
      
    }
  }, [errorType])

  useEffect(() => {
    delay(3000).then(() => {
      console.log("Redirecting to home page...")
      router.push('/main/')
    })
  })

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl -z-10" />

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              {errorType === "time" ? (
                <Clock className="h-10 w-10 text-red-500" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-red-500" />
              )}
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
            {errorType === "time"
              ? "ACCESS UNAVAILABLE"
              : errorType === "nis"
              ? "INVALID IDENTIFICATION"
              : errorType === "already-attend"
              ? "ALREADY ATTENDED"
              : "Something went wrong"}
          </h1>

          <div className="space-y-2">
            {errorType === "time" ? (
              <>
                <p className="text-gray-400">System access is currently restricted.</p>
                <p className="text-gray-500 text-sm">
                  Access will be available at: <span className="text-orange-400">{nextAvailableTime}</span>
                </p>
                <p className="text-gray-500 text-sm">System hours: {config.getSystemHours()}</p>
              </>
            ) : errorType === "nis" ? (
              <>
                <p className="text-gray-400">Your NIS appears to be invalid or not recognized.</p>
                <p className="text-gray-500 text-sm">
                  Please double-check your NIS. If the issue continues, contact the administrator.
                </p>
              </>
            ) : errorType === "already-attend" ? (
              <>
                <p className="text-gray-400">Siswa dilarang melakukan absensi sebanyak 2 kali</p>
                <p className="text-gray-500 text-sm">
                  Jika kamu merasa belum melakukan absensi, silahkan hubungi admin untuk mendapatkan bantuan.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-400">An unknown error occurred on the server.</p>
                <p className="text-gray-500 text-sm">
                  This may be temporary. Try again or contact support if the issue persists.
                </p>
              </>
            )}
            <p className="text-gray-500 text-sm">Error code: {code || "0x89asISE9"}</p>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all duration-300">
                {errorType === "time" ? "CHECK AVAILABILITY" : "RETURN TO ACCESS PORTAL"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

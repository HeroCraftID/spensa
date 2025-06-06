"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole, User } from "lucide-react"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [formData, setFormData] = useState({
    otc: ''
  })
  const isHaveCookies = async () => {
    const cookies = Cookies.get('token')
    if(cookies){
      router.replace('/main/dashboard')
    }
  }
  useEffect(() => {
    isHaveCookies()
  })
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    const otc = formData.otc
    const username = Cookies.get("username")

    const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/2fa/verify', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: otc, username })
    })

    const data = await response.json()
    if (response.ok) {
      Cookies.set('token', data.token)
      localStorage.removeItem("username") // bersihkan
      router.replace('/main/dashboard')
    } else {
      setError(true)
      setErrorMsg(data.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animated-bg"></div>
      <div className="grid-lines"></div>

      <Card className="w-full max-w-md futuristic-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center futuristic-gradient-text">
            2-Step Verification
          </CardTitle>
          <CardDescription className="text-center">Masukkan kode verifikasi dari Google Authentication untuk melanjutkan</CardDescription>
          {error ? (
            <>
              <br />
              <div className="mx-4 mb-2 rounded-md border border-red-500 bg-red-900/40 p-3 text-sm text-red-300 flex items-center gap-3">
                <svg
                  className="h-4 w-4 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.643-1.14 1.077-2.043L13.077 4.958c-.526-.87-1.833-.87-2.359 0L3.005 17.957C2.439 18.86 3.028 20 4.082 20z"
                  />
                </svg>
                <span className="font-semibold">{errorMsg}</span>
              </div>
            </>
          ) : null}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">One Time Code</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                <Input id="username" placeholder="Masukkan One Time Code" className="pl-9 futuristic-input" onChange={(e) => setFormData({ ...formData, otc: e.target.value })} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full futuristic-button" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code") || "Unknown"
  const [countdown, setCountdown] = useState(5)
  const [progress, setProgress] = useState(100)

  // Handle countdown and redirection
  useEffect(() => {
    // Start countdown
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
        setProgress((countdown - 1) * 20) // 5 seconds = 100%, 4 seconds = 80%, etc.
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // Redirect to home page when countdown reaches 0
      router.push("/")
    }
  }, [countdown, router])

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
            PRESENCE SUCCESS
          </h1>

          <div className="space-y-2">
            <p className="text-gray-400">Welcome to the system, user.</p>
            <p className="text-gray-500 text-sm">
              NIS: <span className="text-green-400 font-mono">{code}</span>
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">
              REDIRECTING IN <span className="text-green-400 font-mono">{countdown}</span> SECONDS...
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

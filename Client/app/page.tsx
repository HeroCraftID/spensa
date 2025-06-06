"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Countdown from "@/components/countdown"
import { Button } from "@/components/ui/button"
import FormatInput from "@/components/format-input"
import ValidationIndicator from "@/components/validation-indicator"
import { config } from "@/lib/config"
import Cookies from 'js-cookie'

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [asked, setAsked] = useState<boolean>(false)
  const router = useRouter()

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  // Check if current time is past the configured end time
  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const targetTime = new Date(now)
      targetTime.setHours(config.access.endHour, config.access.endMinute, 0, 0)

      if (now > targetTime) {
        // Redirect to error page with 307 status code
        router.push("/error?code=307&reason=time")
      }
    }

    // Check immediately on page load
    checkTime()


    // Also set up an interval to check periodically
    const interval = setInterval(checkTime, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [router])

  // Validate input when it changes
  useEffect(() => {
    // Check if the input matches the pattern: 2 identical uppercase letters + dot + 4 digits
    const isFormatValid = /^([A-Z])\1\.\d{4}$/.test(inputValue)

    setIsValid(isFormatValid)

    if (inputValue && !isFormatValid) {
      if (inputValue.length >= 2 && inputValue[0] !== inputValue[1]) {
        setError("Both letters must be identical (e.g., AA.1234, BB.5678)")
      } else {
        setError("Format must be XX.0000 (2 identical uppercase letters, dot, 4 digits)")
      }
    } else {
      setError(null)
    }
  }, [inputValue])

  // Auto-submit after 4 seconds if valid
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isValid && !isSubmitting) {
      timer = setTimeout(() => {
        handleSubmit()
      }, 2000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isValid, isSubmitting])
  const passkeyCheck = async () => {
    const passkeyCookies = Cookies.get('passkey')
    if(!passkeyCookies){
      if(!asked){
      const passkey = prompt("Enter Passkey: ") || ""
      const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/system/compare-passkeys", {
        method: "POST",
        body: JSON.stringify({
          passkey: passkey
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if(response.ok) {
        const data = await response.json()
        console.log(data)
        setAsked(true)
        Cookies.set('passkey', passkey, { expires: 2 })
      }else{
        alert("Invalid Passkey")
        router.push("https://google.com")
      }
      }
    }
  }
  useEffect(() => {
    passkeyCheck()
  })
  // Update the handleSubmit function to include format validation
  const handleSubmit = async () => {
    // Check if the input matches the pattern: 2 identical uppercase letters + dot + 4 digits
    const isFormatValid = /^([A-Z])\1\.\d{4}$/.test(inputValue)

    if (!isFormatValid) {
      if (inputValue.length >= 2 && inputValue[0] !== inputValue[1]) {
        setError("Both letters must be identical (e.g., AA.1234, BB.5678)")
      } else {
        setError("Format must be XX.0000 (2 identical uppercase letters, dot, 4 digits)")
      }
      return
    }

    setIsSubmitting(true)

    try {
      const post = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/set-presence", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          NIS: inputValue,
        }),
      })
      const data = await post.json()
      console.log(data)
      if(data.statusCode === 200){
        router.push(`success?code=${data.data.user.NIS}`)
      }else if(data.statusCode === 404 ){
        router.push(`/error?code=${data.statusCode}&reason=invalid-nis`)
      }else if(data.data.error === "Student already attended!"){
        router.push(`/error?code=${data.statusCode}&reason=already-attend`)
      }
    } catch (err) {
      // Error - redirect to error page
      router.push("/error")
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl -z-10" />

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            PRESENCE
          </h1>
          <p className="text-gray-400">Enter your access code</p>
        </div>

        <Countdown />

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <FormatInput
                value={inputValue}
                onChange={setInputValue}
                className="bg-black/50 border-gray-700 text-center text-xl tracking-widest h-14"
              />
              <ValidationIndicator isValid={isValid} showIndicator={inputValue.length > 0} />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {isValid && !isSubmitting && (
              <div className="flex justify-center">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse rounded-full w-full">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-[progress_2s_ease-in-out]" />
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                PROCESSING
              </span>
            ) : (
              "SUBMIT"
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}

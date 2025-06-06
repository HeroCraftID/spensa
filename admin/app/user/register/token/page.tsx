"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Key, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateToken } from "@/lib/token-utils"
import { toast } from "@/components/ui/use-toast"

export default function RegisterTokenPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const dataToken = token
    // Validate the token
    const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/token/registration/compare-token', {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        token: dataToken
      })
    })

    if (response.ok) {
      // In a real app, we would mark the token as "in use" in the database
      // and store the token in the session/local storage for the next steps

      // Store token and role in session storage for the registration process
      const data = await response.json()
      sessionStorage.setItem("registrationToken", token)
      sessionStorage.setItem("registrationNIP", data.NIP)
      sessionStorage.setItem("registrationRole", data.role || "")

      // Redirect to the next step
      setTimeout(() => {
        setIsLoading(false)
        router.push("/main/register/steps")
      }, 1000)
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setError("Invalid registration token. Please check and try again.")
        toast({
          title: "Invalid Token",
          description: "The registration token you entered is invalid or has already been used.",
          variant: "destructive",
        })
      }, 1000)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animated-bg"></div>
      <div className="grid-lines"></div>

      <Card className="w-full max-w-md futuristic-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center futuristic-gradient-text">REGISTRATION</CardTitle>
          <CardDescription className="text-center">
            Enter your registration token to begin the account setup process
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Registration Token</Label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                <Input
                  id="token"
                  placeholder="Enter your token (e.g., ADM-123456)"
                  className="pl-9 futuristic-input font-mono uppercase"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Your registration token was provided by an administrator. It determines your role in the system.
              </p>
            </div>
            <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/20">
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                <span>
                  This is a secure registration process. Your token will determine your access level in the system.
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full futuristic-button" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Continue Registration"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

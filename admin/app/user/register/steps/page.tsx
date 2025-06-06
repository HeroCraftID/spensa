"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Eye, EyeOff, Key, Lock, QrCode, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Cookies from 'js-cookie'

// Mock function to generate QR code data
const generateQRCode = (username: string) => {
  // In a real app, this would generate a proper MFA secret and QR code
  return `otpauth://totp/SistemAbsensi:${username}?secret=JBSWY3DPEHPK3PXP&issuer=SistemAbsensi`
}

export default function RegisterStepsPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [qrImage, setQrImage] = useState("")
  const [qrManualEntry, setQrManualEntry] = useState("")

  // Step 1: Basic Information
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")

  // Step 2: Account Credentials
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Step 3: MFA Setup
  const [qrCodeData, setQrCodeData] = useState("")

  // Step 4: MFA Verification
  const [mfaCode, setMfaCode] = useState("")

  // Registration role from token
  const [role, setRole] = useState("")

  useEffect(() => {
    // Check if we have a registration token in session storage
    const token = sessionStorage.getItem("registrationToken")
    const storedRole = sessionStorage.getItem("registrationRole")

    if (!token || !storedRole) {
      // If no token, redirect back to token page
      router.push("/main/register/token")
      return
    }

    setRole(storedRole)
  }, [router])
  const handleSubmit = async() => {
    try{
      setIsLoading(true)

      const otc = mfaCode
      const username = sessionStorage.getItem("username")

      const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/2fa/verify', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otc, username })
      })

      if (response.ok) {
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        console.log("error")
        return false
      }
    }catch(err){
      setIsLoading(false)
      console.log(err)
      return false
    }
  }
  const handleRegister = async() => {
    const tokenData = sessionStorage.getItem('registrationToken') || ""
    const role = sessionStorage.getItem('registrationRole')?.toLowerCase() || ""
    const NIP = sessionStorage.getItem('registrationNIP') || ""
    const response = await fetch('https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/create', {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
        token: tokenData
      },
      body:JSON.stringify({
        NIP,
        username,
        name,
        password,
        role,
        gender,
        address
      })
    })
    if(response.ok){
      const data = await response.json()
      sessionStorage.setItem('username', data.data.admin.username)
      setQrImage(data.data.qrCode)
      setQrManualEntry(data.data.admin.mfaEntry)
      return true
    }else{
      return false
    }
  }
  const handleNextStep = async() => {
    setIsLoading(true)

    // Validate current step
    if (currentStep === 1) {
      if (!name || !gender || !address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    } else if (currentStep === 2) {
      if (!username || !password || !confirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Generate QR code for next step
      handleRegister()
    } else if (currentStep === 3) {
      // In a real app, we would verify the QR code was scanned
      // For demo, we'll just proceed
    } else if (currentStep === 4) {
      const result = await handleSubmit()
      if (result == false) {
        toast({
          title: "Invalid Code",
          description: "Please enter a valid 6-digit MFA code.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }

    // Proceed to next step
    setTimeout(() => {
      setIsLoading(false)
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
      } else {
        // Registration complete
        // In a real app, we would submit all data to the server
        sessionStorage.removeItem("registrationToken")
        sessionStorage.removeItem("registrationRole")
        router.push("/main/login")
      }
    }, 500)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="border-blue-900/30 bg-blue-950/20 text-white placeholder:text-gray-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-white">
                  Gender
                </Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="text-white">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="text-white">
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-white">
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your address"
                  className="border-blue-900/30 bg-blue-950/20 text-white placeholder:text-gray-500 min-h-[100px]"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        )

      case 2:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-white">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    className="pl-9 border-blue-900/30 bg-blue-950/20 text-white placeholder:text-gray-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-9 pr-9 border-blue-900/30 bg-blue-950/20 text-white placeholder:text-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-9 border-blue-900/30 bg-blue-950/20 text-white placeholder:text-gray-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </>
        )

      case 3:
        return (
          <>
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-md mx-auto w-48 h-48 flex items-center justify-center">
                  <img src={qrImage} className="h-32 w-32 text-black"></img>
                </div>
                <p className="mt-2 text-sm text-gray-400">Scan this QR code with your authenticator app</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-white">Manual Entry Code</Label>
                <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/30 font-mono text-center text-white">
                  {qrManualEntry}
                </div>
                <p className="text-xs text-gray-400">
                  If you can't scan the QR code, you can manually enter this code in your authenticator app.
                </p>
              </div>

              <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/30">
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-gray-300">
                    We recommend using Google Authenticator, Microsoft Authenticator, or Authy.
                  </span>
                </div>
              </div>
            </div>
          </>
        )

      case 4:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mfa-code" className="text-sm font-medium text-white">
                  Enter 6-digit Code
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                  <Input
                    id="mfa-code"
                    placeholder="Enter the 6-digit code"
                    className="pl-9 border-blue-900/30 bg-blue-950/20 text-white placeholder:text-gray-500 font-mono text-center text-lg tracking-widest"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Enter the 6-digit code from your authenticator app to verify setup.
                </p>
                <p className="text-xs text-blue-400">For demo purposes, use code: 123456</p>
              </div>
            </div>
          </>
        )

      case 5:
        return (
          <>
            <div className="space-y-6 text-center">
              <div className="mx-auto bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>

              <h3 className="text-xl font-bold text-white">Registration Complete!</h3>

              <p className="text-gray-400">
                Your account has been successfully created. You can now log in to the system.
              </p>

              <div className="bg-blue-950/20 p-3 rounded-md border border-blue-900/30">
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-gray-300">
                    You have been registered as a <span className="font-bold text-blue-400">{role}</span>. Your access
                    level has been set accordingly.
                  </span>
                </div>
              </div>
            </div>
          </>
        )
    }
  }

  const stepLabels = [
    { num: 1, label: "Info                 " },
    { num: 2, label: "Account" },
    { num: 3, label: "MFA" },
    { num: 4, label: "Verify" },
  ]

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0e17] relative overflow-hidden">
      {/* Enhanced grid background */}
      <div className="animated-bg"></div>
      <div className="register-grid-background"></div>

      {/* Glowing orbs for futuristic effect */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl"></div>

      <Card className="w-full max-w-2xl border border-blue-900/30 bg-[#0a0e17]/90 backdrop-blur-sm shadow-lg relative z-10 mx-4">
        <CardHeader className="space-y-6 pb-0">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#38b6ff]">ACCOUNT SETUP</h1>
            <p className="text-sm text-gray-400 mt-1">
              {currentStep === 1 && "Step 1: Basic Information"}
              {currentStep === 2 && "Step 2: Account Credentials"}
              {currentStep === 3 && "Step 3: MFA Setup"}
              {currentStep === 4 && "Step 4: MFA Verification"}
              {currentStep === 5 && "Your account has been created"}
            </p>
          </div>

          {currentStep < 5 && (
            <div className="flex justify-center">
              <div className="flex justify-center items-center gap-x-4">
                {stepLabels.map((step, index) => (
                  <div key={step.num} className="flex items-center">
                    {/* Step block: circle + label */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                          "translate-y-[5px]", // sejajarkan dengan garis
                          step.num <= currentStep
                            ? "border-[#38b6ff] text-[#38b6ff]"
                            : "border-gray-600 text-gray-500"
                        )}
                      >
                        <span className="text-sm">{step.num}</span>
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-2", // konsisten di semua step
                          step.num <= currentStep ? "text-[#38b6ff]" : "text-gray-500"
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                    {/* Connector line */}
                    {index < stepLabels.length - 1 && (
                      <div className="w-16 md:w-16 h-[2px] bg-gray-600 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


        </CardHeader>
        <CardContent className="pt-6 px-8">{renderStepContent()}</CardContent>
        <CardFooter className="pt-2 px-8 pb-8">
          <Button
            className="w-full bg-[#38b6ff] hover:bg-[#38b6ff]/90 text-white py-6"
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading ? (
              "Processing..."
            ) : currentStep === 5 ? (
              "Go to Login"
            ) : (
              <div className="flex items-center justify-center w-full">
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

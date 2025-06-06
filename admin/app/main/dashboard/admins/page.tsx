"use client"

import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import {useRouter} from 'next/navigation'
import { Copy, Plus, RefreshCw, Shield, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

interface Token {
  id: string
  NIP: string
  token: string
  role: string
  used: boolean
  author: string
}

export default function AdminsPage() {
  const router = useRouter()
  const [tokens, setTokens] = useState<Token[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTokenRole, setNewTokenRole] = useState("Admin")
  const [newTokenNip, setNewTokenNip] = useState("")
  const [authorNip, setAuthorNip] = useState("")
  const [tokenPreview, setTokenPreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  // Ambil data authorNip dari /auth/me saat load halaman
  useEffect(() => {
    async function fetchAuthor() {
      try {
        const res = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/me", {
          headers: {
            Authorization: "Bearer " + Cookies.get('token'), // sesuaikan sumber token kamu
          },
        })
        if (res.ok) {
          const data = await res.json()
          setAuthorNip(data?.data?.NIP || "")
        }
      } catch (error) {
        console.error("Failed to fetch author NIP:", error)
      }
    }
    fetchAuthor()
    loadTokens()
  }, [])

  // Load semua token untuk tabel
  async function loadTokens() {
    try {
      const res = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/token/registration/get-all-token", {
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
        },
      })
      if (res.ok) {
        const data = await res.json()
        // Asumsi data tokens array sudah sesuai format
        setTokens(
          data.data.tokens.map((t: any) => ({
            id: t.id,
            NIP: t.NIP,
            token: t.token,
            role: t.role,
            used: t.used,
            author: t.author,
          }))
        )
      } else {
        toast({
          title: "Error",
          description: "Failed to load tokens",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to load tokens",
        variant: "destructive",
      })
    }
  }

  const verifyToken = async () => {
    try {
      const token = Cookies.get("token") || ""
      const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/me", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setAuthorNip(data.data.admin.NIP)
        console.log(authorNip)
        Cookies.set("token", token)
        setVerified(true)
      } else {
        router.push("/main/")
      }
    } catch {
      router.push("/main/")
    }
  }

  useEffect(()=>{
    if(!verified){
      verifyToken()
    }
  })
  // Generate preview token realtime dari nip & role
  useEffect(() => {
    if (newTokenNip && newTokenRole && authorNip) {
      generatePreviewToken()
    } else {
      setTokenPreview("")
    }
  }, [newTokenNip, newTokenRole, authorNip])

  // Generate preview token dari API (misal endpoint yang sama dipakai)
  async function generatePreviewToken() {
    try {
      // Kalau ada endpoint khusus generate token preview tanpa simpan, pakai itu,
      // kalau tidak, kita bisa generate manual atau pakai helper.
      // Contoh kita generate token dummy format: ROLE-NIP-RANDOM6
      const randomPart = Math.floor(100000 + Math.random() * 900000).toString()
      setTokenPreview(`${newTokenRole.substring(0, 3).toUpperCase()}-${newTokenNip}-${randomPart}`)
    } catch (error) {
      console.error(error)
      setTokenPreview("")
    }
  }

  // Fungsi create token via API POST
  const handleCreateToken = async () => {
    if (!newTokenNip || !newTokenRole) {
      toast({
        title: "Error",
        description: "NIP and Role must be filled",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/token/registration/get-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get('token'),
        },
        body: JSON.stringify({
          NIP: newTokenNip,
          role: newTokenRole,
          author: authorNip,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        // Refresh daftar token
        await loadTokens()
        toast({
          title: "Token Created",
          description: `New ${newTokenRole} token created for NIP ${newTokenNip}`,
        })
        setIsCreateDialogOpen(false)
        setNewTokenNip("")
        setNewTokenRole("Admin")
        setTokenPreview("")
      } else {
        toast({
          title: "Failed",
          description: data.message || "Failed to create token",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create token",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteToken = (id: string) => {
    setTokens(tokens.filter((token) => token.id !== id))
    toast({
      title: "Token Deleted",
      description: "The registration token has been deleted.",
    })
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast({
      title: "Token Copied",
      description: "The registration token has been copied to clipboard.",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight futuristic-gradient-text">Admins</h2>
          <p className="text-muted-foreground">Manage registration tokens for new users</p>
        </div>
        <Button className="futuristic-button" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Token
        </Button>
      </div>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Registration Tokens</CardTitle>
          <CardDescription>
            Generate and manage registration tokens for new users. Each token can be used once to register a new
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="futuristic-table">
            <TableHeader>
              <TableRow>
                <TableHead>NIP</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-mono">{token.NIP}</TableCell>
                  <TableCell className="font-mono">{token.token}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-400" />
                      {token.role}
                    </div>
                  </TableCell>
                  <TableCell>{token.author}</TableCell>
                  <TableCell>
                    {token.used ? (
                      <span className="status-badge status-absent">Used</span>
                    ) : (
                      <span className="status-badge status-present">Available</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400"
                              onClick={() => handleCopyToken(token.token)}
                              disabled={token.used}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy Token</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 hover:bg-red-900/30 text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteToken(token.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Token</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="futuristic-card">
          <DialogHeader>
            <DialogTitle>Generate Registration Token</DialogTitle>
            <DialogDescription>
              Create a new registration token for a specific role. This token can be used to register a new account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                value={newTokenNip}
                onChange={(e) => setNewTokenNip(e.target.value)}
                placeholder="Enter NIP"
                className="futuristic-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={newTokenRole} onValueChange={setNewTokenRole}>
                <SelectTrigger id="role" className="futuristic-input">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="BK">BK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Token Preview</Label>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-950/40 p-3 rounded-md border border-blue-900/20 font-mono w-full">
                  {tokenPreview || "NIP and Role required"}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400"
                  onClick={generatePreviewToken}
                  disabled={!newTokenNip || !newTokenRole}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This token will be valid for 30 days and can only be used once.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="futuristic-button"
              onClick={handleCreateToken}
              disabled={isLoading}
            >
              Generate Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

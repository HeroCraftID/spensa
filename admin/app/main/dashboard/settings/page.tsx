"use client"

import { useState } from "react"
import { Bell, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight futuristic-gradient-text">Settings</h2>
        <p className="text-muted-foreground">Kelola pengaturan sistem absensi</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto bg-blue-950/30">
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="school">Sekolah</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4 mt-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Kelola informasi profil Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" defaultValue="Admin Sekolah" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@sekolah.edu" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Jabatan</Label>
                <Input id="role" defaultValue="Administrator" className="futuristic-input" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="futuristic-button">Simpan Perubahan</Button>
            </CardFooter>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>Kelola keamanan akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input id="current-password" type="password" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input id="new-password" type="password" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input id="confirm-password" type="password" className="futuristic-input" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="futuristic-button">Ubah Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-blue-400" />
                  <Label htmlFor="notifications" className="flex-1">
                    Aktifkan Notifikasi
                  </Label>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>
              <Separator className="bg-blue-900/20" />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <Label htmlFor="email-notifications" className="flex-1">
                    Notifikasi Email
                  </Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-email">Email Notifikasi</Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@sekolah.edu"
                  disabled={!notificationsEnabled || !emailNotifications}
                  className="futuristic-input"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={!notificationsEnabled} className="futuristic-button">
                Simpan Preferensi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="school" className="space-y-4 mt-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Informasi Sekolah</CardTitle>
              <CardDescription>Kelola informasi sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nama Sekolah</Label>
                <Input id="school-name" defaultValue="SMA Negeri 1 Contoh" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-address">Alamat</Label>
                <Textarea
                  id="school-address"
                  defaultValue="Jl. Pendidikan No. 123, Kota Contoh, 12345"
                  className="futuristic-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-phone">Nomor Telepon</Label>
                <Input id="school-phone" defaultValue="(021) 1234567" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-email">Email</Label>
                <Input
                  id="school-email"
                  type="email"
                  defaultValue="info@sman1contoh.sch.id"
                  className="futuristic-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-website">Website</Label>
                <Input id="school-website" defaultValue="https://www.sman1contoh.sch.id" className="futuristic-input" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="futuristic-button">Simpan Informasi</Button>
            </CardFooter>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Tahun Ajaran</CardTitle>
              <CardDescription>Kelola informasi tahun ajaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="academic-year">Tahun Ajaran Aktif</Label>
                <Input id="academic-year" defaultValue="2023/2024" className="futuristic-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester Aktif</Label>
                <Input id="semester" defaultValue="Ganjil" className="futuristic-input" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="futuristic-button">Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page
  redirect("/admin/education/spensa/821022/absen/main/login")
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import appConfig from "@/lib/config"

export function middleware(request: NextRequest) {
  // Check if current time is past the configured end time
  const now = new Date()
  const targetTime = new Date(now)
  targetTime.setHours(appConfig.access.endHour, appConfig.access.endMinute, 0, 0)

  // If we're past the end time and not already on the error page
  if (now > targetTime && !request.nextUrl.pathname.startsWith("/error")) {
    // Create a URL for the error page
    const url = request.nextUrl.clone()
    url.pathname = "/error"
    url.search = "?code=307&reason=time"

    // Return a 307 temporary redirect
    return NextResponse.redirect(url, 307)
  }

  return NextResponse.next()
}

// Only run this middleware on the home page and success page
export const config = {
  matcher: ["/", "/success"],
}

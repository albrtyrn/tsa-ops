import { proxy } from "@/proxy" // Adjust this import path to where your proxy.ts lives
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await proxy(request)
}

// Next.js requires the matcher config to be in this root file
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app-sidebar'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TSA @ UVA Culinary Operations',
  description: 'Lightweight student organization planning hub for TSA at UVA food events, grocery runs, and volunteer coordination.',
  generator: 'TSA at UVA Culinary Ops',
  icons: {
    icon: [
      {
        url: '/tsaatuva.png',
        type: 'image/png',
      },
    ],
    apple: '/tsaatuva.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f7fa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <TooltipProvider delay={0}>
          <div className="flex min-h-screen w-full bg-background justify-center">
            <SidebarProvider className="w-full max-w-[1400px] flex">
              <AppSidebar />
              <SidebarInset>
                <div className="flex flex-1 flex-col w-full">
                  <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                    <SidebarTrigger />
                    <span className="text-sm font-semibold">TSA Culinary Ops Copilot</span>
                  </header>
                  <main className="flex-1 w-full min-w-0 flex flex-col">
                    {children}
                  </main>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </TooltipProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

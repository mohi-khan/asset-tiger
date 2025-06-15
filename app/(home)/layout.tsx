import { Toaster } from '@/components/ui/toaster'
import '.././globals.css'
import { Inter } from 'next/font/google'
import HomeNavbar from '@/components/shared/home-navbar'
const inter = Inter({ subsets: ['latin'] })

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex items-center justify-center min-h-max">
            <HomeNavbar />
          <div className="p-8 bg-white rounded">{children}</div>
          <Toaster />
        </div>
      </body>
    </html>
  )
}

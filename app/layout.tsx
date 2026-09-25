import './globals.css'
import { JetBrains_Mono } from 'next/font/google'
import SidebarLayout from '@/components/SidebarLayout'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = { title: 'RehabGrip' }

// Runs before paint so the correct theme class is present on first render (no flash).
const THEME_INIT = `try{var t=localStorage.getItem('rg-theme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}`

export default function L({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  )
}

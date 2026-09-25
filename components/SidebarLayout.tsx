'use client'
import { usePathname } from 'next/navigation'
import { useHand } from '@/store/handStore'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ToastHost from '@/components/ui/Toast'

interface NavItem { path: string; icon: React.ReactNode; label: string; badge?: boolean }

const I = (d: string) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={d} /></svg>
)

const navItems: NavItem[] = [
  { path: '/session', label: 'Session', icon: I('M5 8l2-2m12 0l2 2M7 10v7a2 2 0 002 2h6a2 2 0 002-2v-7M9 6h6M12 2v4') },
  { path: '/emg', label: 'EMG', icon: I('M3 12h3l2-5 2 10 2-5 3 0M20 12h1M2 12h1') },
  { path: '/patients', label: 'Patients', icon: I('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9') },
  { path: '/history', label: 'History', icon: I('M3 3h18v18H3zM3 9h18M9 3v18M15 3v18') },
  { path: '/lab', label: 'AI Lab', badge: true, icon: I('M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4a3 3 0 0 0-3 0zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1') },
  { path: '/analytics', label: 'Analytics', icon: I('M3 3v18h18M7 14l3-3 3 3 4-4') },
  { path: '/reports', label: 'Reports', icon: I('M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6') },
  { path: '/settings', label: 'Settings', icon: I('M12 1v4m0 14v4M23 12h-4m-14 0H1M20.485 3.515l-2.828 2.828m-11.314 11.314l-2.828 2.828M20.485 20.485l-2.828-2.828m-11.314-11.314l-2.828-2.828') },
]

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const battery = useHand(s => s.battery)
  const [mounted, setMounted] = useState(false)
  const [light, setLight] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLight(!document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const next = !light
    setLight(next)
    document.documentElement.classList.toggle('dark', !next)
    try { localStorage.setItem('rg-theme', next ? 'light' : 'dark') } catch {}
  }

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[52px] bg-[#f8fafc] dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1f1f1f] flex flex-col items-center py-4 z-30">
        <div className="flex flex-col gap-4">
          {navItems.map(item => {
            const isActive = pathname === item.path
            return (
              <div key={item.path} className="relative group">
                <Link
                  href={item.path}
                  className={`w-11 h-11 flex items-center justify-center rounded-lg cursor-pointer transition-colors relative
                    ${isActive ? 'text-[#0F6E5E]' : 'text-gray-400 dark:text-[#555555] hover:text-gray-700 dark:hover:text-[#888888]'}`}
                >
                  {item.icon}
                  {item.badge && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#0F6E5E]" />}
                  {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0F6E5E]" />}
                </Link>
                <div className="absolute left-[52px] top-1/2 -translate-y-1/2 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#1f1f1f] shadow-sm dark:shadow-none rounded-md px-3 py-1.5 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-mono text-gray-800 dark:text-[#f0f0f0]">{item.label}{item.badge ? ' · NEW' : ''}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <button
              aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#555555] hover:text-gray-700 dark:hover:text-[#888888] transition-colors"
            >
              {light
                ? <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.4-6.4l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4L17 17M7 7L5.6 5.6"/><circle cx="12" cy="12" r="4"/></svg>
                : <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>}
            </button>
            <div className="absolute left-[52px] top-1/2 -translate-y-1/2 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#1f1f1f] rounded-md px-3 py-1.5 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-mono text-gray-800 dark:text-[#f0f0f0]">{light ? 'Dark theme' : 'Light theme'}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 dark:text-[#555555]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="6" width="16" height="10" rx="2" /><rect x="19" y="8" width="2" height="6" />
            </svg>
            <span className="text-[8px] font-mono text-gray-400 dark:text-[#555555] mt-0.5">{mounted ? battery : 100}%</span>
          </div>
          <div className="text-[7px] font-mono text-gray-300 dark:text-[#333333]">v1.1</div>
        </div>
      </aside>
      <main className="ml-[52px] w-[calc(100%-52px)] h-screen overflow-auto bg-[#f8fafc] dark:bg-[#0a0a0a]">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <ToastHost />
    </>
  )
}

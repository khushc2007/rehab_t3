'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Listener = (msg: string) => void
let listener: Listener | null = null

// Call from anywhere: toast('✓ Notes saved')
export function toast(msg: string) { listener?.(msg) }

// Mount once near the root (SidebarLayout does this). Shows one toast at a time, queued.
export default function ToastHost() {
  const [queue, setQueue] = useState<string[]>([])
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => { listener = (msg: string) => setQueue(q => [...q, msg]); return () => { listener = null } }, [])

  useEffect(() => {
    if (!current && queue.length) { setCurrent(queue[0]); setQueue(q => q.slice(1)) }
  }, [queue, current])

  useEffect(() => {
    if (!current) return
    const t = setTimeout(() => setCurrent(null), 2500)
    return () => clearTimeout(t)
  }, [current])

  return (
    <div className="fixed bottom-5 right-5 z-[100] pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-gray-900 text-white text-[11px] rounded-lg px-4 py-2.5 shadow-lg"
          >
            {current}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

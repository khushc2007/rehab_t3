'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHand, sensorRef } from '@/store/handStore'
import { motion } from 'framer-motion'

const FINGER_NAMES = ['INDEX', 'MIDDLE', 'RING', 'PINKY']

export default function CalibrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [countdown, setCountdown] = useState(10)
  const [fingersDone, setFingersDone] = useState([false, false, false, false])
  const [currentFinger, setCurrentFinger] = useState(0)
  const [romRange, setRomRange] = useState({ min: 0, max: 0 })
  const sim = useHand(s => s.sim)
  const setSim = useHand(s => s.setSim)

  // Step 0: Rest Baseline countdown
  useEffect(() => {
    if (step !== 0) return
    if (countdown <= 0) {
      setStep(1)
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [step, countdown])

  // Step 1: Open Hand detection
  useEffect(() => {
    if (step !== 1) return
    const interval = setInterval(() => {
      const avgROM = (sensorRef.current.f[0] + sensorRef.current.f[1] + sensorRef.current.f[2] + sensorRef.current.f[3]) / 4
      if (avgROM > 15) {
        setFingersDone([true, true, true, true])
      }
    }, 200)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Close Hand detection
  useEffect(() => {
    if (step !== 2) return
    const interval = setInterval(() => {
      const avgROM = (sensorRef.current.f[0] + sensorRef.current.f[1] + sensorRef.current.f[2] + sensorRef.current.f[3]) / 4
      if (avgROM > 60) {
        setRomRange(prev => ({ ...prev, max: Math.max(prev.max, avgROM) }))
      }
    }, 200)
    return () => clearInterval(interval)
  }, [step])

  // Step 3: Individual finger detection
  useEffect(() => {
    if (step !== 3 || currentFinger >= 4) return

    let detected = false
    let timeout: NodeJS.Timeout

    const interval = setInterval(() => {
      if (sensorRef.current.f[currentFinger] > 45 && !detected) {
        detected = true
        setFingersDone(prev => {
          const newDone = [...prev]
          newDone[currentFinger] = true
          return newDone
        })
        timeout = setTimeout(() => {
          if (currentFinger < 3) {
            setCurrentFinger(currentFinger + 1)
            detected = false
            setFingersDone(prev => {
              const newDone = [...prev]
              newDone[currentFinger + 1] = false
              return newDone
            })
          } else {
            setStep(4)
          }
        }, 500)
      }
    }, 200)

    // Timeout if finger not detected within 5s
    const stepTimeout = setTimeout(() => {
      if (!detected && currentFinger < 3) {
        setCurrentFinger(currentFinger + 1)
      } else if (!detected && currentFinger === 3) {
        setStep(4)
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      clearTimeout(stepTimeout)
    }
  }, [step, currentFinger])

  const handleRecalibrate = () => {
    setStep(0)
    setCountdown(10)
    setFingersDone([false, false, false, false])
    setCurrentFinger(0)
    setRomRange({ min: 0, max: 0 })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-[8px] font-mono uppercase tracking-widest text-[#333333] mb-1">REHABGRIP</div>
        <div className="text-[8px] font-mono uppercase tracking-widest text-[#0F6E5E]">CALIBRATION</div>
      </div>

      {/* Progress Bar */}
      {step < 4 && (
        <div className="w-full max-w-sm mb-12">
          <div className="text-[9px] font-mono text-[#555555] mb-2">STEP {step + 1} OF 4</div>
          <div className="h-[2px] bg-[#1f1f1f] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0F6E5E]"
              initial={{ width: '0%' }}
              animate={{ width: `${((step + 1) / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Step 0: Rest Baseline */}
      {step === 0 && (
        <motion.div className="max-w-sm w-full bg-[#161616] rounded-2xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Hand SVG */}
          <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] mx-auto mb-6">
            <motion.g
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              {/* Palm */}
              <rect x="40" y="40" width="40" height="50" rx="10" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
              {/* Fingers */}
              <rect x="30" y="15" width="12" height="30" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
              <rect x="50" y="10" width="12" height="35" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
              <rect x="70" y="12" width="12" height="33" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
              <rect x="85" y="35" width="12" height="25" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
            </motion.g>
          </svg>

          <div className="text-lg font-mono text-[#f0f0f0] mt-6 mb-2">Rest Your Hand</div>
          <div className="text-xs font-mono text-[#888888] leading-relaxed mb-6">
            Place your hand flat on a surface. Recording baseline sensor values.
          </div>

          <div className="text-5xl font-mono text-[#0F6E5E] mb-4">⏱ {countdown}s</div>
          <div className="text-[9px] font-mono text-[#555555]">Stay still during recording</div>
        </motion.div>
      )}

      {/* Step 1: Open Hand */}
      {step === 1 && (
        <motion.div className="max-w-sm w-full bg-[#161616] rounded-2xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Hand SVG - Spread */}
          <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] mx-auto mb-6">
            {/* Palm */}
            <rect x="40" y="50" width="40" height="40" rx="8" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
            {/* Fingers spread */}
            <rect x="15" y="20" width="12" height="40" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" transform="rotate(-20 21 60)" />
            <rect x="35" y="5" width="12" height="45" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" transform="rotate(-10 41 50)" />
            <rect x="73" y="5" width="12" height="45" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" transform="rotate(10 79 50)" />
            <rect x="93" y="20" width="12" height="40" rx="6" fill="none" stroke="#0F6E5E" strokeWidth="1.5" transform="rotate(20 99 60)" />
          </svg>

          <div className="text-lg font-mono text-[#f0f0f0] mt-6 mb-2">Open Your Hand</div>
          <div className="text-xs font-mono text-[#888888] leading-relaxed mb-6">Spread all five fingers as wide as you can.</div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {['INDEX', 'MIDDLE', 'RING', 'PINKY'].map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${fingersDone[i] ? 'bg-[#0F6E5E]' : 'bg-[#333333]'}`} />
                <span className="text-[9px] font-mono text-[#555555]">
                  {name} {fingersDone[i] && '✓'}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled={!fingersDone.every(d => d)}
            onClick={() => setStep(2)}
            className={`w-full py-3 rounded-lg font-mono text-[9px] transition-colors ${
              fingersDone.every(d => d)
                ? 'bg-[#0F6E5E] text-[#f0f0f0] hover:bg-[#1a8a78]'
                : 'bg-[#1a1a1a] text-[#555555] cursor-not-allowed'
            }`}
          >
            CONTINUE
          </button>
        </motion.div>
      )}

      {/* Step 2: Close Hand */}
      {step === 2 && (
        <motion.div className="max-w-sm w-full bg-[#161616] rounded-2xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Hand SVG - Fist */}
          <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] mx-auto mb-6">
            {/* Palm/fist */}
            <rect x="35" y="40" width="50" height="50" rx="12" fill="none" stroke="#0F6E5E" strokeWidth="1.5" />
            {/* Knuckles */}
            <circle cx="45" cy="42" r="3" fill="none" stroke="#0F6E5E" strokeWidth="1" />
            <circle cx="60" cy="40" r="3" fill="none" stroke="#0F6E5E" strokeWidth="1" />
            <circle cx="75" cy="42" r="3" fill="none" stroke="#0F6E5E" strokeWidth="1" />
            <circle cx="85" cy="50" r="3" fill="none" stroke="#0F6E5E" strokeWidth="1" />
          </svg>

          <div className="text-lg font-mono text-[#f0f0f0] mt-6 mb-2">Make a Fist</div>
          <div className="text-xs font-mono text-[#888888] leading-relaxed mb-6">Curl all your fingers inward as tightly as you can.</div>

          <div className="text-4xl font-mono text-[#0F6E5E] mb-2">ROM DETECTED: {romRange.max.toFixed(0)}°</div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {['INDEX', 'MIDDLE', 'RING', 'PINKY'].map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${fingersDone[i] ? 'bg-[#0F6E5E]' : 'bg-[#333333]'}`} />
                <span className="text-[9px] font-mono text-[#555555]">
                  {name} {fingersDone[i] && '✓'}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled={romRange.max < 50}
            onClick={() => setStep(3)}
            className={`w-full py-3 rounded-lg font-mono text-[9px] transition-colors ${
              romRange.max >= 50
                ? 'bg-[#0F6E5E] text-[#f0f0f0] hover:bg-[#1a8a78]'
                : 'bg-[#1a1a1a] text-[#555555] cursor-not-allowed'
            }`}
          >
            CONTINUE
          </button>
        </motion.div>
      )}

      {/* Step 3: Individual Fingers */}
      {step === 3 && (
        <motion.div className="max-w-sm w-full bg-[#161616] rounded-2xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Hand SVG - One finger highlighted */}
          <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] mx-auto mb-6">
            <rect x="40" y="50" width="40" height="40" rx="8" fill="none" stroke="#333333" strokeWidth="1.5" />
            {[0, 1, 2, 3].map((i, idx) => {
              const isActive = idx === currentFinger
              const xPos = [20, 40, 60, 80][idx]
              return (
                <rect
                  key={i}
                  x={xPos}
                  y="10"
                  width="12"
                  height="45"
                  rx="6"
                  fill="none"
                  stroke={isActive ? '#0F6E5E' : '#333333'}
                  strokeWidth="1.5"
                  opacity={isActive ? 1 : 0.3}
                />
              )
            })}
          </svg>

          <motion.div key={currentFinger} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-lg font-mono text-[#0F6E5E] mt-6">MOVE YOUR {FINGER_NAMES[currentFinger]} FINGER</div>
          </motion.div>

          <div className="flex gap-1 justify-center mt-6 mb-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${fingersDone[i] ? 'bg-[#0F6E5E]' : 'bg-[#333333]'}`} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="text-6xl mb-4 text-[#0F6E5E]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 100 }}>
            ✓
          </motion.div>

          <div className="text-2xl font-mono text-[#f0f0f0] mt-4 mb-2">Calibration Complete</div>
          <div className="text-xs font-mono text-[#888888] mb-8">Your RehabGrip is ready.</div>

          <div className="max-w-sm w-full bg-[#161616] rounded-xl p-6 border border-[#1f1f1f] mb-8">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#555555] mb-4">CALIBRATION RESULTS</div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#f0f0f0]">SENSOR QUALITY</span>
                <span className="text-[#2ea853]">EXCELLENT</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] py-2">
                <span className="text-[#f0f0f0]">FULL ROM RANGE</span>
                <span className="text-[#0F6E5E]">
                  {romRange.min}°–{romRange.max.toFixed(0)}°
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] py-2">
                <span className="text-[#f0f0f0]">BASELINE NOISE</span>
                <span className="text-[#2ea853]">NORMAL</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#f0f0f0]">READY TO START</span>
                <span className="text-[#2ea853]">YES ✓</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={() => router.push('/session')}
              className="w-full py-4 bg-[#0F6E5E] text-[#f0f0f0] font-mono text-base rounded-xl hover:bg-[#1a8a78] transition-colors uppercase tracking-widest"
            >
              START SESSION
            </button>
            <button
              onClick={handleRecalibrate}
              className="w-full py-2 text-[#555555] font-mono text-[11px] hover:text-[#888888] transition-colors"
            >
              Recalibrate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

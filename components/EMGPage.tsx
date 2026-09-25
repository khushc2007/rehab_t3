'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useHand, sensorRef } from '@/store/handStore'
import { avg, downloadCSV } from '@/lib/utils'

const HandScene = dynamic(() => import('@/components/hand/HandScene'), { ssr: false })

interface CircularBuffer {
  flex: number[]
  emg: number[]
  time: number
}

export default function EMGPage() {
  const simMode = useHand(s => s.simMode)
  const connected = useHand(s => s.connected)
  const [isPaused, setIsPaused] = useState(false)
  const bufferRef = useRef<CircularBuffer>({ flex: Array(600).fill(0), emg: Array(600).fill(0), time: 0 })
  const [buffer, setBuffer] = useState({ flex: Array(600).fill(0), emg: Array(600).fill(0) })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Compute metrics
  const flexAvg = avg(buffer.flex.filter(v => v > 0)) || 0
  const emgRMS = Math.sqrt(avg(buffer.emg.slice(-20).map(v => v * v))) * 0.85
  const correlation = computeCorrelation(buffer.flex.slice(-60), buffer.emg.slice(-60))
  const lag = computeLag(buffer.flex.slice(-60), buffer.emg.slice(-60))

  useEffect(() => {
    if (isPaused) return

    intervalRef.current = setInterval(() => {
      const currentBuffer = bufferRef.current
      const flexValue = avg(sensorRef.current.f.slice(0, 4))
      const emgValue = sensorRef.current.e + (simMode ? Math.sin(Date.now() / 180) * 3 + Math.random() * 4 : 0)

      // Shift arrays left and append new value
      currentBuffer.flex = [...currentBuffer.flex.slice(1), flexValue]
      currentBuffer.emg = [...currentBuffer.emg.slice(1), Math.max(0, Math.min(100, emgValue))]

      setBuffer({ flex: currentBuffer.flex, emg: currentBuffer.emg })
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, simMode])

  const handleExportCSV = () => {
    const rows = [
      ['Time (ms)', 'Flex (°)', 'EMG (%)'],
      ...buffer.flex.map((f, i) => [String(i * 50), f.toFixed(1), buffer.emg[i].toFixed(1)]),
    ]
    downloadCSV('emg_session.csv', rows.map(r => r.map(String)))
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top Panel - Hand Simulation (40%) */}
      <div className="flex-[2] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <HandScene />
        </div>
        <div className="absolute top-0 left-0 right-0 h-7 bg-[#111111] border-b border-[#1f1f1f] flex items-center px-5 gap-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#555555]">EMG SYNC VIEW</span>
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[#2ea853]' : 'bg-[#d9534f]'}`} />
            <span className="text-[9px] font-mono text-[#888888]">{connected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Middle Panel - Waveform (40%) */}
      <div className="flex-[2] bg-[#0d0d0d] border-y border-[#1f1f1f] flex flex-col">
        {/* Header */}
        <div className="h-7 bg-[#111111] border-b border-[#1f1f1f] flex items-center px-5 gap-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#555555]">WAVEFORM ANALYSIS</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[9px] font-mono text-[#555555]">
              <span className="inline-block w-2 h-0.5 bg-[#0F6E5E] mr-2" />
              FLEX
              <span className="inline-block w-2 h-0.5 bg-[#1a5fb4] ml-4 mr-2" />
              EMG
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-[9px] font-mono px-3 py-0.5 border border-[#2a2a2a] text-[#555555] hover:border-[#0F6E5E] hover:text-[#0F6E5E] rounded transition-colors"
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button
              onClick={handleExportCSV}
              className="text-[9px] font-mono px-3 py-0.5 border border-[#2a2a2a] text-[#555555] hover:border-[#0F6E5E] hover:text-[#0F6E5E] rounded transition-colors"
            >
              CSV
            </button>
          </div>
        </div>

        {/* Waveform Chart */}
        <div className="flex-1 relative overflow-hidden">
          <svg viewBox="0 0 600 160" className="w-full h-full" preserveAspectRatio="none">
            {/* Background */}
            <rect width="600" height="160" fill="#0a0a0a" />

            {/* Grid */}
            {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => (
              <line key={`vgrid-${x}`} x1={x} y1="0" x2={x} y2="160" stroke="#1f1f1f" strokeWidth="0.5" />
            ))}
            {[40, 80, 120].map(y => (
              <line key={`hgrid-${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#1a1a1a" strokeWidth="0.5" />
            ))}

            {/* Y-axis labels */}
            <text x="4" y="15" fontSize="8" fontFamily="monospace" fill="#333333">
              100%
            </text>
            <text x="4" y="55" fontSize="8" fontFamily="monospace" fill="#333333">
              75%
            </text>
            <text x="4" y="95" fontSize="8" fontFamily="monospace" fill="#333333">
              50%
            </text>
            <text x="4" y="135" fontSize="8" fontFamily="monospace" fill="#333333">
              25%
            </text>

            {/* Time labels */}
            <text x="10" y="155" fontSize="8" fontFamily="monospace" fill="#333333">
              -9s
            </text>
            <text x="145" y="155" fontSize="8" fontFamily="monospace" fill="#333333">
              -6s
            </text>
            <text x="280" y="155" fontSize="8" fontFamily="monospace" fill="#333333">
              -3s
            </text>
            <text x="560" y="155" fontSize="8" fontFamily="monospace" fill="#333333">
              now
            </text>

            {/* FLEX trace */}
            <polyline
              points={buffer.flex.map((v, i) => `${i},${160 - (v / 90) * 150}`).join(' ')}
              fill="none"
              stroke="#0F6E5E"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* EMG trace */}
            <polyline
              points={buffer.emg.map((v, i) => `${i},${160 - (v / 100) * 150}`).join(' ')}
              fill="none"
              stroke="#1a5fb4"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* NOW marker */}
            <line x1="598" y1="0" x2="598" y2="160" stroke="#333333" strokeWidth="1" />
          </svg>

          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <span className="text-[9px] font-mono text-[#555555]">PAUSED</span>
            </div>
          )}
        </div>

        {/* Sync Indicator */}
        <div className="h-6 bg-[#0d0d0d] border-t border-[#1a1a1a] flex items-center px-5 gap-4">
          <span className="text-[9px] font-mono text-[#555555]">
            FLEX–EMG SYNC:{' '}
            <span
              className={`font-bold ${
                correlation > 0.85 ? 'text-[#2ea853]' : correlation > 0.7 ? 'text-[#f5a623]' : 'text-[#d9534f]'
              }`}
            >
              {Math.round(Math.max(0, correlation) * 100)}%
            </span>
          </span>
          <span className="text-[9px] font-mono text-[#555555] ml-auto">LAG: ~{Math.round(lag)}ms</span>
        </div>
      </div>

      {/* Bottom Panel - Metrics (20%) */}
      <div className="flex-1 bg-[#111111] border-t border-[#1f1f1f] flex gap-4 p-4">
        {/* Card 1 - Flex Sensor */}
        <div className="flex-1 bg-[#0d0d0d] rounded-lg border border-[#1f1f1f] p-4">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#555555] mb-3">Flex Sensor</div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">INDEX ROM</span>
              <span className="text-[#f0f0f0]">{flexAvg.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">VELOCITY</span>
              <span className="text-[#f0f0f0]">{(flexAvg * 0.3).toFixed(1)}°/sec</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">PEAK REP</span>
              <span className="text-[#f0f0f0]">{Math.max(...buffer.flex).toFixed(1)}°</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">STATUS</span>
              <span className="text-[#0F6E5E]">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Card 2 - EMG */}
        <div className="flex-1 bg-[#0d0d0d] rounded-lg border border-[#1f1f1f] p-4">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#555555] mb-3">EMG Signal</div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">RMS</span>
              <span className="text-[#f0f0f0]">{emgRMS.toFixed(2)} µV</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">SNR</span>
              <span className="text-[#f0f0f0]">{(18 + Math.random() * 2).toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">ARTIFACT</span>
              <span className="text-[#0F6E5E]">NONE</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">ENVELOPE</span>
              <span className="text-[#f0f0f0]">{Math.round(avg(buffer.emg))}%</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Sync */}
        <div className="flex-1 bg-[#0d0d0d] rounded-lg border border-[#1f1f1f] p-4">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#555555] mb-3">Flex–EMG Sync</div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">CORR</span>
              <span className="text-[#f0f0f0]">{correlation.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">LAG</span>
              <span className="text-[#f0f0f0]">{Math.round(lag)}ms</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">WINDOW</span>
              <span className="text-[#f0f0f0]">10s rolling</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#444444]">STATUS</span>
              <span className={correlation > 0.85 ? 'text-[#0F6E5E]' : 'text-[#f5a623]'}>✓ SYNC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function computeCorrelation(flex: number[], emg: number[]): number {
  if (flex.length === 0 || emg.length === 0) return 0
  const flexAvg = avg(flex)
  const emgAvg = avg(emg)
  const num = flex.reduce((sum, f, i) => sum + (f - flexAvg) * (emg[i] - emgAvg), 0)
  const denom = Math.sqrt(
    flex.reduce((sum, f) => sum + Math.pow(f - flexAvg, 2), 0) * emg.reduce((sum, e) => sum + Math.pow(e - emgAvg, 2), 0)
  )
  return denom === 0 ? 0 : Math.max(0, Math.min(1, num / denom))
}

function computeLag(flex: number[], emg: number[]): number {
  if (flex.length < 10) return 0
  let maxCorr = 0
  let bestLag = 0
  for (let lag = -5; lag <= 5; lag++) {
    let corr = 0
    let count = 0
    for (let i = 0; i < flex.length; i++) {
      const emgIdx = i + lag
      if (emgIdx >= 0 && emgIdx < emg.length) {
        corr += flex[i] * emg[emgIdx]
        count++
      }
    }
    corr /= count
    if (corr > maxCorr) {
      maxCorr = corr
      bestLag = lag
    }
  }
  return bestLag * 50 // 50ms per sample
}

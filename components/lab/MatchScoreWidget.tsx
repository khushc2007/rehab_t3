'use client'
import { SimFrame } from '@/types/lab.types'

// Compares the last few frames of the simulated condition pattern (a) against the
// reference/patient stream (b) across finger ROM, EMG and wrist pitch, and returns 0-100.
export function computeMatch(a: SimFrame[], b: SimFrame[]): number {
  if (!a.length || !b.length) return 0
  const n = Math.min(30, a.length, b.length)
  const fa = a.slice(-n), fb = b.slice(-n)
  let fingerDist = 0, emgDiff = 0, pitchDiff = 0
  for (let i = 0; i < n; i++) {
    const A = fa[i], B = fb[i]
    const simNorm = [...A.fingers, A.thumb].map(v => v / 90)
    const refNorm = [...B.fingers, B.thumb].map(v => v / 90)
    fingerDist += Math.sqrt(simNorm.reduce((s, v, j) => s + (v - refNorm[j]) ** 2, 0)) / Math.sqrt(5)
    emgDiff += Math.abs(A.emg / 100 - B.emg / 100)
    pitchDiff += Math.abs(A.wristPitch - B.wristPitch) / 90
  }
  fingerDist /= n; emgDiff /= n; pitchDiff /= n
  const match = 1 - (fingerDist * 0.55 + emgDiff * 0.25 + pitchDiff * 0.2)
  return Math.max(0, Math.min(1, match)) * 100
}

export default function MatchScoreWidget({ score, color }: { score: number; color: string }) {
  const r = 50, c = 2 * Math.PI * r
  const tier = score >= 80 ? color : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-sm rounded-full p-4 flex flex-col items-center justify-center" style={{ width: 120, height: 120 }}>
      <svg viewBox="0 0 120 120" width="120" height="120" className="absolute">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#374151" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={tier} strokeWidth="8" strokeDasharray={`${(score / 100) * c} ${c}`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 400ms ease-out' }} />
      </svg>
      <div className="font-mono text-[20pt] text-white relative">{score.toFixed(0)}%</div>
      <div className="text-[9pt] uppercase tracking-wide relative" style={{ color: tier }}>Match</div>
    </div>
  )
}

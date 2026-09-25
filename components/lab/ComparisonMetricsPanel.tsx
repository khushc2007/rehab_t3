'use client'
import { ConditionProfile, SimFrame } from '@/types/lab.types'

const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1)
const peak95 = (frames: SimFrame[]) => {
  if (!frames.length) return 0
  const vals = frames.map(f => avg(f.fingers)).sort((a, b) => a - b)
  return vals[Math.floor(vals.length * 0.95)] ?? 0
}
const smoothLabel = (s: number) => (s > 0.65 ? 'High' : s > 0.4 ? 'Moderate' : 'Low')
const smoothScore = (s: number) => (s > 0.65 ? 90 : s > 0.4 ? 60 : 30)

function pctMatch(a: number, b: number, span: number) {
  const dev = Math.min(1, Math.abs(a - b) / span)
  return Math.round((1 - dev) * 100)
}

const barColor = (p: number) => (p >= 80 ? '#0F6E5E' : p >= 60 ? '#f59e0b' : '#ef4444')

const Bar = ({ pct }: { pct: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor(pct) }} />
    </div>
    <span className="font-mono text-[10px] w-9 text-right" style={{ color: barColor(pct) }}>{pct}%</span>
  </div>
)

export default function ComparisonMetricsPanel({ condA, condB, a, b, labelB }: { condA: ConditionProfile; condB: ConditionProfile; a: SimFrame[]; b: SimFrame[]; labelB: string }) {
  const romA = peak95(a), romB = peak95(b)
  const speedA = 1.1 / condA.speedScale, speedB = 1.1 / condB.speedScale
  const emgA = avg(a.slice(-10).map(f => f.emg)), emgB = avg(b.slice(-10).map(f => f.emg))
  const rows = [
    { l: 'ROM', va: `${romA.toFixed(0)}°`, vb: `${romB.toFixed(0)}°`, pct: a.length && b.length ? pctMatch(romA, romB, 82) : 0 },
    { l: 'Speed', va: `${speedA.toFixed(1)}s`, vb: `${speedB.toFixed(1)}s`, pct: a.length && b.length ? pctMatch(speedA, speedB, 2) : 0 },
    { l: 'Tremor', va: `${condA.tremorAmplitude}° @ ${condA.tremorFrequency}Hz`, vb: `${condB.tremorAmplitude}° @ ${condB.tremorFrequency}Hz`, pct: a.length && b.length ? pctMatch(condA.tremorAmplitude, condB.tremorAmplitude, 10) : 0 },
    { l: 'EMG', va: `${emgA.toFixed(0)}%`, vb: `${emgB.toFixed(0)}%`, pct: a.length && b.length ? pctMatch(emgA, emgB, 100) : 0 },
    { l: 'Smoothness', va: smoothLabel(condA.smoothnessScale), vb: smoothLabel(condB.smoothnessScale), pct: a.length && b.length ? pctMatch(smoothScore(condA.smoothnessScale), smoothScore(condB.smoothnessScale), 100) : 0 },
  ]
  const has = a.length > 0 && b.length > 0
  return (
    <div className="bg-white dark:bg-[#161616] rounded-2xl p-5 border border-gray-100 dark:border-[#1f1f1f] shadow-sm dark:shadow-none">
      <div className="grid grid-cols-[110px_1fr_130px] gap-x-4 text-[9pt] uppercase tracking-wide text-gray-400 dark:text-[#555] pb-2 border-b border-gray-100 dark:border-[#1a1a1a]">
        <span>{condA.label}</span><span className="text-center">Deviation</span><span className="text-right">{labelB}</span>
      </div>
      {rows.map(r => (
        <div key={r.l} className="grid grid-cols-[110px_1fr_130px] gap-x-4 items-center py-2.5 border-b border-gray-50 dark:border-[#1a1a1a] last:border-0">
          <div><span className="text-[11px] text-gray-500 dark:text-[#888]">{r.l}</span><div className="font-mono text-[12px] text-gray-900 dark:text-[#f0f0f0]">{has ? r.va : '—'}</div></div>
          <Bar pct={has ? r.pct : 0} />
          <div className="text-right font-mono text-[12px] text-gray-900 dark:text-[#f0f0f0]">{has ? r.vb : '—'}</div>
        </div>
      ))}
      {!has && <div className="text-center text-[10px] text-gray-400 dark:text-[#555] pt-3">Run the simulation to populate comparison metrics.</div>}
    </div>
  )
}

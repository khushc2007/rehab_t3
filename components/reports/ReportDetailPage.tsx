'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ALL_SESSIONS_EXTENDED, FINGER_BREAKDOWN } from '@/lib/mockData'
import { downloadCSV } from '@/lib/utils'
import { buildReps, buildEmgWave, buildRawRows, RepDetail } from '@/lib/reportData'

const card = 'bg-white dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f]'
const label = 'text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]'
const TABS = ['Overview', 'Detailed Analytics', 'EMG Analysis', 'Comparison', 'Raw Data'] as const
type Tab = typeof TABS[number]
const qColor: Record<RepDetail['quality'], string> = { correct: '#0F6E5E', partial: '#f59e0b', missed: '#ef4444' }

export default function ReportDetailPage({ index }: { index: number }) {
  const [tab, setTab] = useState<Tab>('Overview')
  const [selectedRep, setSelectedRep] = useState<number | null>(null)
  const session = ALL_SESSIONS_EXTENDED[index]
  const prev = ALL_SESSIONS_EXTENDED[index - 1]
  const baseline = ALL_SESSIONS_EXTENDED[0]

  const reps = useMemo(() => session ? buildReps(index, session.reps, session.rom, session.consistency) : [], [index, session])
  const emgWave = useMemo(() => buildEmgWave(index, reps), [index, reps])
  const rawRows = useMemo(() => buildRawRows(index, reps), [index, reps])

  if (!session) return (
    <div className="px-8 py-6"><div className="text-[14px] text-[#111827] dark:text-[#f0f0f0]">Report not found</div><Link href="/reports" className="text-[12px] text-[#0F6E5E] mt-2 inline-block">← Back to reports</Link></div>
  )

  const exportCSV = () => downloadCSV(`session_${session.date}_raw.csv`, [
    ['t_ms', 'index', 'middle', 'ring', 'pinky', 'thumb', 'wristPitch', 'emg'],
    ...rawRows.map(r => [String(r.t), String(r.index), String(r.middle), String(r.ring), String(r.pinky), String(r.thumb), String(r.wristPitch), String(r.emg)]),
  ])
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ session, reps, rawRows }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `session_${session.date}_research.json`; a.click()
  }

  const avgTime = (arr: RepDetail[]) => arr.length ? (arr.reduce((s, r) => s + r.time, 0) / arr.length).toFixed(2) : '0'
  const maxEmg = Math.max(1, ...reps.map(r => r.emgPeak))

  return (
    <div className="px-8 py-6 max-w-[1200px] print-card">
      <div className="flex items-start justify-between gap-4 no-print">
        <div>
          <div className="text-[11px] text-[#9ca3af] dark:text-[#555]"><Link href="/reports" className="hover:text-[#0F6E5E]">Reports</Link> {'>'} {session.date}</div>
          <div className="text-[20px] font-bold text-[#111827] dark:text-[#f0f0f0] mt-1">Session Report — {session.date}</div>
          <div className="text-[12px] text-[#6b7280] dark:text-[#888]">{session.time} · {session.exercise} · {session.duration}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="text-[11px] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#374151] dark:text-[#888] hover:border-[#0F6E5E] hover:text-[#0F6E5E]">Print / PDF</button>
        </div>
      </div>

      <div className="hidden print:block text-[10px] text-gray-500 mb-4">RehabGrip Clinical Report — {session.date} — Confidential</div>

      <div className="flex gap-1 mt-5 border-b border-[#e5e7eb] dark:border-[#1f1f1f] no-print">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2.5 text-[12px] font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#0F6E5E] text-[#0F6E5E]' : 'border-transparent text-gray-400 dark:text-[#666] hover:text-gray-600'}`}>{t}</button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 print:block">
        {tab === 'Overview' && <>
          <div className="grid grid-cols-4 gap-4">
            {[['Reps', `${session.reps}/10`], ['ROM', `${session.rom}°`], ['Consistency', `${session.consistency}%`], ['Duration', session.duration]].map(([l, v]) => (
              <div key={l} className={`${card} p-4`}><div className={label}>{l}</div><div className="text-[18px] font-mono font-semibold text-[#0F6E5E] mt-1">{v}</div></div>
            ))}
          </div>
          <div className={`${card} p-5`}>
            <div className={`${label} mb-2`}>Finger Breakdown</div>
            <table className="w-full text-[12px]">
              <thead><tr className="text-left text-[#9ca3af] dark:text-[#555]"><th className="pb-2 font-normal">Finger</th><th className="pb-2 font-normal">Reps</th><th className="pb-2 font-normal">ROM</th><th className="pb-2 font-normal">Consistency</th></tr></thead>
              <tbody>{FINGER_BREAKDOWN.map(f => (
                <tr key={f.name} className="border-t border-[#f3f4f6] dark:border-[#1a1a1a]"><td className="py-2 text-[#111827] dark:text-[#f0f0f0]">{f.name}</td><td className="py-2 font-mono">{f.reps}</td><td className="py-2 font-mono text-[#0F6E5E]">{f.rom}°</td><td className="py-2 font-mono text-[#0F6E5E]">{f.consistency}%</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className={`${card} p-5`}><div className={`${label} mb-1`}>Session notes</div><p className="text-[12px] text-gray-600 dark:text-[#999]">{session.notes}</p></div>
        </>}

        {tab === 'Detailed Analytics' && <>
          <div className={`${card} p-5`}>
            <div className={`${label} mb-3`}>Rep quality timeline</div>
            <div className="flex gap-1.5 flex-wrap">{reps.map(r => (
              <div key={r.n} className="group relative">
                <button onClick={() => setSelectedRep(r.n)} className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110" style={{ background: qColor[r.quality] + '30', borderColor: qColor[r.quality] }} />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">Rep {r.n}: {r.rom}° · {r.time}s · {r.quality}</div>
              </div>
            ))}</div>
          </div>
          <div className={`${card} p-5 overflow-x-auto`}>
            <div className={`${label} mb-2`}>Per-rep breakdown</div>
            <table className="w-full text-[11px] min-w-[560px]">
              <thead><tr className="text-left text-[#9ca3af] dark:text-[#555]"><th className="pb-2 font-normal">Rep</th><th className="pb-2 font-normal">ROM</th><th className="pb-2 font-normal">Time</th><th className="pb-2 font-normal">EMG Peak</th><th className="pb-2 font-normal">Consistency</th><th className="pb-2 font-normal">Wrist Comp</th><th className="pb-2 font-normal">Quality</th></tr></thead>
              <tbody>{reps.map(r => (
                <tr key={r.n} onClick={() => setSelectedRep(r.n)} className={`border-t border-[#f3f4f6] dark:border-[#1a1a1a] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50 ${selectedRep === r.n ? 'bg-teal-50/50 dark:bg-[#0F6E5E]/10' : ''}`}>
                  <td className="py-1.5 font-mono">{r.n}</td><td className="py-1.5 font-mono text-[#0F6E5E]">{r.rom}°</td><td className="py-1.5 font-mono">{r.time}s</td><td className="py-1.5 font-mono">{r.emgPeak}%</td><td className="py-1.5 font-mono">{r.consistency}%</td><td className="py-1.5 font-mono">{r.wristComp}°</td>
                  <td className="py-1.5"><span className="rounded-full px-2 py-0.5 text-[9px]" style={{ background: qColor[r.quality] + '20', color: qColor[r.quality] }}>{r.quality}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`${card} p-5`}>
              <div className={`${label} mb-2`}>Movement speed per rep</div>
              <svg viewBox="0 0 300 100" className="w-full h-[90px]">
                {reps.map((r, i) => <rect key={r.n} x={i * (280 / reps.length) + 10} y={100 - r.time * 40} width={Math.max(4, 280 / reps.length - 3)} height={r.time * 40} fill="#0F6E5E" opacity={0.8} />)}
              </svg>
              <div className="text-[9px] text-gray-400 mt-1">Rising bars indicate fatigue across the session (avg {avgTime(reps)}s/rep)</div>
            </div>
            <div className={`${card} p-5`}>
              <div className={`${label} mb-2`}>ROM per rep</div>
              <svg viewBox="0 0 300 100" className="w-full h-[90px]">
                <polyline fill="none" stroke="#0F6E5E" strokeWidth="1.5" points={reps.map((r, i) => `${i * (280 / Math.max(1, reps.length - 1)) + 10},${100 - (r.rom / 90) * 90}`).join(' ')} />
                {reps.map((r, i) => <circle key={r.n} cx={i * (280 / Math.max(1, reps.length - 1)) + 10} cy={100 - (r.rom / 90) * 90} r="2.5" fill="#0F6E5E" />)}
              </svg>
            </div>
          </div>
        </>}

        {tab === 'EMG Analysis' && <>
          <div className={`${card} p-5`}>
            <div className={`${label} mb-2`}>Full-session EMG waveform</div>
            <svg viewBox="0 0 800 120" className="w-full h-[110px]">
              <polyline fill="none" stroke="#0F6E5E" strokeWidth="1.2" points={emgWave.map((s, i) => `${(i / Math.max(1, emgWave.length - 1)) * 800},${110 - (s.emg / 100) * 100}`).join(' ')} />
              {reps.map((r, i) => {
                const frac = reps.slice(0, i + 1).reduce((s, x) => s + x.time, 0) / reps.reduce((s, x) => s + x.time, 1)
                return <line key={r.n} x1={frac * 800} y1="0" x2={frac * 800} y2="120" stroke="#666" strokeDasharray="2,2" opacity={0.4} />
              })}
            </svg>
            <div className="text-[9px] text-gray-400 mt-1">Vertical lines mark rep boundaries</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['Effort/Output ratio', `${(reps.reduce((s, r) => s + r.emgPeak / Math.max(1, r.rom), 0) / Math.max(1, reps.length)).toFixed(2)}`],
              ['Signal-to-noise', `${(18 + session.consistency / 10).toFixed(1)} dB`],
              ['Electrode placement', session.consistency > 80 ? 'Good' : session.consistency > 60 ? 'Fair' : 'Check placement']].map(([l, v]) => (
              <div key={l} className={`${card} p-4`}><div className={label}>{l}</div><div className="text-[14px] font-mono text-[#111827] dark:text-[#f0f0f0] mt-1">{v}</div></div>
            ))}
          </div>
        </>}

        {tab === 'Comparison' && <>
          <div className="grid grid-cols-4 gap-4">
            {[['This Session', session], ['Previous Session', prev], ['Program Baseline', baseline], ['Reference Cohort', { rom: 82, consistency: 88, reps: 10 } as any]].map(([l, s]: any) => (
              <div key={l} className={`${card} p-4`}>
                <div className={label}>{l}</div>
                {s ? <>
                  <div className="text-[16px] font-mono font-semibold text-[#0F6E5E] mt-1">{s.rom}°</div>
                  <div className="text-[10px] text-gray-500 dark:text-[#888] mt-1">{s.consistency}% consistency · {s.reps}/10 reps</div>
                  {l !== 'This Session' && <div className="text-[10px] mt-1" style={{ color: session.rom >= s.rom ? '#0F6E5E' : '#ef4444' }}>{session.rom >= s.rom ? '↑' : '↓'} {Math.abs(session.rom - s.rom)}° vs this session</div>}
                </> : <div className="text-[12px] text-gray-400 mt-1">—</div>}
              </div>
            ))}
          </div>
          <div className={`${card} p-5`}>
            <div className={`${label} mb-3`}>ROM comparison</div>
            {[['This Session', session.rom, '#0F6E5E'], ['Previous Session', prev?.rom ?? 0, '#0ea5e9'], ['Program Baseline', baseline?.rom ?? 0, '#9ca3af'], ['Reference Cohort', 82, '#f59e0b']].map(([l, v, c]: any) => (
              <div key={l} className="flex items-center gap-3 mb-2">
                <span className="w-32 text-[11px] text-gray-500 dark:text-[#888] shrink-0">{l}</span>
                <div className="flex-1 h-3 bg-gray-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(v / 90) * 100}%`, background: c }} /></div>
                <span className="w-10 text-right font-mono text-[11px]">{v}°</span>
              </div>
            ))}
          </div>
        </>}

        {tab === 'Raw Data' && <>
          <div className="flex justify-end gap-2 no-print">
            <button onClick={exportCSV} className="text-[11px] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#374151] dark:text-[#888] hover:border-[#0F6E5E] hover:text-[#0F6E5E]">Export CSV</button>
            <button onClick={exportJSON} className="text-[11px] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#374151] dark:text-[#888] hover:border-[#0F6E5E] hover:text-[#0F6E5E]">Export for Research</button>
          </div>
          <div className={`${card} overflow-auto max-h-[420px]`}>
            <table className="w-full text-[11px] font-mono">
              <thead className="sticky top-0 bg-white dark:bg-[#161616]"><tr className="text-left text-[#9ca3af] dark:text-[#555] border-b border-[#f3f4f6] dark:border-[#1a1a1a]">
                <th className="py-2 px-3 font-normal">Time (ms)</th><th className="font-normal">Index°</th><th className="font-normal">Middle°</th><th className="font-normal">Ring°</th><th className="font-normal">Pinky°</th><th className="font-normal">Thumb°</th><th className="font-normal">Wrist°</th><th className="font-normal">EMG%</th>
              </tr></thead>
              <tbody>{rawRows.slice(0, 300).map((r, i) => (
                <tr key={i} className="border-b border-[#f3f4f6] dark:border-[#1a1a1a] last:border-0">
                  <td className="py-1 px-3">{r.t}</td><td>{r.index}</td><td>{r.middle}</td><td>{r.ring}</td><td>{r.pinky}</td><td>{r.thumb}</td><td>{r.wristPitch}</td><td>{r.emg}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="text-[9px] text-gray-400">{rawRows.length} samples total (showing first 300) · sampled to 5Hz for display</div>
        </>}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ALL_SESSIONS_EXTENDED } from '@/lib/mockData'
import { downloadCSV } from '@/lib/utils'
const card = 'bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f]'
const label = 'text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]'
export default function ReportsPage() {
  const [q, setQ] = useState('')
  const indexed = ALL_SESSIONS_EXTENDED.map((r, i) => ({ ...r, _i: i }))
  const rows = indexed.filter(r => r.date.toLowerCase().includes(q.toLowerCase()) || r.exercise.toLowerCase().includes(q.toLowerCase())).slice().reverse()
  const exportAll = () => downloadCSV('rehabgrip_reports.csv', [
    ['Date', 'Time', 'Exercise', 'Reps', 'ROM', 'Consistency', 'Duration', 'Notes'],
    ...rows.map(r => [r.date, r.time, r.exercise, String(r.reps), String(r.rom), String(r.consistency), r.duration, r.notes]),
  ])
  return (
    <div className="px-8 py-6 max-w-[1100px]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[20px] font-bold text-[#111827] dark:text-[#f0f0f0]">Reports</div>
          <div className="text-[12px] text-[#6b7280] dark:text-[#888] mt-1">Session reports available to export or review</div>
        </div>
        <button onClick={exportAll} className="text-[11px] font-mono border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#374151] dark:text-[#888] hover:border-[#0F6E5E] hover:text-[#0F6E5E]">Export all as CSV</button>
      </div>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by date or exercise…"
        className="mt-5 w-full max-w-sm bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[12px] text-[#111827] dark:text-[#f0f0f0] placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none focus:border-[#0F6E5E]" />
      <div className={`${card} mt-5 overflow-hidden`}>
        <table className="w-full text-[12px]">
          <thead><tr className={`text-left border-b border-[#f3f4f6] dark:border-[#1a1a1a] ${label}`}>
            <th className="py-3 px-4 font-mono">Date</th><th className="font-mono">Time</th><th className="font-mono">Exercise</th><th className="font-mono">Reps</th><th className="font-mono">ROM</th><th className="font-mono">Consistency</th><th className="font-mono">Duration</th><th className="font-mono">Notes</th><th></th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.date + r.time} className="border-b border-[#f3f4f6] dark:border-[#1a1a1a] last:border-0 hover:bg-[#f8fafc] dark:hover:bg-[#1a1a1a]/50">
                <td className="py-3 px-4 text-[#111827] dark:text-[#f0f0f0] font-medium">{r.date}</td>
                <td className="text-[#6b7280] dark:text-[#888]">{r.time}</td>
                <td className="text-[#6b7280] dark:text-[#888]">{r.exercise}</td>
                <td className="font-mono text-[#0F6E5E]">{r.reps}/10</td>
                <td className="font-mono text-[#0F6E5E]">{r.rom}°</td>
                <td className="font-mono text-[#0F6E5E]">{r.consistency}%</td>
                <td className="font-mono text-[#6b7280] dark:text-[#888]">{r.duration}</td>
                <td className="text-[#9ca3af] dark:text-[#555]">{r.notes}</td>
                <td><Link href={`/reports/${r._i}`} className="text-[#0F6E5E] text-[11px] px-4">View →</Link></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={9} className="py-8 text-center text-[#9ca3af] dark:text-[#555]">No reports match "{q}"</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

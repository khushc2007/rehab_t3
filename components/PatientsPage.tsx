'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PATIENTS, SESSIONS } from '@/lib/mockData'
const card = 'bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f]'
const label = 'text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]'
export default function PatientsPage() {
  const [sel, setSel] = useState(PATIENTS[0])
  return (
    <div className="px-8 py-6 max-w-[1100px]">
      <div className="text-[20px] font-bold text-[#111827] dark:text-[#f0f0f0]">Patients</div>
      <div className="text-[12px] text-[#6b7280] dark:text-[#888] mt-1">Roster and rehabilitation progress</div>
      <div className="mt-6 flex gap-6">
        <div className="w-[300px] shrink-0 flex flex-col gap-3">
          {PATIENTS.map(p => (
            <button key={p.id} onClick={() => setSel(p)} className={`${card} p-4 text-left transition ${sel.id === p.id ? 'border-[#0F6E5E]' : 'hover:border-[#0F6E5E]/40'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F6E5E]/15 text-[#0F6E5E] flex items-center justify-center font-mono text-[12px] font-bold">
                  {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#111827] dark:text-[#f0f0f0]">{p.name}</div>
                  <div className="text-[10px] text-[#6b7280] dark:text-[#666]">ID {p.id} · {p.age} yrs</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className={`${card} p-6`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0F6E5E]/15 text-[#0F6E5E] flex items-center justify-center font-mono text-[16px] font-bold">
                {sel.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#111827] dark:text-[#f0f0f0]">{sel.name}</div>
                <div className="text-[12px] text-[#6b7280] dark:text-[#888]">Patient ID {sel.id} · {sel.age} yrs · {sel.hand} hand</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#f3f4f6] dark:border-[#1a1a1a]">
              <div><div className={label}>Diagnosis</div><div className="text-[13px] text-[#111827] dark:text-[#f0f0f0] mt-1">{sel.diagnosis}</div></div>
              <div><div className={label}>Weeks in program</div><div className="text-[13px] font-mono text-[#111827] dark:text-[#f0f0f0] mt-1">{sel.weeks}</div></div>
              <div><div className={label}>Status</div><div className="text-[13px] text-[#0F6E5E] font-medium mt-1">Active</div></div>
            </div>
          </div>
          <div className={`${card} p-6`}>
            <div className={label}>Recent Sessions</div>
            <table className="w-full mt-3 text-[12px]">
              <thead><tr className="text-left text-[#9ca3af] dark:text-[#555]"><th className="pb-2 font-normal">Date</th><th className="pb-2 font-normal">ROM</th><th className="pb-2 font-normal">Consistency</th><th className="pb-2 font-normal">Reps</th><th className="pb-2 font-normal"></th></tr></thead>
              <tbody>
                {SESSIONS.slice().reverse().map(s => (
                  <tr key={s.date} className="border-t border-[#f3f4f6] dark:border-[#1a1a1a]">
                    <td className="py-2 text-[#111827] dark:text-[#f0f0f0]">{s.date}</td>
                    <td className="py-2 font-mono text-[#0F6E5E]">{s.rom}°</td>
                    <td className="py-2 font-mono text-[#0F6E5E]">{s.consistency}%</td>
                    <td className="py-2 font-mono text-[#111827] dark:text-[#f0f0f0]">{s.reps}/10</td>
                    <td className="py-2"><Link href="/history" className="text-[#0F6E5E] text-[11px]">View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#9ca3af] dark:text-[#444] mt-4">Session list is shared demo data, not yet linked per-patient.</div>
    </div>
  )
}

'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { INDIAN_PATIENTS, CITIES, HOSPITALS, IndianPatient } from '@/lib/indianPatients'
import { formatDate } from '@/lib/formatters'

const card = 'bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f]'
const label = 'text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]'
const select = 'bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-2.5 py-2 text-[11px] text-[#374151] dark:text-[#ccc] outline-none focus:border-[#0F6E5E]'

const statusStyle: Record<IndianPatient['status'], string> = {
  Active: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Completed: 'bg-gray-100 text-gray-600 dark:bg-[#222] dark:text-[#888]',
  'On Hold': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
}

const Avatar = ({ p, size }: { p: IndianPatient; size: number }) => (
  <div className="rounded-full shrink-0 flex items-center justify-center font-bold" style={{ width: size, height: size, background: p.avatar.bg + '26', color: p.avatar.bg, fontSize: size * 0.32 }}>
    {p.avatar.initials}
  </div>
)

function PatientCard({ p, onClick }: { p: IndianPatient; onClick: () => void }) {
  const pct = Math.min(100, Math.round((p.sessionsCompleted / p.sessionsTarget) * 100))
  return (
    <button onClick={onClick} className={`${card} p-5 text-left transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 hover:border-[#0F6E5E]/40`}>
      <div className="flex items-center gap-3">
        <Avatar p={p} size={48} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-[#111827] dark:text-[#f0f0f0] truncate">{p.name}</div>
          <div className="text-[9px] font-mono text-[#9ca3af] dark:text-[#555]">{p.uhid}</div>
          <div className="text-[10px] text-[#6b7280] dark:text-[#888]">{p.city}, {p.state}</div>
        </div>
        <span className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[9px] font-medium ${statusStyle[p.status]}`}>{p.status}</span>
      </div>
      <div className="my-3 border-t border-[#f3f4f6] dark:border-[#1a1a1a]" />
      <div className="flex items-center gap-2">
        <span className="bg-teal-50 dark:bg-[#0F6E5E]/15 text-[#0F6E5E] rounded-lg px-2.5 py-1 text-[10px] font-medium truncate">{p.diagnosis}</span>
      </div>
      <div className="text-[10px] text-[#9ca3af] dark:text-[#555] mt-1.5">• {p.affectedHand} hand</div>
      <div className="mt-3">
        <div className={label}>Sessions</div>
        <div className="text-[11px] font-mono text-[#374151] dark:text-[#ccc] mt-0.5">{p.sessionsCompleted}/{p.sessionsTarget} completed</div>
        <div className="h-1 bg-gray-100 dark:bg-[#222] rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-[#0F6E5E] rounded-full transition-all duration-700" style={{ width: pct + '%' }} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#6b7280] dark:text-[#888]">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>
        Next: {formatDate(p.nextSession)}
      </div>
      <div className="text-[9px] text-[#9ca3af] dark:text-[#555] mt-1.5 truncate">via {p.referringDoctor}</div>
    </button>
  )
}

export default function PatientsPage() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [city, setCity] = useState('All')
  const [hospital, setHospital] = useState('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => INDIAN_PATIENTS.filter(p => {
    if (status !== 'All' && p.status !== status) return false
    if (city !== 'All' && p.city !== city) return false
    if (hospital !== 'All' && p.hospital !== hospital) return false
    const s = q.trim().toLowerCase()
    if (!s) return true
    return p.name.toLowerCase().includes(s) || p.uhid.toLowerCase().includes(s) || p.diagnosis.toLowerCase().includes(s)
  }), [q, status, city, hospital])

  const active = INDIAN_PATIENTS.filter(p => p.status === 'Active').length
  const sessionsThisWeek = INDIAN_PATIENTS.reduce((n, p) => n + Math.min(3, Math.round(p.sessionsCompleted / p.programWeeks)), 0)
  const soonest = INDIAN_PATIENTS.slice().sort((a, b) => a.nextSession.localeCompare(b.nextSession))[0]

  return (
    <div className="px-8 py-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[20px] font-bold text-[#111827] dark:text-[#f0f0f0]">Patients</div>
          <div className="text-[12px] text-[#6b7280] dark:text-[#888] mt-1">Manage patient profiles and rehabilitation programs</div>
        </div>
        <button onClick={() => router.push('/patients/new')} className="shrink-0 bg-[#0F6E5E] text-white rounded-xl px-4 py-2.5 text-[12px] font-medium hover:bg-[#1a8a78] transition-all duration-200 hover:-translate-y-0.5">New Patient +</button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, UHID, diagnosis..."
            className="w-full bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2.5 text-[12px] text-[#111827] dark:text-[#f0f0f0] placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none focus:border-[#0F6E5E] shadow-sm" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} className={select}>
          {['All', 'Active', 'Completed', 'On Hold'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={hospital} onChange={e => setHospital(e.target.value)} className={select}>
          <option>All</option>{HOSPITALS.map(h => <option key={h}>{h}</option>)}
        </select>
        <select value={city} onChange={e => setCity(e.target.value)} className={select}>
          <option>All</option>{CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg p-1 ml-auto">
          <button onClick={() => setView('grid')} className={`w-7 h-7 rounded-md flex items-center justify-center ${view === 'grid' ? 'bg-white dark:bg-[#2a2a2a] text-[#0F6E5E]' : 'text-[#9ca3af]'}`}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </button>
          <button onClick={() => setView('list')} className={`w-7 h-7 rounded-md flex items-center justify-center ${view === 'list' ? 'bg-white dark:bg-[#2a2a2a] text-[#0F6E5E]' : 'text-[#9ca3af]'}`}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {[
          ['Total Patients', String(INDIAN_PATIENTS.length)],
          ['Active', String(active)],
          ['Sessions This Week', String(sessionsThisWeek)],
          ['Next Session', soonest ? `${soonest.name.split(' ')[0]} · ${formatDate(soonest.nextSession)}` : '—'],
        ].map(([l, v]) => (
          <div key={l} className={`${card} p-4`}>
            <div className={label}>{l}</div>
            <div className="text-[16px] font-mono font-semibold text-[#111827] dark:text-[#f0f0f0] mt-1">{v}</div>
          </div>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="mt-5 grid grid-cols-3 gap-4">
          {filtered.map(p => <PatientCard key={p.id} p={p} onClick={() => router.push('/patients/' + p.id)} />)}
          {!filtered.length && (
            <div className={`${card} col-span-3 py-14 text-center`}>
              <div className="text-[13px] text-[#6b7280] dark:text-[#888]">No patients found</div>
              <button onClick={() => { setQ(''); setStatus('All'); setCity('All'); setHospital('All') }} className="mt-3 text-[11px] text-[#0F6E5E] hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      ) : (
        <div className={`${card} mt-5 overflow-hidden`}>
          <table className="w-full text-[12px]">
            <thead><tr className={`text-left border-b border-[#f3f4f6] dark:border-[#1a1a1a] ${label}`}>
              <th className="py-3 px-4 font-mono">Patient</th><th className="font-mono">Diagnosis</th><th className="font-mono">Sessions</th><th className="font-mono">Next Session</th><th className="font-mono">Status</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[#f3f4f6] dark:border-[#1a1a1a] last:border-0 hover:bg-[#f8fafc] dark:hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer" onClick={() => router.push('/patients/' + p.id)}>
                  <td className="py-2.5 px-4"><div className="flex items-center gap-2.5"><Avatar p={p} size={30} /><div><div className="text-[#111827] dark:text-[#f0f0f0] font-medium">{p.name}</div><div className="text-[9px] font-mono text-[#9ca3af]">{p.uhid}</div></div></div></td>
                  <td className="text-[#6b7280] dark:text-[#888]">{p.diagnosis}</td>
                  <td className="font-mono text-[#0F6E5E]">{p.sessionsCompleted}/{p.sessionsTarget}</td>
                  <td className="font-mono text-[#6b7280] dark:text-[#888]">{formatDate(p.nextSession)}</td>
                  <td><span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${statusStyle[p.status]}`}>{p.status}</span></td>
                  <td className="pr-4 text-right"><span className="text-[#0F6E5E] text-[11px]">View →</span></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={6} className="py-8 text-center text-[#9ca3af] dark:text-[#555]">No patients match your filters</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

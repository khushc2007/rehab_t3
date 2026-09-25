'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IndianPatient } from '@/lib/indianPatients'
import { formatDate, formatDateLong, daysUntil } from '@/lib/formatters'
import { useHand } from '@/store/handStore'
import { toast } from '@/components/ui/Toast'

const card = 'bg-[#ffffff] dark:bg-[#161616] rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f1f]'
const label = 'text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]'
const pill = 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-[#ccc] rounded-full px-2.5 py-1 text-[10px]'

const Avatar = ({ p, size }: { p: IndianPatient; size: number }) => (
  <div className="rounded-full shrink-0 flex items-center justify-center font-bold" style={{ width: size, height: size, background: p.avatar.bg + '26', color: p.avatar.bg, fontSize: size * 0.32 }}>
    {p.avatar.initials}
  </div>
)

const ScoreRow = ({ label: l, base, latest }: { label: string; base?: number | null; latest?: number | null }) => {
  if (base == null && latest == null) return null
  const delta = base != null && latest != null ? latest - base : null
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-[#1a1a1a] last:border-0 text-[12px]">
      <span className="text-gray-500 dark:text-[#888]">{l}</span>
      <span className="font-mono text-gray-900 dark:text-[#f0f0f0]">
        {base != null && <>Baseline: {base}</>}{base != null && latest != null && ' · '}{latest != null && <>Latest: {latest}</>}
        {delta != null && <span className={delta >= 0 ? 'text-[#0F6E5E] ml-1.5' : 'text-red-500 ml-1.5'}>{delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}</span>}
      </span>
    </div>
  )
}

export default function PatientProfilePage({ patient }: { patient: IndianPatient }) {
  const router = useRouter()
  const set = useHand(s => s.set)
  const [tab, setTab] = useState<'Diagnosis' | 'Medications' | 'Scores' | 'Contact'>('Diagnosis')
  const [notes, setNotes] = useState(patient.notes)
  const [editing, setEditing] = useState(false)

  const startSession = () => { set({ activePatientId: patient.id }); router.push('/session') }
  const pct = Math.min(100, Math.round((patient.sessionsCompleted / patient.sessionsTarget) * 100))
  const overdue = daysUntil(patient.nextSession) < 0
  const latestRom = patient.sessions[patient.sessions.length - 1]?.rom ?? 0

  const romPath = (() => {
    const s = patient.sessions
    if (!s.length) return ''
    const max = Math.max(...s.map(x => x.rom), 1)
    return s.map((x, i) => `${(i / Math.max(1, s.length - 1)) * 480 + 10},${110 - (x.rom / max) * 90}`).join('L')
  })()

  return (
    <div className="px-8 py-6 max-w-[1300px]">
      <div className="text-[11px] text-[#9ca3af] dark:text-[#555]"><Link href="/patients" className="hover:text-[#0F6E5E]">Patients</Link> {'>'} {patient.name}</div>

      <div className={`${card} p-6 mt-3`}>
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex gap-5 flex-1 min-w-[280px]">
            <Avatar p={patient} size={80} />
            <div>
              <div className="text-[20px] font-bold text-[#111827] dark:text-[#f0f0f0]">{patient.name}</div>
              {patient.nameLocal && <div className="text-[13px] text-gray-400 dark:text-[#666] italic">{patient.nameLocal}</div>}
              <div className="text-[10px] font-mono text-gray-500 dark:text-[#666] mt-1">{patient.uhid}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={pill}>{patient.age}yo {patient.gender}</span>
                <span className={pill}>{patient.city}, {patient.state}</span>
                <span className="bg-teal-50 dark:bg-[#0F6E5E]/15 text-[#0F6E5E] rounded-full px-2.5 py-1 text-[10px]">{patient.diagnosis}</span>
                <span className="text-[9px] text-gray-400 dark:text-[#555] self-center">via {patient.referringDoctor}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 ml-auto">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600 dark:text-green-400"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{patient.status} Patient</span>
            <button onClick={startSession} className="bg-[#0F6E5E] text-white rounded-xl px-6 py-3 text-[13px] font-medium hover:bg-[#1a8a78] transition-all hover:-translate-y-0.5">START SESSION</button>
            <Link href="/reports" className="text-[11px] text-gray-500 dark:text-[#888] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2 hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors">View Reports</Link>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-[#1a1a1a] grid grid-cols-5 divide-x divide-gray-100 dark:divide-[#1a1a1a]">
          {[
            ['Sessions Completed', `${patient.sessionsCompleted}`],
            ['Program Week', `${Math.min(patient.programWeeks, Math.ceil((Date.now() - new Date(patient.programStart).getTime()) / 6048e5))}/${patient.programWeeks}`],
            ['Avg ROM (latest)', `${latestRom}°`],
            ['Fugl-Meyer', patient.clinicalScores.fuglMeyerLatest != null ? String(patient.clinicalScores.fuglMeyerLatest) : '—'],
            ['Next Session', formatDate(patient.nextSession)],
          ].map(([l, v]) => (
            <div key={l} className="px-4 text-center first:pl-0">
              <div className="text-[18px] font-bold font-mono text-[#111827] dark:text-[#f0f0f0]">{v}</div>
              <div className={label}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-5 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className={`${card} p-5`}>
            <div className="text-[13px] font-bold text-[#111827] dark:text-[#f0f0f0]">Clinical Information</div>
            <div className="flex gap-1 mt-3 border-b border-gray-100 dark:border-[#1a1a1a]">
              {(['Diagnosis', 'Medications', 'Scores', 'Contact'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-[11px] font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#0F6E5E] text-[#0F6E5E]' : 'border-transparent text-gray-400 dark:text-[#666] hover:text-gray-600'}`}>{t}</button>
              ))}
            </div>
            <div className="pt-4 text-[12px]">
              {tab === 'Diagnosis' && <>
                <div className="text-[14px] font-medium text-[#0F6E5E]">{patient.diagnosis}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">{patient.comorbidities.map(c => <span key={c} className={pill}>{c}</span>)}</div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] text-gray-500 dark:text-[#888]">
                  <div><span className={label}>Affected hand</span><div className="text-gray-800 dark:text-[#ccc] mt-0.5">{patient.affectedHand}</div></div>
                  <div><span className={label}>Dominant hand</span><div className="text-gray-800 dark:text-[#ccc] mt-0.5">{patient.dominantHand}</div></div>
                  <div><span className={label}>Referring hospital</span><div className="text-gray-800 dark:text-[#ccc] mt-0.5">{patient.hospital}</div></div>
                  <div><span className={label}>Program start</span><div className="text-gray-800 dark:text-[#ccc] mt-0.5">{formatDate(patient.programStart)}</div></div>
                </div>
              </>}
              {tab === 'Medications' && <>
                <div className="flex flex-col gap-2">{patient.medications.map(m => (
                  <div key={m} className="flex items-center gap-2 py-2 border-b border-gray-50 dark:border-[#1a1a1a] last:border-0"><span className="w-1.5 h-1.5 rounded-full bg-[#0F6E5E]" />{m}</div>
                ))}</div>
                <div className="mt-3 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg px-3 py-2 text-[10px]">⚠ Verify current medications before each session</div>
              </>}
              {tab === 'Scores' && <>
                <ScoreRow label="Fugl-Meyer Upper Extremity" base={patient.clinicalScores.fuglMeyerBaseline} latest={patient.clinicalScores.fuglMeyerLatest} />
                <ScoreRow label="Barthel Index" latest={patient.clinicalScores.barthel} />
                <ScoreRow label="UPDRS" latest={patient.clinicalScores.updrs} />
                <ScoreRow label="MMSE" latest={patient.clinicalScores.mmse} />
              </>}
              {tab === 'Contact' && <div className="flex flex-col gap-2.5">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#888]">Phone</span><span className="font-mono">{patient.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#888]">Emergency contact</span><span className="font-mono">{patient.emergency.name} · {patient.emergency.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#888]">Insurance</span><span className="font-mono">{patient.insurance}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#888]">Language</span><span className="font-mono">{patient.language}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#888]">Occupation</span><span className="font-mono">{patient.occupation}</span></div>
              </div>}
            </div>
          </div>

          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between"><div className="text-[13px] font-bold text-[#111827] dark:text-[#f0f0f0]">Session History</div><Link href="/reports" className="text-[10px] text-[#0F6E5E]">View all →</Link></div>
            <table className="w-full mt-3 text-[11px]">
              <thead><tr className="text-left text-[#9ca3af] dark:text-[#555]"><th className="pb-2 font-normal">Date</th><th className="pb-2 font-normal">ROM</th><th className="pb-2 font-normal">Consistency</th><th className="pb-2 font-normal">Reps</th></tr></thead>
              <tbody>{patient.sessions.slice(-8).reverse().map(s => (
                <tr key={s.date} className="border-t border-gray-50 dark:border-[#1a1a1a]">
                  <td className="py-2 text-[#111827] dark:text-[#f0f0f0]">{formatDate(s.date)}</td>
                  <td className="py-2 font-mono text-[#0F6E5E]">{s.rom}°</td>
                  <td className="py-2 font-mono text-[#0F6E5E]">{s.consistency}%</td>
                  <td className="py-2 font-mono text-[#111827] dark:text-[#f0f0f0]">{s.reps}/10</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <div className={`${card} p-5`}>
            <div className="text-[13px] font-bold text-[#111827] dark:text-[#f0f0f0]">ROM Trend</div>
            <div className="text-[10px] text-gray-400 dark:text-[#555]">Progress over {patient.programWeeks} weeks</div>
            <svg viewBox="0 0 500 120" className="w-full mt-2 h-[100px]">
              <line x1="10" y1="110" x2="490" y2="110" stroke="currentColor" className="text-gray-100 dark:text-[#1a1a1a]" />
              {romPath && <path d={`M${romPath}`} fill="none" stroke="#0F6E5E" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </div>
        </div>

        <div className="w-[300px] shrink-0 flex flex-col gap-4">
          <div className={`${card} p-5 border-l-4`} style={{ borderLeftColor: '#0F6E5E' }}>
            <div className="text-[9px] uppercase tracking-wide text-[#0F6E5E] font-mono">Next Session</div>
            <div className="text-[14px] font-bold text-[#111827] dark:text-[#f0f0f0] mt-1">{formatDateLong(patient.nextSession)}</div>
            <div className="text-[11px] text-gray-500 dark:text-[#888] mt-1">Finger Flexion (10 reps)</div>
            <button onClick={startSession} className="w-full mt-3 bg-[#0F6E5E] text-white rounded-xl py-2.5 text-[12px] font-medium hover:bg-[#1a8a78]">START NOW</button>
            <button className="w-full mt-2 text-[10px] text-gray-400 dark:text-[#666] hover:text-[#0F6E5E]">Reschedule</button>
          </div>

          {(overdue || patient.clinicalScores.fuglMeyerLatest == null || patient.language !== 'Hindi / English') && (
            <div className={`${card} p-5 flex flex-col gap-2.5`}>
              <div className="text-[11px] font-bold text-gray-700 dark:text-[#ccc]">Alerts</div>
              {overdue && <div className="flex gap-2 text-[11px] text-amber-600 dark:text-amber-400">⚠ <span>Session overdue ({Math.abs(daysUntil(patient.nextSession))} days)</span></div>}
              {patient.clinicalScores.fuglMeyerLatest == null && <div className="flex gap-2 text-[11px] text-blue-500">📋 <span>Fugl-Meyer assessment due</span></div>}
              <div className="flex gap-2 text-[11px] text-gray-500 dark:text-[#888]">💊 <span>Confirm medication timing before session</span></div>
            </div>
          )}

          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between"><div className="text-[11px] font-bold text-gray-700 dark:text-[#ccc]">Quick Notes</div><button onClick={() => setEditing(x => !x)} className="text-gray-400 hover:text-[#0F6E5E]">✎</button></div>
            {editing ? (
              <>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full mt-2 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#2a2a2a] rounded-lg p-2 text-[11px] outline-none focus:border-[#0F6E5E]" />
                <button onClick={() => { setEditing(false); toast('✓ Notes saved') }} className="mt-2 text-[10px] text-[#0F6E5E]">✓ Save</button>
              </>
            ) : <p className="text-[11px] text-gray-600 dark:text-[#999] mt-2 leading-relaxed">{notes}</p>}
          </div>

          <div className={`${card} p-5`}>
            <div className="text-[11px] font-bold text-gray-700 dark:text-[#ccc]">Attendance</div>
            <div className="flex justify-center my-3">
              <svg viewBox="0 0 100 100" width="90" height="90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-gray-100 dark:text-[#222]" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={pct >= 80 ? '#0F6E5E' : pct >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="9" strokeDasharray={`${pct * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="55" textAnchor="middle" className="font-mono text-[18px] fill-current text-[#111827] dark:text-[#f0f0f0]">{pct}%</text>
              </svg>
            </div>
            <div className="text-center text-[10px] text-gray-400 dark:text-[#555]">{patient.sessionsCompleted}/{patient.sessionsTarget} sessions attended</div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3 text-[10px] text-gray-600 dark:text-amber-400/90">
            🗣 Patient communicates in <b>{patient.language}</b>. Ensure interpreter/translation materials are available if needed.
          </div>
        </div>
      </div>
    </div>
  )
}

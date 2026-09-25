'use client'
import { useState } from 'react'
import { PATIENTS, FINGER_SESSIONS, DATES, CONSISTENCY, REPS_DONE, REPS_TARGET, ALL_SESSIONS_EXTENDED } from '@/lib/mockData'

export default function AnalyticsPage() {
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0])
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [clinicalNotes, setClinicalnotes] = useState(
    'Patient showing consistent improvement. Tremor reduced from session 1. Ready to advance to wrist flexion next week.'
  )
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const filteredSessions = ALL_SESSIONS_EXTENDED.filter(
    s => s.date.includes(searchTerm) || s.exercise.includes(searchTerm) || s.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="sticky top-0 h-12 bg-[#f8fafc] dark:bg-[#0a0a0a] border-b border-[#e5e7eb] dark:border-[#1f1f1f] flex items-center px-6 gap-4 z-10">
        <select
          value={selectedPatient.id}
          onChange={e => {
            const patient = PATIENTS.find(p => p.id === e.target.value)
            if (patient) setSelectedPatient(patient)
          }}
          className="bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-1.5 font-mono text-[10px] text-[#111827] dark:text-[#f0f0f0] focus:outline-none focus:border-[#0F6E5E]"
        >
          {PATIENTS.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} (ID: {p.id})
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-[#f3f4f6] dark:bg-[#1f1f1f]" />

        <select className="bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-1.5 font-mono text-[10px] text-[#111827] dark:text-[#f0f0f0] focus:outline-none focus:border-[#0F6E5E]">
          <option>Last 2 weeks</option>
          <option>Last 4 weeks</option>
          <option>Last 3 months</option>
          <option>All time</option>
        </select>

        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1.5 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors">
            PRINT
          </button>
          <button onClick={() => window.print()} className="px-3 py-1.5 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors">
            EXPORT PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 min-h-[calc(100vh-3rem)]">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Chart 1 - ROM Progression */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-1">RANGE OF MOTION TREND</div>
            <div className="text-[9px] font-mono text-[#9ca3af] dark:text-[#444444] mb-4">Per-finger progression across sessions</div>

            <svg viewBox="0 0 560 200" className="w-full" preserveAspectRatio="xMidYMid meet">
              <rect width="560" height="200" fill="none" className="fill-[#f1f5f9] dark:fill-[#0d0d0d]" rx="4" />

              {/* Target band */}
              <rect x="0" y="55" width="560" height="25" fill="#0F6E5E" opacity="0.07" />
              <text x="510" y="68" fontSize="7" fontFamily="monospace" fill="#0F6E5E">
                TARGET
              </text>

              {/* Grid */}
              {[60, 65, 70, 75, 80, 85].map(y => {
                const mapY = 160 - ((y - 60) / 25) * 140
                return <line key={`grid-${y}`} x1="0" y1={mapY} x2="560" y2={mapY} stroke="currentColor" className="text-gray-100 dark:text-[#1a1a1a]" strokeWidth="0.5" />
              })}

              {/* Y-axis labels */}
              {[60, 70, 80].map((y, i) => (
                <text key={`ylabel-${y}`} x="2" y={30 + i * 70} fontSize="7" fontFamily="monospace" className="fill-gray-400 dark:fill-[#333333]">
                  {y}°
                </text>
              ))}

              {/* X-axis labels */}
              {DATES.map((date, i) => (
                <text key={`date-${i}`} x={i * 70 + 20} y="195" fontSize="7" fontFamily="monospace" fill="#333333" textAnchor="middle">
                  {date}
                </text>
              ))}

              {/* Index line */}
              <polyline
                points={FINGER_SESSIONS.index.map((v, i) => `${i * 70 + 20},${160 - ((v - 60) / 25) * 140}`).join(' ')}
                fill="none"
                stroke="#0F6E5E"
                strokeWidth="2"
              />
              {FINGER_SESSIONS.index.map((v, i) => (
                <circle key={`index-${i}`} cx={i * 70 + 20} cy={160 - ((v - 60) / 25) * 140} r="3" fill="#0F6E5E" />
              ))}

              {/* Middle line */}
              <polyline
                points={FINGER_SESSIONS.middle.map((v, i) => `${i * 70 + 20},${160 - ((v - 60) / 25) * 140}`).join(' ')}
                fill="none"
                stroke="#1a5fb4"
                strokeWidth="1.5"
              />
              {FINGER_SESSIONS.middle.map((v, i) => (
                <circle key={`middle-${i}`} cx={i * 70 + 20} cy={160 - ((v - 60) / 25) * 140} r="2.5" fill="#1a5fb4" />
              ))}

              {/* Ring line */}
              <polyline
                points={FINGER_SESSIONS.ring.map((v, i) => `${i * 70 + 20},${160 - ((v - 60) / 25) * 140}`).join(' ')}
                fill="none"
                stroke="#2ea853"
                strokeWidth="1.5"
              />
              {FINGER_SESSIONS.ring.map((v, i) => (
                <circle key={`ring-${i}`} cx={i * 70 + 20} cy={160 - ((v - 60) / 25) * 140} r="2.5" fill="#2ea853" />
              ))}

              {/* Pinky line */}
              <polyline
                points={FINGER_SESSIONS.pinky.map((v, i) => `${i * 70 + 20},${160 - ((v - 60) / 25) * 140}`).join(' ')}
                fill="none"
                stroke="#f5a623"
                strokeWidth="1.5"
              />
              {FINGER_SESSIONS.pinky.map((v, i) => (
                <circle key={`pinky-${i}`} cx={i * 70 + 20} cy={160 - ((v - 60) / 25) * 140} r="2.5" fill="#f5a623" />
              ))}
            </svg>

            <div className="flex gap-5 mt-3 px-2">
              <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
                <div className="w-2 h-0.5 bg-[#0F6E5E]" />
                INDEX
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
                <div className="w-2 h-0.5 bg-[#1a5fb4]" />
                MIDDLE
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
                <div className="w-2 h-0.5 bg-[#2ea853]" />
                RING
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
                <div className="w-2 h-0.5 bg-[#f5a623]" />
                PINKY
              </div>
            </div>
          </div>

          {/* Chart 2 - Consistency */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-4">SESSION CONSISTENCY</div>

            <svg viewBox="0 0 560 140" className="w-full">
              <rect width="560" height="140" fill="#0d0d0d" />

              {/* Grid */}
              {[70, 80, 90, 100].map(y => {
                const mapY = 130 - ((y - 70) / 30) * 120
                return <line key={`grid-${y}`} x1="0" y1={mapY} x2="560" y2={mapY} stroke="currentColor" className="text-gray-100 dark:text-[#1a1a1a]" strokeWidth="0.5" />
              })}

              {/* Y labels */}
              {[70, 90, 100].map(y => (
                <text key={`ylabel-${y}`} x="2" y={138 - ((y - 70) / 30) * 120} fontSize="7" fontFamily="monospace" className="fill-gray-400 dark:fill-[#333333]">
                  {y}%
                </text>
              ))}

              {/* Bars */}
              {CONSISTENCY.map((c, i) => {
                const barHeight = ((c - 70) / 30) * 120
                const color = c > 85 ? '#0F6E5E' : c > 70 ? '#f5a623' : '#d9534f'
                return (
                  <g key={`bar-${i}`}>
                    <rect x={i * 70 + 10} y={130 - barHeight} width="16" height={barHeight} fill={color} rx="2" />
                    <text x={i * 70 + 18} y={120 - barHeight} fontSize="8" fontFamily="monospace" fill={color} textAnchor="middle">
                      {c}%
                    </text>
                  </g>
                )
              })}

              {/* Trend line */}
              <polyline
                points={CONSISTENCY.map((c, i) => `${i * 70 + 18},${130 - ((c - 70) / 30) * 120}`).join(' ')}
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="4 2"
              />
            </svg>
          </div>

          {/* Chart 3 - Reps */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-4">REP COMPLETION vs. TARGET</div>

            <svg viewBox="0 0 560 120" className="w-full">
              {REPS_TARGET.map((_, i) => (
                <g key={`reps-${i}`}>
                  {/* Target bar */}
                  <rect x={i * 70 + 8} y={100 - 100} width="14" height="100" className="fill-gray-300 dark:fill-[#1f1f1f]" rx="1" />
                  {/* Completed bar */}
                  <rect x={i * 70 + 24} y={100 - (REPS_DONE[i] / 10) * 100} width="14" height={(REPS_DONE[i] / 10) * 100} fill="#0F6E5E" rx="1" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          {/* Patient Info */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
            <div className="text-[8px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-3">PATIENT</div>
            <div className="text-sm font-mono text-[#111827] dark:text-[#f0f0f0] mb-3">{selectedPatient.name}</div>
            {[
              ['ID', selectedPatient.id],
              ['AGE', String(selectedPatient.age)],
              ['HAND', selectedPatient.hand],
              ['DIAGNOSIS', selectedPatient.diagnosis],
              ['PROGRAM', `${selectedPatient.weeks} weeks`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-[#f3f4f6] dark:border-[#1a1a1a] py-1.5 text-[10px] font-mono">
                <span className="text-[#6b7280] dark:text-[#888888]">{label}</span>
                <span className="text-[#111827] dark:text-[#f0f0f0]">{value}</span>
              </div>
            ))}
          </div>

          {/* Latest Session */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
            <div className="text-[8px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-3">LATEST SESSION</div>
            {[
              ['DATE', 'Sep 25, 2026'],
              ['EXERCISE', 'Finger Flexion'],
              ['DURATION', '4:23'],
              ['REPS', '10 / 10'],
              ['AVG ROM', '76°'],
              ['CONSISTENCY', '91%'],
            ].map(([label, value], idx) => (
              <div key={label} className="flex justify-between border-b border-[#f3f4f6] dark:border-[#1a1a1a] py-1.5 text-[10px] font-mono last:border-0">
                <span className={idx >= 4 ? 'text-[#0F6E5E]' : 'text-[#6b7280] dark:text-[#888888]'}>{label}</span>
                <span className={idx >= 4 ? 'text-[#0F6E5E]' : 'text-[#111827] dark:text-[#f0f0f0]'}>{value}</span>
              </div>
            ))}
          </div>

          {/* KPIs */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
            <div className="text-[8px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-3">KEY METRICS</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'AVG ROM', value: '76°', trend: '↑ +8% vs 2wk' },
                { label: 'CONSISTENCY', value: '88%', trend: '↑ +12% vs 2wk' },
                { label: 'SESSION AVG', value: '9.5/10', trend: 'last 4 sessions' },
                { label: 'NEXT SESSION', value: '2 days', trend: 'on schedule ✓' },
              ].map(item => (
                <div key={item.label} className="bg-[#f1f5f9] dark:bg-[#0d0d0d] rounded p-2 border border-[#f3f4f6] dark:border-[#1a1a1a]">
                  <div className="text-[8px] font-mono text-[#6b7280] dark:text-[#555555] mb-1">{item.label}</div>
                  <div className="text-sm font-mono text-[#111827] dark:text-[#f0f0f0] mb-1">{item.value}</div>
                  <div className="text-[8px] font-mono text-[#2ea853]">{item.trend}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
            <div className="flex justify-between items-center mb-3">
              <div className="text-[8px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]">NOTES</div>
              <button onClick={() => setIsEditingNotes(!isEditingNotes)} className="text-[12px] text-[#9ca3af] dark:text-[#333333] hover:text-[#6b7280] dark:text-[#555555]">
                ✏
              </button>
            </div>
            {!isEditingNotes ? (
              <>
                <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#888888] italic mb-2 leading-snug">{clinicalNotes}</div>
                <div className="text-[8px] font-mono text-[#6b7280] dark:text-[#555555]">Sep 25, 2:47 PM</div>
              </>
            ) : (
              <>
                <textarea
                  value={clinicalNotes}
                  onChange={e => setClinicalnotes(e.target.value)}
                  className="w-full bg-[#f8fafc] dark:bg-[#0a0a0a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded px-2 py-1 font-mono text-[9px] text-[#111827] dark:text-[#f0f0f0] mb-2 resize-none h-16"
                />
                <div className="flex gap-1">
                  <button onClick={() => setIsEditingNotes(false)} className="px-2 py-1 bg-[#0F6E5E] text-[#111827] dark:text-[#f0f0f0] text-[8px] font-mono rounded hover:bg-[#1a8a78]">
                    SAVE
                  </button>
                  <button onClick={() => setIsEditingNotes(false)} className="px-2 py-1 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[8px] font-mono rounded">
                    CANCEL
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
            <div className="text-[8px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-3">ACTIONS</div>
            {[
              { icon: '⚠', text: 'Schedule next session', color: '#f5a623' },
              { icon: '✓', text: 'Ready for next level', color: '#2ea853' },
              { icon: '→', text: 'Export session report', color: '#555555' },
            ].map((action, idx) => (
              <div key={idx} className={`flex items-center gap-2 py-1.5 text-[9px] font-mono border-b border-[#f3f4f6] dark:border-[#1a1a1a] last:border-0 ${idx === 2 ? 'cursor-pointer hover:text-[#0F6E5E]' : ''}`}>
                <span style={{ color: action.color }}>{action.icon}</span>
                <span className="text-[#6b7280] dark:text-[#888888]">{action.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="px-6 pb-8">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-mono text-[#6b7280] dark:text-[#555555] hover:text-[#0F6E5E] transition-colors flex items-center gap-2 mb-3"
        >
          VIEW ALL {ALL_SESSIONS_EXTENDED.length} SESSIONS
          <span className={`inline-block transition-transform ${isExpanded ? 'rotate-180' : ''}`}>↓</span>
        </button>

        {isExpanded && (
          <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] overflow-hidden">
            <div className="bg-[#f8fafc] dark:bg-[#0a0a0a] border-b border-[#e5e7eb] dark:border-[#1f1f1f] px-4 py-2">
              <input
                type="text"
                placeholder="🔍 Filter sessions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent font-mono text-[10px] text-[#111827] dark:text-[#f0f0f0] placeholder-[#555555] focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-[10px] font-mono">
                <thead className="sticky top-0 bg-[#ffffff] dark:bg-[#161616] border-b border-[#e5e7eb] dark:border-[#1f1f1f]">
                  <tr>
                    {['DATE/TIME', 'EXERCISE', 'REPS', 'ROM', 'CONSISTENCY', 'DURATION', 'NOTES'].map(h => (
                      <th key={h} className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left px-4 py-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((s, idx) => (
                    <tr key={idx} className={`border-b border-[#f3f4f6] dark:border-[#1a1a1a] ${idx % 2 === 0 ? 'bg-[#ffffff] dark:bg-[#161616]' : 'bg-[#f8fafc] dark:bg-[#131313]'}`}>
                      <td className="px-4 py-2 text-[#6b7280] dark:text-[#888888]">{s.date} {s.time}</td>
                      <td className="px-4 py-2 text-[#111827] dark:text-[#f0f0f0]">{s.exercise}</td>
                      <td className="px-4 py-2 text-[#111827] dark:text-[#f0f0f0]">{s.reps}</td>
                      <td className="px-4 py-2 text-[#0F6E5E]">{s.rom}°</td>
                      <td className={`px-4 py-2 ${s.consistency >= 85 ? 'text-[#0F6E5E]' : 'text-[#f5a623]'}`}>{s.consistency}%</td>
                      <td className="px-4 py-2 text-[#6b7280] dark:text-[#888888]">{s.duration}</td>
                      <td className="px-4 py-2 text-[#6b7280] dark:text-[#555555]">{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

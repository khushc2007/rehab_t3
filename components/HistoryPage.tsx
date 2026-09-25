'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SESSIONS, FINGER_BREAKDOWN, DATES, CONSISTENCY, REPS_DONE, REPS_TARGET } from '@/lib/mockData'

interface TooltipState {
  visible: boolean
  x: number
  y: number
  content: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(
    'Session quality was excellent. Patient achieved consistent ROM across all fingers. No tremor detected. Ready to progress to next exercise level.'
  )
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: '' })

  const currentSession = SESSIONS[SESSIONS.length - 1]
  const fingersWithThumb = FINGER_BREAKDOWN
  const totalReps = fingersWithThumb.reduce((sum, f) => sum + f.reps, 0)
  const completedReps = fingersWithThumb.filter(f => f.reps > 0).length * 10

  const handleChartHover = (e: React.MouseEvent<SVGElement>, dataIndex: number) => {
    const rom = Math.round(60 + (DATES.length - dataIndex - 1) * 2)
    const consistency = CONSISTENCY[dataIndex]
    const reps = REPS_DONE[dataIndex]
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY - 10,
      content: `${DATES[dataIndex]}\nROM: ${rom}° | Consistency: ${consistency}% | Reps: ${reps}/10`,
    })
  }

  const handleChartLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] overflow-y-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-[#f8fafc] dark:bg-[#0a0a0a] border-b border-[#e5e7eb] dark:border-[#1f1f1f] px-6 py-4 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#6b7280] dark:text-[#555555] mb-1">PATIENT 024</div>
            <div className="text-[10px] font-mono text-[#6b7280] dark:text-[#888888]">Sep 25, 2026 • 2:47 PM</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-mono text-[#111827] dark:text-[#f0f0f0]">Finger Flexion (Grip & Release)</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0F6E5E]" />
            <span className="text-[9px] font-mono text-[#0F6E5E] uppercase">COMPLETED</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Card 1 - Session Performance */}
        <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-4">SESSION PERFORMANCE</div>

          <div className="grid grid-cols-2 gap-4">
            {/* Reps Completed */}
            <div className="flex flex-col items-start">
              <div className="text-5xl font-mono text-[#111827] dark:text-[#f0f0f0] mb-1">{currentSession.reps} / 10</div>
              <div className="text-xs font-mono text-[#2ea853] mb-1">100%</div>
              <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">Reps Completed</div>
            </div>

            {/* ROM Consistency */}
            <div className="flex flex-col items-start">
              <div className="text-5xl font-mono text-[#0F6E5E] mb-1">{currentSession.consistency}%</div>
              <div className="text-xs font-mono text-[#2ea853] mb-1">above target</div>
              <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">ROM Consistency</div>
            </div>

            <div className="border-t border-[#e5e7eb] dark:border-[#1f1f1f] col-span-2" />

            {/* Average ROM */}
            <div className="flex flex-col items-start">
              <div className="text-5xl font-mono text-[#111827] dark:text-[#f0f0f0] mb-1">{currentSession.rom}°</div>
              <div className="text-xs font-mono text-[#2ea853] mb-1">target: 75°</div>
              <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">Avg Range of Motion</div>
            </div>

            {/* Movement Time */}
            <div className="flex flex-col items-start">
              <div className="text-5xl font-mono text-[#111827] dark:text-[#f0f0f0] mb-1">1.3s</div>
              <div className="text-xs font-mono text-[#f5a623] mb-1">target: 1.2s</div>
              <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">Avg Movement Time</div>
            </div>
          </div>
        </div>

        {/* Card 2 - Finger Breakdown */}
        <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-4">FINGER BREAKDOWN</div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-[#1f1f1f]">
                  <th className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left pb-2">FINGER</th>
                  <th className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left pb-2">REPS</th>
                  <th className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left pb-2">AVG ROM</th>
                  <th className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left pb-2">CONSISTENCY</th>
                  <th className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left pb-2">EMG SYNC</th>
                  <th className="text-[9px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left pb-2">NOTES</th>
                </tr>
              </thead>
              <tbody>
                {fingersWithThumb.map((finger, idx) => {
                  const bgClass = idx % 2 === 0 ? 'bg-[#ffffff] dark:bg-[#161616]' : 'bg-[#f8fafc] dark:bg-[#131313]'
                  return (
                    <tr key={finger.name} className={`${bgClass} h-9 border-b border-[#f3f4f6] dark:border-[#1a1a1a]`}>
                      <td className="text-[10px] font-mono text-[#6b7280] dark:text-[#888888]">{finger.name}</td>
                      <td className="text-[10px] font-mono text-[#111827] dark:text-[#f0f0f0]">{finger.reps}</td>
                      <td className="text-[10px] font-mono text-[#0F6E5E]">{finger.rom}°</td>
                      <td
                        className={`text-[10px] font-mono ${
                          finger.consistency >= 90
                            ? 'text-[#0F6E5E]'
                            : finger.consistency >= 85
                            ? 'text-[#2ea853]'
                            : finger.consistency >= 80
                            ? 'text-[#f5a623]'
                            : 'text-[#d9534f]'
                        }`}
                      >
                        {finger.consistency}%
                      </td>
                      <td className={`text-[10px] font-mono ${finger.emgSync ? 'text-[#2ea853]' : 'text-[#6b7280] dark:text-[#555555]'}`}>
                        {finger.emgSync ? '✓' : '–'}
                      </td>
                      <td className="text-[10px] font-mono text-[#9ca3af] dark:text-[#444444]">—</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 3 - Trend Chart */}
        <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-4">PROGRESS TREND — LAST 5 SESSIONS</div>

          <svg viewBox="0 0 600 180" className="w-full" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * 600; handleChartHover(e, Math.max(0, Math.min(DATES.length - 1, Math.round((x - 30) / 75)))) }} onMouseLeave={handleChartLeave}>
            <rect width="600" height="180" fill="none" className="fill-[#f1f5f9] dark:fill-[#0d0d0d]" rx="4" />

            {/* Grid */}
            {[60, 70, 80].map(y => {
              const mapY = 160 - ((y - 60) / 25) * 150
              return <line key={`grid-${y}`} x1="0" y1={mapY} x2="600" y2={mapY} stroke="currentColor" className="text-gray-100 dark:text-[#1f1f1f]" strokeWidth="0.5" />
            })}

            {/* Y-axis labels */}
            <text x="2" y="165" fontSize="8" fontFamily="monospace" className="fill-gray-400 dark:fill-[#333333]">
              60°
            </text>
            <text x="2" y="95" fontSize="8" fontFamily="monospace" className="fill-gray-400 dark:fill-[#333333]">
              70°
            </text>
            <text x="2" y="25" fontSize="8" fontFamily="monospace" className="fill-gray-400 dark:fill-[#333333]">
              80°
            </text>

            {/* X-axis labels */}
            {DATES.map((date, i) => (
              <text key={`date-${i}`} x={i * 75 + 15} y="175" fontSize="8" fontFamily="monospace" className="fill-gray-400 dark:fill-[#333333]">
                {date}
              </text>
            ))}

            {/* ROM line */}
            <polyline
              points={SESSIONS.map((s, i) => `${i * 75 + 30},${160 - ((s.rom - 60) / 25) * 150}`).join(' ')}
              fill="none"
              stroke="#0F6E5E"
              strokeWidth="2"
            />
            {SESSIONS.map((s, i) => (
              <circle key={`rom-${i}`} cx={i * 75 + 30} cy={160 - ((s.rom - 60) / 25) * 150} r="3" fill="#0F6E5E" />
            ))}

            {/* Consistency line */}
            <polyline
              points={CONSISTENCY.map((c, i) => `${i * 75 + 30},${160 - ((c - 60) / 40) * 150}`).join(' ')}
              fill="none"
              stroke="#1a5fb4"
              strokeWidth="1.5"
            />
            {CONSISTENCY.map((c, i) => (
              <circle key={`consistency-${i}`} cx={i * 75 + 30} cy={160 - ((c - 60) / 40) * 150} r="2.5" fill="#1a5fb4" />
            ))}

            {/* Reps line */}
            <polyline
              points={REPS_DONE.map((r, i) => `${i * 75 + 30},${160 - ((r / 10) * 60) - 75}`).join(' ')}
              fill="none"
              stroke="#2ea853"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {REPS_DONE.map((r, i) => (
              <circle key={`reps-${i}`} cx={i * 75 + 30} cy={160 - ((r / 10) * 60) - 75} r="2.5" fill="#2ea853" />
            ))}
          </svg>

          <div className="flex gap-6 mt-3 px-2">
            <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
              <div className="w-2 h-0.5 bg-[#0F6E5E]" />
              ROM
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
              <div className="w-2 h-0.5 bg-[#1a5fb4]" />
              CONSISTENCY
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
              <div className="w-2 h-0.5 bg-[#2ea853]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #2ea853 0, #2ea853 4px, transparent 4px, transparent 6px)' }} />
              REPS
            </div>
          </div>
        </div>

        {/* Card 4 - Clinical Notes */}
        <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]">CLINICAL NOTES</div>
            <button
              onClick={() => setIsEditingNotes(!isEditingNotes)}
              className="text-[12px] text-[#9ca3af] dark:text-[#333333] hover:text-[#6b7280] dark:text-[#555555] transition-colors cursor-pointer"
            >
              ✏
            </button>
          </div>

          {!isEditingNotes ? (
            <>
              <div className="text-[11px] font-mono text-[#6b7280] dark:text-[#888888] italic leading-relaxed mb-2">{notes}</div>
              <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">Sep 23, 2:54 PM · Dr. Smith</div>
            </>
          ) : (
            <>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-[#f8fafc] dark:bg-[#0a0a0a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-2 font-mono text-[11px] text-[#111827] dark:text-[#f0f0f0] mb-3 resize-y min-h-[80px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="px-3 py-1 bg-[#0F6E5E] text-[#111827] dark:text-[#f0f0f0] text-[9px] font-mono rounded hover:bg-[#1a8a78] transition-colors"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    setIsEditingNotes(false)
                  }}
                  className="px-3 py-1 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-6 pb-6">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors"
          >
            EXPORT PDF
          </button>
          <button
            onClick={() => alert('Scheduling feature requires backend connection.')}
            className="px-4 py-2 bg-[#0F6E5E] text-[#111827] dark:text-[#f0f0f0] text-[9px] font-mono rounded hover:bg-[#1a8a78] transition-colors"
          >
            SCHEDULE NEXT
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="px-4 py-2 text-[#0F6E5E] text-[9px] font-mono hover:no-underline transition-colors cursor-pointer"
          >
            VIEW ALL SESSIONS →
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-[#ffffff] dark:bg-[#161616] border border-[#0F6E5E] rounded px-2 py-1 text-[9px] font-mono text-[#111827] dark:text-[#f0f0f0] z-50 pointer-events-none whitespace-pre-wrap"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}

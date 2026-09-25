'use client'
import { useState } from 'react'
import { useHand } from '@/store/handStore'
import { downloadCSV } from '@/lib/utils'

type SettingSection = 'device' | 'calibration' | 'exercises' | 'profile' | 'notifications' | 'help' | 'export'

interface Exercise {
  name: string
  duration: string
  targets: string
  difficulty: number
  enabled: boolean
}

interface NotificationSetting {
  label: string
  enabled: boolean
}

export default function SettingsPage() {
  const battery = useHand(s => s.battery)
  const [activeSection, setActiveSection] = useState<SettingSection>('device')
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: 'Finger Flexion', duration: '10 reps · ~4 min', targets: 'grip strength, ROM', difficulty: 1, enabled: true },
    { name: 'Finger Extension', duration: '10 reps · ~4 min', targets: 'extension strength', difficulty: 1, enabled: true },
    { name: 'Individual Isolation', duration: '5 reps each · ~5 min', targets: 'fine motor', difficulty: 2, enabled: true },
    { name: 'Wrist Flexion', duration: '10 reps · ~4 min', targets: 'wrist ROM', difficulty: 2, enabled: false },
    { name: 'Rapid Tapping', duration: '30 sec · ~2 min', targets: 'speed, coordination', difficulty: 3, enabled: false },
  ])
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [reminders, setReminders] = useState<NotificationSetting[]>([
    { label: 'Low battery alert', enabled: true },
    { label: 'Session reminders', enabled: true },
    { label: 'Calibration reminder', enabled: true },
    { label: 'Sensor quality warnings', enabled: true },
    { label: 'Email session summaries', enabled: false },
  ])
  const [reminderTime, setReminderTime] = useState('14:00')

  const toggleExercise = (name: string) => {
    setExercises(exercises.map(e => (e.name === name ? { ...e, enabled: !e.enabled } : e)))
  }

  const toggleReminder = (idx: number) => {
    setReminders(reminders.map((r, i) => (i === idx ? { ...r, enabled: !r.enabled } : r)))
  }

  const handleExportCSV = () => {
    const rows = [
      ['Session Date', 'Exercise', 'Reps', 'ROM', 'Consistency', 'Duration'],
      ['Sep 25, 2026', 'Finger Flexion', '10', '76°', '91%', '4:23'],
      ['Sep 23, 2026', 'Finger Flexion', '10', '74°', '87%', '4:21'],
    ]
    downloadCSV('all_sessions.csv', rows.map(r => r.map(String)))
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      alert('Data cleared successfully.')
    }
  }

  const NavItem = ({ section, icon, label }: { section: SettingSection; icon: string; label: string }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-3 px-5 h-9 rounded-lg transition-colors ${
        activeSection === section
          ? 'bg-[#ffffff] dark:bg-[#161616] text-[#0F6E5E] border-l border-[#0F6E5E]'
          : 'text-[#6b7280] dark:text-[#555555] hover:text-[#6b7280] dark:text-[#888888]'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-mono">{label}</span>
    </button>
  )

  return (
    <div className="h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] flex">
      {/* Left Nav */}
      <div className="w-48 bg-[#ffffff] dark:bg-[#111111] border-r border-[#e5e7eb] dark:border-[#1f1f1f] pt-6 flex-shrink-0 overflow-y-auto">
        <div className="text-[8px] font-mono uppercase tracking-widest text-[#9ca3af] dark:text-[#333333] px-5 mb-4">SETTINGS</div>
        <div className="flex flex-col gap-1 px-2">
          <NavItem section="device" icon="⚙" label="Device Status" />
          <NavItem section="calibration" icon="📊" label="Calibration History" />
          <NavItem section="exercises" icon="💪" label="Exercise Library" />
          <NavItem section="profile" icon="👤" label="User Profile" />
          <NavItem section="notifications" icon="🔔" label="Notifications" />
          <NavItem section="help" icon="❓" label="Help" />
          <NavItem section="export" icon="💾" label="Export & Backup" />
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Device Status */}
        {activeSection === 'device' && (
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-5">DEVICE STATUS</h2>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { title: 'CONNECTION', status: '✓ Connected', time: 'Last sync: 2 min ago' },
                { title: 'BATTERY', value: `${battery}%`, time: `~${Math.round(battery / 50 * 60)}min remaining` },
                { title: 'FIRMWARE', version: 'v2.4.1', time: 'Up to date ✓' },
                { title: 'SENSORS', status: '✓ All OK', time: 'Flex: 5/5 ✓ EMG: 1/1 ✓' },
              ].map((card, idx) => (
                <div key={idx} className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
                  <div className="text-[8px] font-mono uppercase text-[#6b7280] dark:text-[#555555] mb-2">{card.title}</div>
                  {card.status && <div className="text-[12px] font-mono text-[#0F6E5E] mb-1">{card.status}</div>}
                  {card.value && <div className="text-[16px] font-mono text-[#111827] dark:text-[#f0f0f0] mb-1">{card.value}</div>}
                  <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">{card.time}</div>
                </div>
              ))}
            </div>

            {/* Device Info */}
            <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
              {[
                ['DEVICE ID', 'RG-2024-001234'],
                ['PAIR CODE', '7FJ9-8KL2'],
                ['LAST UPDATE', 'Sep 20, 2026'],
                ['WS ENDPOINT', process.env.NEXT_PUBLIC_WS_URL || 'Not configured'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#f3f4f6] dark:border-[#1a1a1a] py-2 text-[10px] font-mono last:border-0">
                  <span className="text-[#6b7280] dark:text-[#888888]">{label}</span>
                  <span className="text-[#111827] dark:text-[#f0f0f0]">{value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#d9534f] hover:text-[#d9534f] transition-colors">
                UNPAIR DEVICE
              </button>
              <button className="px-4 py-2 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors">
                CHECK UPDATES
              </button>
              <button className="px-4 py-2 border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors">
                SEND DIAGNOSTIC
              </button>
            </div>
          </div>
        )}

        {/* Calibration History */}
        {activeSection === 'calibration' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555]">CALIBRATION HISTORY</h2>
              <button className="px-3 py-1.5 bg-[#0F6E5E] text-[#111827] dark:text-[#f0f0f0] text-[9px] font-mono rounded hover:bg-[#1a8a78]">
                RECALIBRATE NOW
              </button>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] overflow-hidden">
              <table className="w-full text-[10px] font-mono">
                <thead className="bg-[#f1f5f9] dark:bg-[#0d0d0d] border-b border-[#e5e7eb] dark:border-[#1f1f1f]">
                  <tr>
                    {['DATE/TIME', 'STATUS', 'ROM RANGE', 'QUALITY'].map(h => (
                      <th key={h} className="text-[8px] font-mono uppercase text-[#9ca3af] dark:text-[#444444] text-left px-4 py-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Sep 25, 10:32 AM', status: '✓ Complete', rom: '78–82°', quality: 'Excellent' },
                    { date: 'Sep 23, 2:15 PM', status: '✓ Complete', rom: '76–80°', quality: 'Good' },
                    { date: 'Sep 20, 9:00 AM', status: '✓ Complete', rom: '72–78°', quality: 'Good' },
                    { date: 'Sep 18, 3:45 PM', status: '✓ Complete', rom: '70–76°', quality: 'Fair' },
                  ].map((row, idx) => (
                    <tr key={idx} className={`border-b border-[#f3f4f6] dark:border-[#1a1a1a] ${idx % 2 === 0 ? 'bg-[#ffffff] dark:bg-[#161616]' : 'bg-[#f8fafc] dark:bg-[#131313]'}`}>
                      <td className="px-4 py-2 text-[#6b7280] dark:text-[#888888]">{row.date}</td>
                      <td className="px-4 py-2 text-[#2ea853]">{row.status}</td>
                      <td className="px-4 py-2 text-[#0F6E5E]">{row.rom}</td>
                      <td className="px-4 py-2 text-[#111827] dark:text-[#f0f0f0]">{row.quality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exercise Library */}
        {activeSection === 'exercises' && (
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-5">EXERCISE LIBRARY</h2>

            <div className="space-y-2">
              {exercises.map(ex => (
                <div key={ex.name} className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
                  <div className="flex items-center gap-3 mb-0">
                    <input
                      type="checkbox"
                      checked={ex.enabled}
                      onChange={() => toggleExercise(ex.name)}
                      className="w-4 h-4 rounded"
                    />
                    <button
                      onClick={() => setExpandedExercise(expandedExercise === ex.name ? null : ex.name)}
                      className="flex-1 text-left text-[11px] font-mono text-[#111827] dark:text-[#f0f0f0] hover:text-[#0F6E5E]"
                    >
                      {ex.name}
                    </button>
                    <span className="text-[10px]">{expandedExercise === ex.name ? '↑' : '↓'}</span>
                  </div>

                  {expandedExercise === ex.name && (
                    <div className="mt-3 ml-7 space-y-1 text-[9px] font-mono text-[#6b7280] dark:text-[#555555]">
                      <div>Duration: {ex.duration}</div>
                      <div>Targets: {ex.targets}</div>
                      <div>Difficulty: {'★'.repeat(ex.difficulty)}{'☆'.repeat(5 - ex.difficulty)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeSection === 'notifications' && (
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-5">NOTIFICATIONS</h2>

            <div className="space-y-3 mb-6">
              {reminders.map((reminder, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-[#f3f4f6] dark:border-[#1a1a1a]">
                  <span className="text-[10px] font-mono text-[#6b7280] dark:text-[#888888]">{reminder.label}</span>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${reminder.enabled ? 'bg-[#0F6E5E]' : 'bg-[#333333]'}`}
                    onClick={() => toggleReminder(idx)}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${reminder.enabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f]">
              <div className="text-[9px] font-mono text-[#6b7280] dark:text-[#555555] mb-2">DAILY REMINDER AT:</div>
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="bg-[#f8fafc] dark:bg-[#0a0a0a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-lg px-3 py-1.5 font-mono text-[10px] text-[#111827] dark:text-[#f0f0f0] focus:outline-none focus:border-[#0F6E5E]"
              />
            </div>
          </div>
        )}

        {/* Export & Backup */}
        {activeSection === 'export' && (
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] dark:text-[#555555] mb-5">EXPORT & BACKUP</h2>

            {/* Storage Bar */}
            <div className="bg-[#ffffff] dark:bg-[#161616] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#1f1f1f] mb-4">
              <div className="text-[8px] font-mono text-[#6b7280] dark:text-[#555555] mb-1">LOCAL STORAGE</div>
              <div className="text-[10px] font-mono text-[#6b7280] dark:text-[#888888] mb-2">234 sessions / 500 max</div>
              <div className="h-[3px] bg-[#f3f4f6] dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F6E5E]" style={{ width: '47%' }} />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-2 bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors"
              >
                EXPORT ALL SESSIONS (CSV)
              </button>
              <button
                onClick={() => window.print()}
                className="w-full text-left px-4 py-2 bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors"
              >
                EXPORT PATIENT PROFILE (PDF)
              </button>
              <button className="w-full text-left px-4 py-2 bg-[#ffffff] dark:bg-[#161616] border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#6b7280] dark:text-[#555555] text-[9px] font-mono rounded hover:border-[#0F6E5E] hover:text-[#0F6E5E] transition-colors">
                BACKUP CALIBRATION DATA
              </button>
              <button
                onClick={handleClearData}
                className="w-full text-left px-4 py-2 bg-[#ffffff] dark:bg-[#161616] border border-[#d9534f] border-opacity-30 text-[#d9534f] text-[9px] font-mono rounded hover:border-opacity-100 transition-colors"
              >
                CLEAR LOCAL DATA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Indian-locale formatting helpers, used across Patients / Reports / Lab pages.

export const formatIndian = (n: number) => new Intl.NumberFormat('en-IN').format(n)

// Accepts an ISO date ("2026-09-27") and renders DD/MM/YYYY (Indian standard).
export const formatDate = (iso: string) => {
  const d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''))
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Longer form, e.g. "Sunday, 27 September 2026"
export const formatDateLong = (iso: string) => {
  const d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''))
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

// 12-hour, IST-suffixed — for patient-facing surfaces.
export const formatTimeIST = (iso: string) => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST'
}

// 24-hour — for clinical/tabular surfaces.
export const formatTime24 = (iso: string) => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
}

export const formatINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

// Days between an ISO date and today (negative = overdue).
export const daysUntil = (iso: string) => {
  const d = new Date(iso + 'T00:00:00'), now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - now.getTime()) / 86400000)
}

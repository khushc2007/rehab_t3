'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/Toast'

const card = 'bg-[#ffffff] dark:bg-[#161616] rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f1f]'
const inp = 'w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[12px] text-[#111827] dark:text-[#f0f0f0] outline-none focus:border-[#0F6E5E]'
const lab = 'text-[10px] font-mono uppercase tracking-wide text-gray-500 dark:text-[#666] mb-1 block'
const STATES = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Other']
const LANGS = ['Hindi', 'English', 'Tamil', 'Kannada', 'Telugu', 'Marathi', 'Gujarati', 'Bengali', 'Other']
const DIAGNOSES = ['Post-stroke', "Parkinson's Disease", 'Arthritis', 'Carpal Tunnel Syndrome', 'Traumatic Brain Injury', 'Cerebral Palsy', 'Other']
const INSURERS = ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Ayushman Bharat', 'Self-pay', 'Other']
const COMORBID = ['Hypertension', 'Type 2 Diabetes', 'Cardiac condition', 'Osteoporosis', 'None']

const Field = ({ l, children }: { l: string; children: React.ReactNode }) => <div><span className={lab}>{l}</span>{children}</div>

export default function NewPatientForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [f, setF] = useState({
    name: '', nameLocal: '', age: '', gender: 'Male', phone: '', emergencyName: '', emergencyPhone: '',
    city: '', state: STATES[0], language: LANGS[0],
    diagnosis: DIAGNOSES[0], affectedHand: 'Right', dominantHand: 'Right', doctor: '', hospital: '', insurance: INSURERS[0], uhid: 'RG-' + Math.floor(1000 + Math.random() * 9000), comorbidities: [] as string[],
    sessionsPerWeek: '3', duration: '20 min', firstSession: '', clinicalNotes: '',
  })
  const upd = (k: string, v: any) => setF(s => ({ ...s, [k]: v }))
  const toggleComorbid = (c: string) => setF(s => ({ ...s, comorbidities: s.comorbidities.includes(c) ? s.comorbidities.filter(x => x !== c) : [...s.comorbidities, c] }))
  const initials = f.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'

  const next = () => setStep(s => Math.min(3, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))
  const canNext1 = f.name && f.age && f.phone
  const canNext2 = f.diagnosis && f.doctor

  if (done) {
    return (
      <div className="px-8 py-6 max-w-[560px] mx-auto">
        <div className={`${card} p-6 text-center`}>
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-[16px]" style={{ background: '#0F6E5E26', color: '#0F6E5E' }}>{initials}</div>
          <div className="text-[16px] font-bold text-[#111827] dark:text-[#f0f0f0] mt-3">{f.name}</div>
          <div className="text-[11px] text-gray-500 dark:text-[#888] mt-1">{f.uhid} · {f.diagnosis}</div>
          <div className="text-[12px] text-gray-500 dark:text-[#888] mt-3">Patient profile created (demo data — not persisted).</div>
          <div className="flex gap-2 justify-center mt-5">
            <button onClick={() => router.push('/patients')} className="bg-[#0F6E5E] text-white rounded-xl px-5 py-2.5 text-[12px] font-medium hover:bg-[#1a8a78]">Go to Patients</button>
            <button onClick={() => { setDone(false); setStep(1) }} className="border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#888]">Add another</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-8 py-6 max-w-[640px] mx-auto">
      <div className="text-[20px] font-bold text-[#111827] dark:text-[#f0f0f0]">New Patient</div>
      <div className="text-[12px] text-gray-500 dark:text-[#888] mt-1">Step {step} of 3 — {['Personal Information', 'Clinical Information', 'Program Setup'][step - 1]}</div>
      <div className="h-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full mt-3 overflow-hidden"><div className="h-full bg-[#0F6E5E] transition-all duration-300" style={{ width: (step / 3) * 100 + '%' }} /></div>

      <div className={`${card} p-6 mt-5 flex flex-col gap-4`}>
        {step === 1 && <>
          <div className="grid grid-cols-2 gap-4">
            <Field l="Full Name"><input className={inp} value={f.name} onChange={e => upd('name', e.target.value)} placeholder="e.g. Rajesh Kumar" /></Field>
            <Field l="Name (regional language, optional)"><input className={inp} value={f.nameLocal} onChange={e => upd('nameLocal', e.target.value)} placeholder="राजेश कुमार" /></Field>
            <Field l="Age"><input className={inp} type="number" value={f.age} onChange={e => upd('age', e.target.value)} /></Field>
            <Field l="Gender"><select className={inp} value={f.gender} onChange={e => upd('gender', e.target.value)}><option>Male</option><option>Female</option></select></Field>
            <Field l="Phone"><input className={inp} value={f.phone} onChange={e => upd('phone', e.target.value)} placeholder="+91 " /></Field>
            <Field l="Emergency Contact"><input className={inp} value={f.emergencyName} onChange={e => upd('emergencyName', e.target.value)} placeholder="Name (relation)" /></Field>
            <Field l="Emergency Phone"><input className={inp} value={f.emergencyPhone} onChange={e => upd('emergencyPhone', e.target.value)} placeholder="+91 " /></Field>
            <Field l="City"><input className={inp} value={f.city} onChange={e => upd('city', e.target.value)} /></Field>
            <Field l="State"><select className={inp} value={f.state} onChange={e => upd('state', e.target.value)}>{STATES.map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field l="Language preference"><select className={inp} value={f.language} onChange={e => upd('language', e.target.value)}>{LANGS.map(l => <option key={l}>{l}</option>)}</select></Field>
          </div>
        </>}

        {step === 2 && <>
          <div className="grid grid-cols-2 gap-4">
            <Field l="Diagnosis"><select className={inp} value={f.diagnosis} onChange={e => upd('diagnosis', e.target.value)}>{DIAGNOSES.map(d => <option key={d}>{d}</option>)}</select></Field>
            <div />
            <Field l="Affected hand"><select className={inp} value={f.affectedHand} onChange={e => upd('affectedHand', e.target.value)}><option>Left</option><option>Right</option><option>Bilateral</option></select></Field>
            <Field l="Dominant hand"><select className={inp} value={f.dominantHand} onChange={e => upd('dominantHand', e.target.value)}><option>Left</option><option>Right</option></select></Field>
            <Field l="Referring doctor"><input className={inp} value={f.doctor} onChange={e => upd('doctor', e.target.value)} placeholder="Dr. ..." /></Field>
            <Field l="Hospital"><input className={inp} value={f.hospital} onChange={e => upd('hospital', e.target.value)} placeholder="e.g. Manipal Hospital" /></Field>
            <Field l="Insurance provider"><select className={inp} value={f.insurance} onChange={e => upd('insurance', e.target.value)}>{INSURERS.map(i => <option key={i}>{i}</option>)}</select></Field>
            <Field l="UHID"><input className={inp} value={f.uhid} onChange={e => upd('uhid', e.target.value)} /></Field>
          </div>
          <Field l="Comorbidities">
            <div className="flex flex-wrap gap-2">{COMORBID.map(c => (
              <button key={c} type="button" onClick={() => toggleComorbid(c)} className={`text-[11px] rounded-full px-3 py-1.5 border transition-colors ${f.comorbidities.includes(c) ? 'bg-[#0F6E5E] text-white border-[#0F6E5E]' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-[#888] hover:border-[#0F6E5E]'}`}>{c}</button>
            ))}</div>
          </Field>
        </>}

        {step === 3 && <>
          <div className="grid grid-cols-2 gap-4">
            <Field l="Target sessions / week"><input className={inp} type="number" value={f.sessionsPerWeek} onChange={e => upd('sessionsPerWeek', e.target.value)} /></Field>
            <Field l="Session duration"><select className={inp} value={f.duration} onChange={e => upd('duration', e.target.value)}><option>15 min</option><option>20 min</option><option>30 min</option></select></Field>
            <Field l="First session date"><input className={inp} type="date" value={f.firstSession} onChange={e => upd('firstSession', e.target.value)} /></Field>
          </div>
          <Field l="Clinical notes"><textarea className={inp} rows={4} value={f.clinicalNotes} onChange={e => upd('clinicalNotes', e.target.value)} placeholder="Anything the therapist should know before the first session..." /></Field>
          <div className={`${card} p-4 mt-1`}>
            <div className={lab}>Preview</div>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[13px]" style={{ background: '#0F6E5E26', color: '#0F6E5E' }}>{initials}</div>
              <div>
                <div className="text-[13px] font-medium text-[#111827] dark:text-[#f0f0f0]">{f.name || 'Patient name'}</div>
                <div className="text-[10px] text-gray-500 dark:text-[#888]">{f.diagnosis} · {f.city || 'City'}, {f.state}</div>
              </div>
            </div>
          </div>
        </>}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={step === 1 ? () => router.push('/patients') : back} className="text-[12px] text-gray-500 dark:text-[#888] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-5 py-2.5 hover:border-gray-300">{step === 1 ? 'Cancel' : '← Back'}</button>
        {step < 3
          ? <button onClick={next} disabled={step === 1 ? !canNext1 : !canNext2} className="text-[12px] bg-[#0F6E5E] text-white rounded-xl px-6 py-2.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a8a78]">Continue →</button>
          : <button onClick={() => { setDone(true); toast('✓ Patient added') }} className="text-[12px] bg-[#0F6E5E] text-white rounded-xl px-6 py-2.5 font-medium hover:bg-[#1a8a78]">Create Patient</button>}
      </div>
    </div>
  )
}

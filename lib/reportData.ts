// Synthesizes per-rep, EMG and raw-sensor detail for a session summary, deterministically
// (seeded, not Math.random) so the report renders identically on every load.

const seeded = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }

export interface RepDetail { n: number; rom: number; time: number; emgPeak: number; consistency: number; wristComp: number; quality: 'correct' | 'partial' | 'missed' }

export function buildReps(seedBase: number, count: number, baseRom: number, baseConsistency: number): RepDetail[] {
  const rnd = seeded(seedBase * 7 + 13)
  const reps: RepDetail[] = []
  for (let i = 0; i < count; i++) {
    const fatigue = i / Math.max(1, count - 1)
    const rom = Math.max(20, Math.round(baseRom - fatigue * 6 + (rnd() - 0.5) * 10))
    const time = +(1.1 + fatigue * 0.6 + (rnd() - 0.5) * 0.3).toFixed(2)
    const emgPeak = Math.round(35 + baseConsistency * 0.4 + (rnd() - 0.5) * 20)
    const consistency = Math.max(30, Math.min(100, Math.round(baseConsistency + (rnd() - 0.5) * 15 - fatigue * 5)))
    const wristComp = +(2 + fatigue * 4 + rnd() * 3).toFixed(1)
    const quality: RepDetail['quality'] = consistency > 78 ? 'correct' : consistency > 55 ? 'partial' : 'missed'
    reps.push({ n: i + 1, rom, time, emgPeak, consistency, wristComp, quality })
  }
  return reps
}

export interface EmgSample { t: number; emg: number; flex: number }
export function buildEmgWave(seedBase: number, reps: RepDetail[]): EmgSample[] {
  const rnd = seeded(seedBase * 31 + 5)
  const samples: EmgSample[] = []
  let t = 0
  for (const r of reps) {
    const n = Math.round(r.time * 20) // 20Hz
    for (let i = 0; i < n; i++) {
      const ph = i / n
      const env = Math.sin(ph * Math.PI) // rise/fall envelope per rep
      samples.push({ t, emg: Math.max(0, Math.round(r.emgPeak * env + (rnd() - 0.5) * 8)), flex: Math.round(r.rom * env) })
      t += 50
    }
  }
  return samples
}

export interface RawRow { t: number; index: number; middle: number; ring: number; pinky: number; thumb: number; wristPitch: number; emg: number }
export function buildRawRows(seedBase: number, reps: RepDetail[]): RawRow[] {
  const rnd = seeded(seedBase * 53 + 91)
  const rows: RawRow[] = []
  let t = 0
  for (const r of reps) {
    const n = Math.max(2, Math.round((r.time * 1000) / 200)) // sampled to 5Hz
    for (let i = 0; i < n; i++) {
      const ph = i / n, env = Math.sin(ph * Math.PI)
      rows.push({
        t, index: Math.round(r.rom * env), middle: Math.round(r.rom * env * 0.97), ring: Math.round(r.rom * env * 0.93),
        pinky: Math.round(r.rom * env * 0.88), thumb: Math.round(r.rom * env * 0.55),
        wristPitch: +(r.wristComp * env * (rnd() > 0.5 ? 1 : -1)).toFixed(1), emg: Math.round(r.emgPeak * env),
      })
      t += 200
    }
  }
  return rows
}

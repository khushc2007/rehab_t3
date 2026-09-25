'use client'
import {useEffect,useRef,useState} from 'react'
import {CONDITIONS,generateFrames} from './DiseaseEngine'
import {ConditionKey,SimFrame} from '@/types/lab.types'
import {SensorFrame} from '@/types/sensor'
import LabHandScene from './LabHandScene'
import TrajectoryChart from './TrajectoryChart'
import EMGWaveform from './EMGWaveform'
import AIAssessmentPanel from './AIAssessmentPanel'
const CATS=['All','Neurological','Musculoskeletal','Neuromuscular']
const SEV:Record<string,string>={Ref:'bg-teal-50 text-teal-700 dark:bg-[#0F6E5E]/20 dark:text-[#0F6E5E]',Mild:'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',Mod:'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',High:'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}
const rest=():SensorFrame=>({t:0,f:[0,0,0,0,0],e:0,roll:0,pitch:0,yaw:0,bat:100}),avg=(a:number[])=>a.reduce((x,y)=>x+y,0)/(a.length||1)
const card='bg-white dark:bg-[#161616] rounded-2xl p-5 border border-gray-100 dark:border-[#1f1f1f] shadow-sm dark:shadow-none'
const lab='text-[10pt] uppercase tracking-wide text-gray-500 dark:text-[#555]'
const Tg=({on,set}:any)=><button onClick={()=>set(!on)} className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on?'bg-[#0F6E5E]':'bg-gray-200 dark:bg-[#2a2a2a]'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${on?'left-6':'left-1'}`}/></button>
export default function LabPage(){
 const [key,setKey]=useState<ConditionKey>('parkinsonian'),[cat,setCat]=useState('All'),[run,setRun]=useState(false),[done,setDone]=useState(false),[cmp,setCmp]=useState(false),[el,setEl]=useState(0),[full,setFull]=useState(false)
 const [view,setView]=useState<{a:SimFrame[];b:SimFrame[]}>({a:[],b:[]})
 const src=useRef(rest()),src2=useRef(rest()),raf=useRef(0),cond=CONDITIONS[key],all=Object.values(CONDITIONS)
 const stop=()=>{cancelAnimationFrame(raf.current);setRun(false);src.current=rest();src2.current=rest()}
 const pick=(k:ConditionKey)=>{stop();setKey(k);setDone(false);setView({a:[],b:[]});setEl(0)}
 const start=()=>{cancelAnimationFrame(raf.current);const a=generateFrames(key),b=generateFrames('healthy'),t0=performance.now() // both buffers pre-generated, played in sync
  setDone(false);setRun(true);setView({a:[],b:[]})
  const pack=(f:SimFrame,e:number,r:{current:SensorFrame})=>{r.current={t:e,f:[...f.fingers,f.thumb],e:f.emg,roll:f.wristRoll,pitch:f.wristPitch,yaw:0,bat:100}}
  const tick=()=>{const e=performance.now()-t0,i=Math.floor(e/20)
   if(i>=a.length){src.current=rest();src2.current=rest();setView({a,b});setEl(10000);setRun(false);setDone(true);return}
   pack(a[i],e,src);pack(b[i],e,src2)
   if(i%5===0){setView({a:a.slice(0,i+1),b:b.slice(0,i+1)});setEl(e)} // React updates throttled to 10Hz
   raf.current=requestAnimationFrame(tick)}
  raf.current=requestAnimationFrame(tick)}
 useEffect(()=>()=>cancelAnimationFrame(raf.current),[])
 useEffect(()=>{const f=(e:KeyboardEvent)=>{if((e.target as HTMLElement)?.tagName==='INPUT')return
  if(e.code==='Space'){e.preventDefault();run?stop():start()}else if(e.key==='c')setCmp(x=>!x);else if(e.key==='h')pick('healthy');else if(e.key==='f')setFull(x=>!x);else if(/^[1-9]$/.test(e.key)&&all[+e.key-1])pick(all[+e.key-1].key)}
  addEventListener('keydown',f);return()=>removeEventListener('keydown',f)})
 const exp=()=>{const rows=['t_ms,index,middle,ring,pinky,thumb,wristPitch,wristRoll,emg',...view.a.map(f=>[f.t,...f.fingers,f.thumb,f.wristPitch,f.wristRoll,f.emg].map(v=>v.toFixed(2)).join(','))],a=document.createElement('a')
  a.href=URL.createObjectURL(new Blob([rows.join('\n')],{type:'text/csv'}));a.download=`lab_${key}.csv`;a.click()}
 const fr=view.a,pk=fr.map(f=>avg(f.fingers)).sort((x,y)=>x-y),rom=pk.length?pk[Math.floor(pk.length*.95)]:0,has=fr.length>0,mc=key==='healthy'?'currentColor':cond.color
 const sec=(ms:number)=>`00:${String(Math.floor(ms/1000)).padStart(2,'0')}`
 const Row=({l,v}:any)=><div className="flex justify-between py-2.5 border-b border-gray-50 dark:border-[#1a1a1a] last:border-0 text-[12pt]"><span className="text-gray-500 dark:text-[#666]">{l}</span><span className="font-mono text-gray-900 dark:text-[#f0f0f0]" style={{color:has?mc:undefined}}>{has?v:'—'}</span></div>
 const hand=<LabHandScene label={cond.label} color={cond.color} src={src} src2={src2} compare={cmp} running={run} fullscreen={full} onToggleFullscreen={()=>setFull(x=>!x)}/>
 if(full)return <div className="fixed inset-0 z-50">{hand}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#0a0a0a]/80 backdrop-blur rounded-full px-4 py-2 font-mono text-[10pt]">
   {run?<button onClick={stop} className="text-[#d9534f]">■ STOP</button>:<button onClick={start} className="text-[#0F6E5E]">▶ RUN</button>}
   <span className="text-[#555]">{sec(el)} / 00:10</span>
   <button onClick={()=>setCmp(x=>!x)} className={cmp?'text-[#0F6E5E]':'text-[#555]'}>COMPARE</button></div></div>
 return <div className="px-6 py-6">
  <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-3"><h1 className="text-[24pt] font-bold text-gray-900 dark:text-[#f0f0f0]">AI Movement Lab</h1><span className="bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 rounded-full px-2.5 py-0.5 text-xs font-medium">RESEARCH</span></div>
    <div className="text-[13pt] text-gray-500 dark:text-[#888] mt-1">Simulated movement pattern analysis for research and clinical education</div></div>
   <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-lg px-4 py-2 text-[11pt]">⚠ Research tool only. Not for clinical diagnosis.</div></div>
  <div className="mt-5 flex gap-5 items-start">
   <div className="w-[260px] shrink-0 flex flex-col gap-4">
    <div className={card}><div className={`${lab} mb-4`}>Condition</div><div className="flex flex-wrap gap-2 mb-4">{CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`text-[11pt] rounded-full px-3 py-1 ${cat===c?'bg-[#0F6E5E] text-white':'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-[#888] hover:bg-gray-200 dark:hover:bg-[#222]'}`}>{c}</button>)}</div>
     <div className="flex flex-col gap-2">{all.filter(c=>cat==='All'||c.category===cat).map(c=><button key={c.key} onClick={()=>pick(c.key)} className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition ${key===c.key?'border-[#0F6E5E] bg-teal-50/30 dark:bg-[#0F6E5E]/10 shadow-sm':'border-transparent hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'}`}>
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:c.color}}/><span className="flex-1"><span className="block text-[12pt] font-medium text-gray-900 dark:text-[#f0f0f0]">{c.label}</span><span className="block text-[9pt] text-gray-400 dark:text-[#555]">{c.category}</span></span><span className={`text-[9pt] rounded-full px-2 py-0.5 ${SEV[c.severity]}`}>{c.severity}</span></button>)}</div></div>
    <div className={card}><div className={`${lab} mb-4`}>Simulation controls</div>
     {run?<><div className="h-1.5 bg-gray-100 dark:bg-[#1a1a1a] rounded-full"><div className="h-full bg-[#0F6E5E] rounded-full" style={{width:`${el/100}%`}}/></div><div className="text-right font-mono text-[11pt] text-gray-500 dark:text-[#666] mt-1">{sec(el)} / 00:10</div><button onClick={stop} className="w-full mt-3 border border-red-200 dark:border-red-500/30 text-red-500 rounded-xl py-2.5 hover:bg-red-50 dark:hover:bg-red-500/10">STOP</button></>
     :done?<div className="flex gap-2"><button onClick={start} className="flex-1 border border-[#0F6E5E] text-[#0F6E5E] rounded-xl py-2.5">RE-RUN</button><button onClick={exp} className="flex-1 border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-[#888] rounded-xl py-2.5">EXPORT DATA</button></div>
     :<button onClick={start} className="w-full bg-[#0F6E5E] text-white rounded-xl py-3 text-[14pt] font-medium hover:bg-[#1a8a78]">RUN SIMULATION</button>}
     <div className="flex justify-between items-center mt-3"><span className="text-[12pt] text-gray-700 dark:text-[#ccc]">Compare with Healthy</span><Tg on={cmp} set={setCmp}/></div>
     <button onClick={()=>setFull(true)} className="w-full mt-3 text-[10pt] text-gray-500 dark:text-[#666] border border-gray-200 dark:border-[#2a2a2a] rounded-xl py-2 hover:border-[#0F6E5E] hover:text-[#0F6E5E]">⤢ Full-screen simulation</button></div>
    <div className={card}><div className={`${lab} mb-2`}>Quick metrics</div><Row l="ROM" v={`${rom.toFixed(0)}°`}/><Row l="Speed" v={`${(1.1/cond.speedScale).toFixed(1)}s`}/><Row l="Tremor" v={`${cond.tremorAmplitude}° @ ${cond.tremorFrequency}Hz`}/><Row l="EMG" v={`${(fr[fr.length-1]?.emg??0).toFixed(0)}%`}/></div>
    <div className={card}><div className={`${lab} mb-2`}>Evidence level</div><div className="text-[13pt] font-medium" style={{color:cond.evidenceLevel==='Research only'?'#d97706':cond.evidenceLevel==='Emerging evidence'?'#2563eb':'#0F6E5E'}}>{cond.evidenceLevel==='Research only'?'⚗':cond.evidenceLevel==='Emerging evidence'?'📈':'✓'} {cond.evidenceLevel}</div>
     <p className="text-[10pt] text-gray-400 dark:text-[#555] leading-relaxed mt-2">Simulated profile parameters for research and education only.</p></div></div>
   <div className="flex-1 min-w-0 flex flex-col gap-4">{hand}
    <TrajectoryChart a={view.a} b={view.b} color={cond.color} compare={cmp}/><EMGWaveform a={view.a} b={view.b} color={cond.color}/></div>
   <div className="w-[320px] shrink-0 flex flex-col gap-4"><AIAssessmentPanel c={cond} done={done}/></div></div>
  <div className="text-[9pt] text-gray-400 dark:text-[#444] mt-4">Shortcuts: Space run/stop · 1–9 select condition · C compare · F fullscreen · H healthy</div></div>}

import {useEffect,useRef,useState} from 'react'
import {motion} from 'framer-motion'
import {useHand,smoothed} from '@/store/handStore'
export interface Ex{id:string;name:string;reps:number;desc:string;targetROM?:number[];pitchBase?:number;emgBase?:number;autoFn?:'cycle'|'individual'|'pinch'|'wrist'|'opposition';clinicalNote?:string}
export const EXERCISES:Ex[]=[
 {id:'finger_flexion',name:'Finger Flexion',reps:10,desc:'Grip & release',targetROM:[80,80,80,80,55],autoFn:'cycle'},
 {id:'finger_extension',name:'Finger Extension',reps:10,desc:'Full open spread',targetROM:[15,15,15,15,10],autoFn:'cycle'},
 {id:'individual',name:'Individual Isolation',reps:8,desc:'Finger-by-finger',targetROM:[80,80,80,80,55],autoFn:'individual'},
 {id:'power_grip',name:'Power Grip',reps:12,desc:'Max force hold 3s',targetROM:[85,85,85,85,60],autoFn:'cycle'},
 {id:'pinch',name:'Pinch Grip',reps:10,desc:'Thumb + index',targetROM:[50,20,10,5,55],autoFn:'pinch'},
 {id:'wave',name:'Wrist Flexion',reps:10,desc:'Wrist up/down',targetROM:[20,20,20,20,15],pitchBase:0,autoFn:'wrist'},
 {id:'opposition',name:'Thumb Opposition',reps:10,desc:'Touch each finger to thumb',targetROM:[0,5,5,5,55],emgBase:45,pitchBase:0,autoFn:'opposition',clinicalNote:'ADL function — buttoning clothes, coin handling'},
 {id:'writing_grip',name:'Writing Grip',reps:8,desc:'Pen-hold position',targetROM:[45,40,10,5,50],emgBase:35,pitchBase:-10,autoFn:'pinch',clinicalNote:'Return to writing (common ADL goal)'},
 {id:'key_pinch',name:'Key Pinch',reps:10,desc:'Lateral pinch (key hold)',targetROM:[50,30,20,15,55],emgBase:50,pitchBase:0,autoFn:'pinch',clinicalNote:'Door key, coin use'}]
export type Mode='idle'|'active'|'done'
const N=['INDEX','MIDDLE','RING','PINKY','THUMB'],PH=['OPEN','CLOSE','HOLD','OPEN'],card='bg-[#161616] rounded-xl',lab='text-[9pt] uppercase tracking-[0.2em] text-[#555]'
const pad={padding:'clamp(10px,1.8vh,16px)'}
function Select({sel,on,disabled}:any){const [o,setO]=useState(false),r=useRef<HTMLDivElement>(null)
 useEffect(()=>{const f=(e:MouseEvent)=>{if(!r.current?.contains(e.target as Node))setO(false)};addEventListener('mousedown',f);return()=>removeEventListener('mousedown',f)},[])
 return <div ref={r} className="relative"><button disabled={disabled} onClick={()=>setO(!o)} className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-[11pt] ${disabled?'border-[#1f1f1f] text-[#444]':'border-[#2a2a2a] text-[#f0f0f0] hover:border-[#0F6E5E]'}`}>{sel.name}<span className="text-[#555]">▾</span></button>
 {o&&!disabled&&<div className="absolute left-0 top-full mt-1 min-w-full w-[220px] bg-[#161616] border border-[#0F6E5E] rounded-lg z-50 overflow-hidden">{EXERCISES.map(e=>
  <button key={e.id} onClick={()=>{on(e);setO(false)}} className="w-full text-left px-3 py-2 hover:bg-[#1f1f1f] flex gap-2"><span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{background:e.id===sel.id?'#0F6E5E':'transparent'}}/>
  <span><span className="block text-[10pt]" style={{color:e.id===sel.id?'#0F6E5E':'#f0f0f0'}}>{e.name}</span><span className="block text-[8pt] text-[#555]">{e.desc}</span>
  {e.clinicalNote&&<span className="block text-[7pt] italic text-[#0F6E5E]/70 mt-0.5">{e.clinicalNote}</span>}</span></button>)}</div>}</div>}
function Spark(){const [d,setD]=useState<number[]>([])
 useEffect(()=>{const id=setInterval(()=>setD(p=>[...p.slice(-449),useHand.getState().emg]),66);return()=>clearInterval(id)},[])
 const o=450-d.length,p=d.map((v,i)=>`${i+o},${52-v*.48}`).join(' L')
 return <svg className="w-full h-[56px]" viewBox="0 0 450 56" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0F6E5E" stopOpacity=".15"/><stop offset="1" stopColor="#0F6E5E" stopOpacity="0"/></linearGradient></defs>
 {d.length>1&&<><path d={`M${o},56 L${p} L449,56Z`} fill="url(#g)"/><path d={`M${p}`} fill="none" stroke="#0F6E5E" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></>}</svg>}
export default function MetricsPanel({mode,sel,onSelect,onStart,onStop,tremor}:{mode:Mode;sel:Ex;onSelect:(e:Ex)=>void;onStart:()=>void;onStop:()=>void;tremor:boolean}){
 const s=useHand(),[now,setNow]=useState(Date.now()),[w,setW]=useState(0),[ph,setPh]=useState(0),t=useRef({prev:0,p:0,hold:false})
 useEffect(()=>{const id=setInterval(()=>{setNow(Date.now());setW(smoothed.roll)
  const f=useHand.getState().fingers,m=(f[0]+f[1]+f[2]+f[3])/4,q=t.current,dm=m-q.prev;q.prev=m
  if(m<15)q.p=q.hold?3:0;else if(m>=30&&Math.abs(dm)<1){q.p=2;q.hold=true}else if(dm>1){q.p=1;q.hold=false}
  setPh(q.p)},100);return()=>clearInterval(id)},[])
 const idle=mode==='idle',act=mode==='active',sec=Math.max(0,Math.floor(((act?now:s.sessionEnd??now)-s.sessionStart)/1000))
 const tm=idle?'READY':mode==='done'?'DONE':`${String((sec/60)|0).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`
 const c=(k:string)=>s.repHistory.filter(r=>r===k).length,pct=idle?0:Math.min(100,s.repCount/s.targetReps*100)
 const a=Math.max(-90,Math.min(90,w))*Math.PI/180,emg=Math.round(s.emg),ec=emg>60?'#2ea853':emg>30?'#f5a623':'#555'
 const btn='w-full mt-3 py-2 text-[11pt] uppercase tracking-[0.15em] rounded-md transition-colors duration-200'
 const cell=(l:string,v:any)=><div><div className="text-[9pt] uppercase tracking-[0.15em] text-[#444]">{l}</div><div className="text-[16pt]" style={{color:idle?'#333':'#f0f0f0'}}>{idle?'—':v}</div></div>
 return <aside className="w-[30%] h-full bg-[#111] border-l border-[#1f1f1f] flex flex-col font-mono overflow-hidden" style={{padding:'clamp(12px,2.2vh,24px)',gap:'clamp(6px,1.5vh,16px)'}}>
  <div className="flex justify-between items-center h-10 shrink-0"><Select sel={sel} on={onSelect} disabled={act}/>
   <span className="text-[10pt]" style={{color:mode==='done'?'#2ea853':idle?'#333':'#888'}}>{tm}</span></div>
  <div className={card} style={pad}>
   <div className={lab}>{mode==='done'?'SESSION COMPLETE ✓':'REP'}</div>
   <div className="leading-none my-1"><span className="text-[40pt]" style={{color:idle?'#333':'#f0f0f0'}}>{idle?'——':String(s.repCount).padStart(2,'0')}</span><span className="text-[18pt] text-[#333]"> / {idle?'——':s.targetReps}</span></div>
   <div className="text-[10pt] italic text-[#666]">{mode==='done'?(s.repCount>=s.targetReps?'All reps done':'Stopped early'):sel.name}</div>
   <div className="h-[3px] rounded-full bg-[#1f1f1f] mt-2"><div className="h-full rounded-full transition-all duration-300 ease-out" style={{width:`${pct}%`,background:idle?'#333':'#0F6E5E'}}/></div>
   {!idle&&<div className="text-[9pt] mt-2 flex gap-3"><span style={{color:'#2ea853'}}>● {c('correct')} correct</span><span style={{color:'#f5a623'}}>● {c('partial')} partial</span><span style={{color:'#d9534f'}}>● {c('missed')} missed</span></div>}
   {act?<button onClick={onStop} className={`${btn} border border-red-900 text-[#d9534f] hover:bg-red-950/30`}>STOP &amp; SAVE</button>
    :<button onClick={onStart} className={`${btn} bg-[#0F6E5E] text-white hover:brightness-110`}>{idle?'START SESSION':'START NEW SESSION'}</button>}</div>
  <motion.div initial={false} animate={{height:act?32:0,opacity:act?1:0}} className="overflow-hidden shrink-0"><div className="flex items-start justify-between px-2 h-8">
   {PH.map((p,i)=><div key={i} className="flex items-center flex-1 last:flex-none"><div className="flex flex-col items-center gap-0.5"><span className="w-2 h-2 rounded-full border" style={{background:ph===i?'#0F6E5E':'transparent',borderColor:ph===i?'#0F6E5E':'#333'}}/><span className="text-[7pt]" style={{color:ph===i?'#0F6E5E':'#444',fontWeight:ph===i?700:400}}>{p}</span></div>
   {i<3&&<span className="flex-1 h-px bg-[#222] mx-1 mb-3"/>}</div>)}</div></motion.div>
  <div className={card} style={pad}><div className={`${lab} mb-2`}>FINGERS</div>
   {N.map((n,i)=>{const v=Math.round(s.fingers[i]),dot=v>=65&&v<=85?'#2ea853':v>=50?'#f5a623':'#555'
    return <div key={n} className={`flex items-center h-6 ${i===4?'border-t border-[#1a1a1a]':''}`}><span className="w-1.5 h-1.5 rounded-full mr-2" style={{background:dot}}/>
    <span className="w-12 text-[9pt] text-[#555]">{n}</span><div className="flex-1 h-[2px] bg-[#1a1a1a] mx-2"><div className="h-full" style={{width:`${v/90*100}%`,background:'linear-gradient(90deg,#0a4f44,#0F6E5E)',transition:'width 100ms ease-out'}}/></div>
    <span className="w-9 text-right text-[11pt] text-[#0F6E5E]">{v}°</span></div>})}
   <div className="flex items-center h-7 border-t border-[#1a1a1a]"><span className="w-1.5 mr-2"/><span className="w-12 text-[9pt] text-[#555]">WRIST</span>
    <svg className="flex-1 mx-2" height="20" viewBox="0 0 40 20" preserveAspectRatio="xMidYMid meet"><path d="M2 19A18 18 0 0 1 38 19" fill="none" stroke="#333" strokeWidth="1"/><circle cx={20+18*Math.sin(a)} cy={19-18*Math.cos(a)} r="2" fill="#0F6E5E"/></svg>
    <span className="w-9 text-right text-[11pt] text-[#0F6E5E]">±{Math.abs(Math.round(w))}°</span></div></div>
  <div className={card} style={pad}><div className="grid grid-cols-2 gap-3">
   {cell('AVG ROM',`${Math.round(s.avgROM)}°`)}{cell('CONSISTENCY',`${Math.round(s.consistency)}%`)}{cell('MOVE TIME',`${s.moveTime.toFixed(1)}s`)}
   {cell('EMG SYNC',s.emgLost?<span style={{color:'#f5a623'}}>⚠ –</span>:<span style={{color:'#2ea853'}}>✓ {Math.round(s.emgSync)}%</span>)}</div>
   <div className="flex justify-between items-center border-t border-[#1a1a1a] mt-3 pt-3"><span className="text-[9pt] uppercase tracking-[0.15em] text-[#444]">TREMOR</span>
    <span className="text-[10pt]" style={{color:idle?'#333':tremor?'#f5a623':'#0F6E5E'}}>{idle?'—':tremor?'DETECTED ⚠':'NONE ✓'}</span></div></div>
  <div className={`${card} flex gap-4 border ${s.emgLost?'border-[#f5a623]/30':'border-transparent'} mt-auto`} style={pad}>
   <div className="flex-1 relative"><div className="text-[8pt] text-[#555]">EMG</div><Spark/>
    {s.emgLost&&<div className="absolute inset-0 flex items-center justify-center text-[9pt] text-[#f5a623]">⚠ SIGNAL LOST</div>}</div>
   <div className="w-24"><div className="text-[24pt] leading-none" style={{color:ec}}>{emg}%</div>
    <div className="text-[8pt] text-[#888] mt-2">RMS {(s.emg*.85).toFixed(0)}µV</div><div className="text-[8pt] text-[#888]">SNR {s.emg>20?'18dB':'—'}</div>
    <div className="text-[8pt]" style={{color:s.emgLost?'#f5a623':'#2ea853'}}><span className="text-[#888]">SYN </span>{s.emgLost?'⚠':'✓'}</div></div></div></aside>}

import {useEffect,useRef,useState} from 'react'
import HandScene from './hand/HandScene'
import MetricsPanel,{EXERCISES,Mode,Ex} from './MetricsPanel'
import SimulationPanel from './SimulationPanel'
import {initWebSocket,closeWebSocket} from '@/hooks/useWebSocket'
import {useRepDetection} from '@/hooks/useRepDetection'
import {useHand,sensorRef} from '@/store/handStore'
const avg=(a:number[])=>a.reduce((x,y)=>x+y,0)/a.length
const saved={mode:'idle' as Mode,sel:EXERCISES[0],tremor:false} // survives navigating to other pages and back
type ConnMode='idle'|'live'|'sim' // device connection state, independent of exercise Mode above

// Floating EMG sparkline on the canvas. Reads sensorRef directly on a ref-based
// interval so it never touches React state / never causes a re-render, and works
// identically regardless of idle/live/sim mode (it just shows whatever's in sensorRef).
function EmgMiniTab(){
 const pathRef=useRef<SVGPathElement>(null),valRef=useRef<HTMLSpanElement>(null)
 useEffect(()=>{const buf:number[]=[],N=120,W=76,H=40 // 120 samples @ 50ms = 6s window
  const id=setInterval(()=>{
   const e=sensorRef.current.e
   buf.push(e);if(buf.length>N)buf.shift()
   const step=W/(N-1),off=(N-buf.length)*step
   const pts=buf.map((v,i)=>`${off+i*step},${H-Math.max(0,Math.min(100,v))/100*H}`).join(' L')
   pathRef.current?.setAttribute('d',buf.length>1?`M${pts}`:'')
   if(valRef.current){valRef.current.textContent=`${Math.round(e)}%`
    valRef.current.style.color=e>60?'#2ea853':e>25?'#0F6E5E':'#444'}
  },50);return()=>clearInterval(id)},[])
 return <div className="absolute bottom-4 left-4 z-10 w-[140px] h-[56px] bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl border border-[#1f1f1f] flex items-center px-2 gap-2">
  <svg width="76" height="40" viewBox="0 0 76 40" preserveAspectRatio="none"><path ref={pathRef} fill="none" stroke="#0F6E5E" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></svg>
  <div className="flex flex-col items-start leading-none flex-1">
   <span ref={valRef} className="font-mono text-[16pt]" style={{color:'#444'}}>0%</span>
   <span className="font-mono text-[7pt] uppercase text-[#555] mt-1">EMG</span></div></div>}

export default function SessionPage(){
 useRepDetection()
 const [mode,setMode]=useState<Mode>(saved.mode),[sel,setSel]=useState<Ex>(saved.sel),[tremor,setTremor]=useState(saved.tremor),mr=useRef<Mode>(saved.mode)
 const [connMode,setConnMode]=useState<ConnMode>('idle')
 const go=(m:Mode)=>{saved.mode=m;mr.current=m;setMode(m)}
 const pick=(e:Ex)=>{saved.sel=e;setSel(e)},trem=(v:boolean)=>{saved.tremor=v;setTremor(v)}
 // useRepDetection skips counting while store.sessionEnd is set, so "idle/done" = sessionEnd set; START clears it via reset().
 useEffect(()=>{if(saved.mode!=='active')useHand.getState().set({sessionEnd:Date.now()})},[])
 useEffect(()=>useHand.subscribe(s=>{if(mr.current==='active'&&s.repCount>0&&s.repCount>=s.targetReps){go('done');useHand.getState().set({sessionEnd:Date.now()})}}),[])
 const start=()=>{const st=useHand.getState();st.set({exerciseName:sel.name,targetReps:sel.reps});st.reset();trem(false);go('active')}
 const stop=()=>{useHand.getState().set({sessionEnd:Date.now()});go('done')}
 useEffect(()=>{const b:number[]=[] // tremor: 15-sample window, jitter = median |Δ| / 0.954 (robust std; ignores single steps)
  const id=setInterval(()=>{const f=sensorRef.current.f;b.push(f[0]);if(b.length>15)b.shift()
   if(mr.current!=='active'||b.length<15)return
   const d=b.slice(1).map((x,i)=>Math.abs(x-b[i])).sort((x,y)=>x-y)
   if(d[7]/.954>4&&avg(f.slice(0,4))>50)trem(true)},50);return()=>clearInterval(id)},[])
 // idle: no WS, no sim, hand at rest. live: WS connects (manual — no auto-connect on load). sim: local animation loop below, WS untouched.
 useEffect(()=>{
  if(connMode==='live'){useHand.getState().set({simMode:false});initWebSocket()}
  else if(connMode==='sim'){closeWebSocket();useHand.getState().set({simMode:true})}
  else{closeWebSocket();useHand.getState().set({simMode:false,connected:false});sensorRef.current={t:0,f:[0,0,0,0,0],e:0,roll:0,pitch:0,yaw:0,bat:100}}
  return()=>{if(connMode==='live')closeWebSocket()}
 },[connMode])
 useEffect(()=>{let raf=0
  const loop=()=>{const st=useHand.getState()
   if(st.simMode){const s=st.sim,now=Date.now();let f=s.f.slice(),autoPitch=0
    if(s.auto){
     const ex=EXERCISES.find(e=>e.name===st.exerciseName)||EXERCISES[0],T=ex.targetROM??[75,75,75,75,50],fn=ex.autoFn??'cycle'
     const cyc=(now/2000)|0,phase=cyc%3,on=phase!==2 // 0:close 1:hold 2:open — mirrors REP phase indicator in MetricsPanel
     if(fn==='individual'){const idx=cyc%4;f=[0,1,2,3].map(i=>on&&i===idx?T[i]:0);f[4]=on?T[4]*.3:0}
     else if(fn==='pinch'){f=[on?T[0]:0,on?T[1]:0,0,0,on?T[4]:0]}
     else if(fn==='opposition'){const idx=cyc%4;f=[0,1,2,3].map(i=>on&&i===idx?60:0);f[4]=on?T[4]:0}
     else if(fn==='wrist'){f=T.map(v=>v*.3);autoPitch=35*Math.sin(now/1000)}
     else{f=T.map(v=>on?v:0)}
     if(fn!=='wrist')autoPitch=Math.sin(now/3000)*4 // subtle natural wrist sway during hand exercises
    }
    const n=()=>s.noiseOn?Math.sin(now/200)*s.noise*.5+(Math.random()-.5)*s.noise:0
    f=f.map(a=>Math.max(0,Math.min(90,a+n())))
    sensorRef.current={t:now,f,e:Math.min(100,Math.max(s.emg,avg(f.slice(0,4))/90*70)+n()*2),roll:s.roll+(s.preset==='WAVE'?Math.sin(now/400)*25:0),pitch:s.pitch+(s.auto?autoPitch:0),yaw:s.yaw,bat:100}}
   raf=requestAnimationFrame(loop)}
  raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)},[])
 const idleDevice=connMode==='idle',btn='flex items-center gap-2 rounded-xl px-8 py-4 text-[14pt] font-mono tracking-wide'
 return <div className="h-full w-full overflow-hidden bg-[#0a0a0a] flex"><div className="w-[70%] h-full relative">
  <HandScene/>
  <EmgMiniTab/>
  {idleDevice&&<div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center gap-6">
   <div className="flex flex-col items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F6E5E" strokeWidth="1.4"><path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11M10 11V5a1.5 1.5 0 0 1 3 0v6M13 11V6a1.5 1.5 0 0 1 3 0v6M16 9.5a1.5 1.5 0 0 1 3 0V15c0 3.3-2.7 6-6 6h-1.5c-1.9 0-3-.6-4-2L5 15.5"/></svg>
    <span className="font-mono text-[11pt]" style={{color:'#888'}}>Ready to begin</span></div>
   <div className="flex items-center gap-4">
    <button onClick={()=>setConnMode('live')} className={`${btn} text-white hover:brightness-110`} style={{background:'#0F6E5E'}}>
     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.5a11 11 0 0 1 14 0M8 16a6.3 6.3 0 0 1 8 0M12 19.4h.01"/></svg>
     CONNECT TO DEVICE</button>
    <button onClick={()=>setConnMode('sim')} className={`${btn} border hover:bg-[#0F6E5E]/10`} style={{borderColor:'#0F6E5E',color:'#0F6E5E'}}>
     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l14 8-14 8V4z"/></svg>
     RUN SIMULATION</button></div></div>}
  {connMode==='live'&&<button onClick={()=>setConnMode('idle')} className="absolute top-4 right-4 z-10 font-mono text-[8pt] text-[#555] hover:text-[#d9534f] border border-[#2a2a2a] rounded-md px-2 py-1">Disconnect</button>}
  {connMode==='sim'&&<button onClick={()=>setConnMode('idle')} className="absolute top-4 right-4 z-10 font-mono text-[8pt] text-[#555] hover:text-[#0F6E5E] border border-[#2a2a2a] rounded-md px-2 py-1">Exit Simulation</button>}
 </div>
 <MetricsPanel mode={mode} sel={sel} onSelect={pick} onStart={start} onStop={stop} tremor={tremor}/><SimulationPanel/></div>}

import {useEffect,useState} from 'react'
import {useHand,sensorRef} from '@/store/handStore'
export default function ConnectionOverlay(){
 const sim=useHand(s=>s.simMode),c=useHand(s=>s.connected),[hz,setHz]=useState(0),[stale,setStale]=useState(false)
 useEffect(()=>{let raf=0,lt=-1,last=Date.now();const n:number[]=[]
  const loop=()=>{const t=sensorRef.current.t;if(t!==lt){lt=t;last=Date.now();n.push(last)};raf=requestAnimationFrame(loop)} // freshness uses local arrival time, not device clock
  raf=requestAnimationFrame(loop)
  const id=setInterval(()=>{const now=Date.now();while(n.length&&now-n[0]>1000)n.shift();setHz(n.length);setStale(now-last>2000)},500)
  return()=>{cancelAnimationFrame(raf);clearInterval(id)}},[])
 const [t,col]=sim?['SIM','#0F6E5E']:!c?['OFFLINE','#d9534f']:stale?['STALE','#f5a623']:['LIVE','#2ea853']
 return <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[9pt]" style={{color:col}}><span className="w-1.5 h-1.5 rounded-full" style={{background:col}}/>{t}
 {!sim&&c&&<span className="text-[8pt]" style={{color:hz<5?'#f5a623':'#333'}}>{hz}Hz</span>}</div>}

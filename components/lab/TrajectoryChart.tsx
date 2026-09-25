'use client'
import {useState} from 'react'
import {SimFrame} from '@/types/lab.types'
const COL=['#0F6E5E','#3b82f6','#22c55e','#f97316'],NM=['ALL','INDEX','MIDDLE','RING','PINKY'],X=(t:number)=>30+t/10000*560,Y=(v:number)=>120-v/90*110
const pts=(fr:SimFrame[],i:number)=>fr.filter((_,k)=>k%2===0).map(f=>[X(f.t).toFixed(1),Y(f.fingers[i]).toFixed(1)])
const line=(fr:SimFrame[],i:number)=>pts(fr,i).map((p,k)=>`${k?'L':'M'}${p[0]},${p[1]}`).join(' ')
export default function TrajectoryChart({a,b,color,compare}:{a:SimFrame[];b:SimFrame[];color:string;compare:boolean}){
 const [tab,setTab]=useState(0),i=tab-1
 const area=tab>0&&compare&&a.length>1?`${line(a,i)} ${pts(b.slice(0,a.length),i).reverse().map(p=>`L${p[0]},${p[1]}`).join(' ')}Z`:''
 return <div className="bg-white dark:bg-[#161616] rounded-2xl p-5 border border-gray-100 dark:border-[#1f1f1f] shadow-sm dark:shadow-none"><div className="text-[12pt] font-bold text-gray-900 dark:text-[#f0f0f0]">FINGER TRAJECTORY</div><div className="text-[10pt] text-gray-500 dark:text-[#666]">Simulated 10 seconds of movement</div>
  <div className="flex gap-3 mt-3">{NM.map((n,k)=><button key={n} onClick={()=>setTab(k)} className={`text-[10pt] pb-1 border-b-2 ${tab===k?'text-[#0F6E5E] border-[#0F6E5E]':'text-gray-400 dark:text-[#555] border-transparent'}`}>{n}</button>)}</div>
  <svg viewBox="0 0 600 140" className="w-full mt-3 bg-[#fafafa] dark:bg-[#0d0d0d] rounded-lg">{[0,30,60,90].map(v=><g key={v}><line x1="30" x2="590" y1={Y(v)} y2={Y(v)} stroke="#f3f4f6"/><text x="24" y={Y(v)+3} textAnchor="end" fontSize="9" fill="#9ca3af">{v}°</text></g>)}
   {[0,2,4,6,8,10].map(s=><text key={s} x={X(s*1000)} y="135" textAnchor="middle" fontSize="9" fill="#9ca3af">{s}s</text>)}
   {tab===0?[0,1,2,3].map(k=><path key={k} d={line(a,k)} fill="none" stroke={COL[k]} strokeWidth="1.5"/>)
   :<>{area&&<path d={area} fill={color} opacity=".08"/>}{compare&&<path d={line(b,i)} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4 3"/>}<path d={line(a,i)} fill="none" stroke={color} strokeWidth="2"/></>}</svg></div>}

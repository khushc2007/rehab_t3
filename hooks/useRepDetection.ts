import {useEffect} from 'react'
import {useHand,sensorRef} from '@/store/handStore'
const avg=(a:number[])=>a.reduce((x,y)=>x+y,0)/(a.length||1)
// Throttled (15Hz) bridge from the sensor ref to Zustand + rep/metric detection.
export function useRepDetection(){useEffect(()=>{
 let on=false,peak=0,t0=0,tp=0,lastE=-1,lastT=Date.now();const H:number[][]=[],peaks:number[]=[],durs:number[]=[]
 const id=setInterval(()=>{
  const st=useHand.getState(),fr=sensorRef.current,now=Date.now(),m=avg(fr.f.slice(0,4)),u:any={fingers:fr.f.slice(),emg:fr.e,battery:fr.bat}
  if(fr.e!==lastE){lastE=fr.e;lastT=now}
  if(!st.repCount&&peaks.length){peaks.length=0;durs.length=0;on=false}
  H.push([m,fr.e]);if(H.length>150)H.shift()
  if(!st.sessionEnd){
   if(!on&&m>15){on=true;peak=0;t0=now}
   if(on){if(m>peak){peak=m;tp=now}
    if(m<10){on=false;if(st.repCount<st.targetReps){
     const r=peak>=65&&peak<=85?'correct':peak>=30?'partial':'missed'
     if(r!=='missed'){peaks.push(peak);durs.push((tp-t0)/1000)}
     const mean=avg(peaks),sd=Math.sqrt(avg(peaks.map(p=>(p-mean)**2)))
     Object.assign(u,{repCount:st.repCount+1,repHistory:[...st.repHistory,r],avgROM:mean,consistency:mean?Math.max(0,100*(1-sd/mean)):0,moveTime:avg(durs)})}}}}
  const mx=avg(H.map(h=>h[0])),my=avg(H.map(h=>h[1]));let a=0,b=0,c=0
  H.forEach(([x,y])=>{a+=(x-mx)*(y-my);b+=(x-mx)**2;c+=(y-my)**2})
  u.emgSync=b&&c?Math.max(0,a/Math.sqrt(b*c))*100:0;u.emgLost=!st.simMode&&now-lastT>1500
  st.set(u)},66)
 return()=>clearInterval(id)},[])}

import {useEffect} from 'react'
import {useHand,sensorRef} from '@/store/handStore'
const URL_=process.env.NEXT_PUBLIC_WS_URL||'ws://localhost:3001/ws',R=180/Math.PI
const yawOff={v:0}
// Sensor assumed Y-up (gravity on Y): roll = about Z, pitch = about X, yaw = about Y. Press "R" to zero yaw.
export function useWebSocket(){
const sim=useHand(s=>s.simMode)
useEffect(()=>{
 if(sim)return
 let ws:WebSocket,att=0,timer:any,dead=false,lt=0,roll=0,pitch=0,yaw=0
 const key=(e:KeyboardEvent)=>{if(e.key==='r')yawOff.v=yaw};addEventListener('keydown',key)
 const connect=()=>{if(dead)return
  ws=new WebSocket(URL_)
  ws.onopen=()=>{att=0;useHand.getState().set({connected:true})}
  ws.onclose=()=>{useHand.getState().set({connected:false});if(!dead&&att<10)timer=setTimeout(connect,Math.min(30000,1000*2**att++))}
  ws.onerror=()=>ws.close()
  ws.onmessage=e=>{let m:any;try{m=JSON.parse(e.data)}catch{return}
   const dt=lt?Math.min((m.t-lt)/1000,.2):.02;lt=m.t
   const rA=Math.atan2(m.ax,m.ay)*R,pA=Math.atan2(m.az,Math.hypot(m.ax,m.ay))*R
   roll=.96*(roll+m.gz*dt)+.04*rA;pitch=.96*(pitch+m.gx*dt)+.04*pA;yaw+=m.gy*dt
   sensorRef.current={t:m.t,f:m.f.map((a:number)=>Math.max(0,Math.min(90,a))),e:m.e,roll,pitch,yaw:yaw-yawOff.v,bat:m.bat}}}
 connect()
 return()=>{dead=true;clearTimeout(timer);removeEventListener('keydown',key);ws?.close();useHand.getState().set({connected:false})}
},[sim])}

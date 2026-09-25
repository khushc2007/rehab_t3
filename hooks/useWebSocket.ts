import {useHand,sensorRef} from '@/store/handStore'
const URL_=process.env.NEXT_PUBLIC_WS_URL||'ws://localhost:3001/ws',R=180/Math.PI
const yawOff={v:0}
// Sensor assumed Y-up (gravity on Y): roll = about Z, pitch = about X, yaw = about Y. Press "R" to zero yaw.
export const wsStatus={current:'idle' as 'idle'|'connecting'|'connected'|'reconnecting'}
let ws:WebSocket|undefined,att=0,timer:any,dead=true,lt=0,roll=0,pitch=0,yaw=0,keyBound=false
const key=(e:KeyboardEvent)=>{if(e.key==='r')yawOff.v=yaw}
// Manually started/stopped by SessionPage — no auto-connect on load.
export function initWebSocket(){
 dead=false;att=0;lt=0;roll=0;pitch=0;yaw=0
 if(!keyBound){addEventListener('keydown',key);keyBound=true}
 const connect=()=>{if(dead)return
  wsStatus.current=att>0?'reconnecting':'connecting'
  const sock=new WebSocket(URL_);ws=sock
  sock.onopen=()=>{att=0;wsStatus.current='connected';useHand.getState().set({connected:true})}
  sock.onclose=()=>{useHand.getState().set({connected:false})
   if(dead){wsStatus.current='idle';return}
   wsStatus.current='reconnecting'
   if(att<10)timer=setTimeout(connect,Math.min(30000,1000*2**att++))}
  sock.onerror=()=>sock.close()
  sock.onmessage=e=>{let m:any;try{m=JSON.parse(e.data)}catch{return}
   const imu=m.imu||{},ax=imu.ax??0,ay=imu.ay??0,az=imu.az??0,gx=imu.gx??0,gy=imu.gy??0,gz=imu.gz??0
   const dt=lt?Math.min((m.timestamp-lt)/1000,.2):.02;lt=m.timestamp
   const rA=Math.atan2(ax,ay)*R,pA=Math.atan2(az,Math.hypot(ax,ay))*R
   roll=.96*(roll+gz*dt)+.04*rA;pitch=.96*(pitch+gx*dt)+.04*pA;yaw+=gy*dt
   // flex[] values are already final calibrated angles — written straight through, no conversion.
   sensorRef.current={t:m.timestamp,f:m.flex,e:m.emg?.value??0,roll,pitch,yaw:yaw-yawOff.v,bat:m.battery}}}
 connect()
}
export function closeWebSocket(){
 dead=true;clearTimeout(timer);wsStatus.current='idle'
 if(keyBound){removeEventListener('keydown',key);keyBound=false}
 ws?.close();ws=undefined
 useHand.getState().set({connected:false})
}

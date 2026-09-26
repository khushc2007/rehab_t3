import {useHand,sensorRef} from '@/store/handStore'
const URL_=process.env.NEXT_PUBLIC_WS_URL||'ws://localhost:3001/ws',R=180/Math.PI
const yawOff={v:0}
// Sensor assumed Y-up (gravity on Y): roll = about Z, pitch = about X, yaw = about Y. Press "R" to zero yaw.
export const wsStatus={current:'idle' as 'idle'|'connecting'|'connected'|'reconnecting'|'offline'}
let ws:WebSocket|undefined,att=0,timer:any,ping:any,dead=true,lt=0,roll=0,pitch=0,yaw=0,keyBound=false
const key=(e:KeyboardEvent)=>{if(e.key==='r')yawOff.v=yaw}
// Manually started/stopped by SessionPage — no auto-connect on load.
export function initWebSocket(){
 dead=false;att=0;lt=0;roll=0;pitch=0;yaw=0
 if(!keyBound){addEventListener('keydown',key);keyBound=true}
 const connect=()=>{if(dead)return
  wsStatus.current=att>0?'reconnecting':'connecting'
  const sock=new WebSocket(URL_);ws=sock
  sock.onopen=()=>{att=0;wsStatus.current='connected'
   // Keepalive: Render's free tier sleeps after 15min idle.
   ping=setInterval(()=>{if(sock.readyState===WebSocket.OPEN)sock.send(JSON.stringify({type:'ping'}))},25000)}
  sock.onclose=()=>{clearInterval(ping)
   if(dead){wsStatus.current='idle';useHand.getState().set({connected:false});return}
   if(att>=10){wsStatus.current='offline';useHand.getState().set({connected:false});return}
   wsStatus.current='reconnecting';useHand.getState().set({connected:false})
   timer=setTimeout(connect,Math.min(30000,1000*2**att++))}
  sock.onerror=()=>sock.close()
  sock.onmessage=e=>{let m:any;try{m=JSON.parse(e.data)}catch{return}
   // sensor_data (live) and sensor_data_cached (one-shot replay on connect) are handled identically.
   if(m.type==='sensor_data'||m.type==='sensor_data_cached'){
    if(!Array.isArray(m.flex)||m.flex.length!==5)return
    const imu=m.imu||{},ax=imu.ax??0,ay=imu.ay??0,az=imu.az??0,gx=imu.gx??0,gy=imu.gy??0,gz=imu.gz??0
    const dt=lt?Math.min((m.timestamp-lt)/1000,.2):.02;lt=m.timestamp
    const rA=Math.atan2(ax,ay)*R,pA=Math.atan2(az,Math.hypot(ax,ay))*R
    roll=.96*(roll+gz*dt)+.04*rA;pitch=.96*(pitch+gx*dt)+.04*pA;yaw+=gy*dt
    // flex[] values are already final calibrated angles (idx,mid,ring,pinky,thumb) — written straight through, no conversion.
    sensorRef.current={t:m.timestamp,f:m.flex,e:m.emg?.value??0,roll,pitch,yaw:yaw-yawOff.v,bat:m.battery??100}
    // Receiving real data is itself proof the device is live — mirrors an explicit device_status:'online'.
    useHand.getState().set({connected:true,battery:m.battery??100})
   }
   else if(m.type==='device_status'){
    useHand.getState().set({connected:m.status==='online'})
    if(m.status==='offline')console.log('ESP32 disconnected from relay') // hand freezes at last pose — sensorRef untouched
    if(m.status==='stale')console.warn('Device stale — connected but no data received')
   }}}
 connect()
}
export function closeWebSocket(){
 dead=true;clearTimeout(timer);clearInterval(ping);wsStatus.current='idle'
 if(keyBound){removeEventListener('keydown',key);keyBound=false}
 ws?.close();ws=undefined
 useHand.getState().set({connected:false})
}

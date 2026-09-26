'use client'
import {useEffect} from 'react'
// Passive HTTP ping so Render's free tier doesn't sleep while the dashboard sits idle
// (connMode==='idle', WebSocket closed). Independent of WS state — never touches
// hooks/useWebSocket.ts or sensor data, fire-and-forget, no UI.
export default function HealthKeepalive(){
 useEffect(()=>{
  const ping=setInterval(()=>{
   fetch('https://rehab-t3-render.onrender.com/health',{method:'GET',cache:'no-store'}).catch(()=>{})
  },10*60*1000)
  return()=>clearInterval(ping)
 },[])
 return null
}

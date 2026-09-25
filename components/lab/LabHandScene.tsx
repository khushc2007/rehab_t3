'use client'
import {Suspense} from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import HandModel from '@/components/hand/HandModel'
import {SensorFrame} from '@/types/sensor'
type Src={current:SensorFrame}
const blend=(hex:string,k:number)=>{const n=parseInt(hex.slice(1),16),m=(s:number)=>Math.round(((n>>s)&255)*(1-k)+255*k);return `rgb(${m(16)},${m(8)},${m(0)})`} // condition colour mixed 50% with white
function Scene({src,color}:{src:Src;color:string}){
 return <Canvas shadows dpr={[1,2]} camera={{fov:45,position:[1.5,2.2,4.5]}} onCreated={({gl})=>{(gl as any).useLegacyLights=true}}>
  <color attach="background" args={['#0f1923']}/><ambientLight intensity={.3} color="#1a2a3a"/>
  <directionalLight position={[-3,4,2]} intensity={1.8} color={blend(color,.5)} castShadow shadow-mapSize={[1024,1024]}/>
  <directionalLight position={[2,1,1]} intensity={.35}/><pointLight position={[-2,3,-1]} intensity={2} color={color} distance={6}/>
  <Suspense fallback={null}><HandModel source={src}/></Suspense>
  <OrbitControls enablePan={false} enableDamping target={[0,0,.3]} minDistance={2} maxDistance={9}/></Canvas>}
export default function LabHandScene({label,color,src,src2,compare,running,fullscreen,onToggleFullscreen,splitPercent=50,onDragStart,label2='Reference',overlay}:
 {label:string;color:string;src:Src;src2:Src;compare:boolean;running:boolean;fullscreen?:boolean;onToggleFullscreen?:()=>void;splitPercent?:number;onDragStart?:(e:React.MouseEvent)=>void;label2?:string;overlay?:React.ReactNode}){
 return <div className={`bg-[#0f1923] overflow-hidden flex flex-col relative ${fullscreen?'h-full w-full':'rounded-2xl h-[340px]'}`}>
  <div className="h-8 bg-[#0a0a0a]/60 flex items-center px-4 gap-3 shrink-0 font-mono text-[9pt] text-[#f0f0f0] z-10">
   <span className="w-2 h-2 rounded-full" style={{background:color}}/>{label}<span className="text-[8pt] text-[#0F6E5E]">{running?'SIM':'READY'}</span>
   {onToggleFullscreen&&<button aria-label={fullscreen?'Exit fullscreen':'Fullscreen'} onClick={onToggleFullscreen} className="ml-auto text-[#666] hover:text-[#0F6E5E]">
    {fullscreen?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>
    :<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 9V4h5M15 4h5v5M4 15v5h5M15 20h5v-5"/></svg>}</button>}</div>
  <div className="flex-1 relative min-h-0">
   <div className="absolute inset-0" style={{clipPath:compare?`inset(0 ${100-splitPercent}% 0 0)`:undefined}}><Scene src={src} color={color}/></div>
   {compare&&<>
    <div className="absolute inset-0" style={{clipPath:`inset(0 0 0 ${splitPercent}%)`}}><Scene src={src2} color="#0F6E5E"/><span className="absolute top-2 left-3 font-mono text-[8pt] text-[#0F6E5E]">{label2}</span></div>
    <div className="absolute inset-y-0 z-20 flex items-center justify-center cursor-col-resize select-none" style={{left:`calc(${splitPercent}% - 12px)`,width:24}} onMouseDown={onDragStart}>
     <div className="w-px h-full bg-white/40 absolute left-1/2 -translate-x-1/2"/>
     <div className="w-6 h-12 bg-white/10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm">
      <div className="flex gap-0.5"><div className="w-0.5 h-4 bg-white/50 rounded"/><div className="w-0.5 h-4 bg-white/50 rounded"/></div></div></div></>}
   {overlay}
  </div></div>}

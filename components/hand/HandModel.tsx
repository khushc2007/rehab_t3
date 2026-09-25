import {useRef,useMemo,useEffect} from 'react'
import {useFrame} from '@react-three/fiber'
import {Html,RoundedBox,Text} from '@react-three/drei'
import * as THREE from 'three'
import {sensorRef,smoothed,useHand} from '@/store/handStore'
const D=Math.PI/180,S=1.9
// Fingers point -Z, forearm extends +Z toward camera, palm down, thumb on -X. Local +Z of a bone = dorsal (top).
const FING=[{x:-.6,L:[.9,.65,.42],R:[.095,.085,.072],w:[.4,.4,.2]},{x:-.2,L:[1,.7,.45],R:[.1,.09,.075],w:[.4,.4,.2]},
{x:.2,L:[.92,.66,.43],R:[.093,.083,.07],w:[.4,.4,.2]},{x:.6,L:[.68,.5,.33],R:[.078,.068,.058],w:[.4,.4,.2]}]
const THUMB={x:-.85,L:[.7,.5],R:[.11,.09],w:[0,.5]}
function useMats(){
 const m=useMemo(()=>{
  const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d')!
  g.fillStyle='#1a1a1a';g.fillRect(0,0,256,256)
  for(let i=0;i<256;i+=4){g.fillStyle=(i/4)%2?'#222':'#1a1a1a';g.fillRect(i,0,1,256);g.fillRect(0,i,256,1)}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,6)
  const M=(o:any)=>new THREE.MeshStandardMaterial(o)
  return {t,glove:M({color:'#1c1c1c',roughness:.85,metalness:0,bumpMap:t,bumpScale:.8,envMapIntensity:.8}),edge:M({color:'#222',roughness:.95}),
   skin:new THREE.MeshPhysicalMaterial({color:'#c68642',roughness:.65,sheen:.6,sheenColor:new THREE.Color('#ff9a7a'),sheenRoughness:.5}),
   strip:M({color:'#8B6914',roughness:.35,metalness:.45,envMapIntensity:1.2}),contact:M({color:'#D4A840',roughness:.25,metalness:.6,emissive:new THREE.Color('#2a1800'),emissiveIntensity:.3}),nail:M({color:'#e8d5c0',roughness:.3,metalness:.05}),
   box:M({color:'#141414',roughness:.85}),wire:M({color:'#0c0c0c',roughness:.7}),pad:M({color:'#d0d0d0',roughness:.3}),
   led:M({color:'#0F6E5E',emissive:new THREE.Color('#0F6E5E'),emissiveIntensity:2})}
 },[])
 useEffect(()=>()=>{Object.values(m).forEach((x:any)=>x.dispose?.())},[m])
 return m}
function Chain({c,i,idx,rots,labs,mat}:any){
 const {L,R}=c,r0=R[i]*S,r1=(R[i+1]??R[i]*.8)*S,last=i===L.length-1,m=last?mat.skin:mat.glove,zt=(r0+r1)/2*.88+.004
 return <group ref={(g:any)=>{rots[i]=g}} position-y={i?L[i-1]:0}>
  <mesh castShadow material={m} scale={[1.1,1,.85]}><sphereGeometry args={[r0*1.02,16,16]}/></mesh>
  <mesh castShadow material={m} position-y={L[i]/2} scale={[1,1,.88]}><cylinderGeometry args={[r1,r0,L[i],16]}/></mesh>
  {!last&&<group position={[0,L[i]/2,zt]}><mesh material={mat.strip}><boxGeometry args={[.07,L[i]*.86,.01]}/></mesh>
   {[-1,0,1].map(k=><mesh key={k} material={mat.contact} position={[0,k*L[i]*.27,.006]}><boxGeometry args={[.05,L[i]*.17,.006]}/></mesh>)}</group>}
  {last?<group position-y={L[i]}>
    <mesh castShadow material={mat.skin} scale={[1,1,.88]}><sphereGeometry args={[r1,16,16]}/></mesh>
    <mesh material={mat.nail} position={[0,-L[i]*.35,zt]}><boxGeometry args={[r1*1.6,L[i]*.7,.03]}/></mesh>
    <Html center style={{pointerEvents:'none'}} position={[0,.25,.3]}><span ref={(e:any)=>{labs[idx]=e}} className="font-mono text-[10pt] text-[#0F6E5E]" style={{opacity:0}}/></Html>
  </group>:<Chain c={c} i={i+1} idx={idx} rots={rots} labs={labs} mat={mat}/>}
 </group>}
function Wires({mat}:any){
 const g=useMemo(()=>{
  const T=(p:number[][],r=.012)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p.map(v=>new THREE.Vector3(v[0],v[1],v[2]))),24,r,8,false)
  return [...FING.map(c=>T([[c.x,.18,-1.05],[c.x*.6,.3,-.4],[c.x*.25,.34,.4],[0,.34,.95]])),T([[THUMB.x,.18,-.3],[-.5,.3,.1],[-.2,.34,.6],[0,.34,.95]]),
   T([[0,.5,1.45],[.3,.45,1.9],[.1,.62,2.35]],.014),T([[.15,.62,2.66],[.25,.62,2.8],[.2,.6,2.95]],.008),T([[0,.62,2.66],[-.1,.62,2.9],[-.15,.6,3.15]],.008)]
 },[]);useEffect(()=>()=>g.forEach(x=>x.dispose()),[g])
 return <>{g.map((x,i)=><mesh key={i} geometry={x} material={mat.wire} castShadow/>)}</>}
const Label=({y,z}:any)=><Text position={[0,y,z]} rotation-x={-Math.PI/2} fontSize={.06} color="#888" anchorX="center" anchorY="middle">RehabGrip</Text>
export default function HandModel({source}:{source?:{current:typeof sensorRef.current}}={}){
 const mat=useMats(),root=useRef<THREE.Group>(null),glow=useRef<THREE.PointLight>(null),splay=useRef<THREE.Group>(null)
 const rots=useRef<any[][]>([[],[],[],[],[]]).current,labs=useRef<any[]>([]).current,sm=useRef({f:[0,0,0,0,0],roll:0,pitch:0,yaw:0,e:0}).current
 useFrame((st,dt)=>{
  const k=1-Math.pow(1-useHand.getState().sim.speed,Math.min(dt,.1)*60),d=(source??sensorRef).current,L=THREE.MathUtils.lerp
  for(let i=0;i<5;i++){sm.f[i]=L(sm.f[i],d.f[i],k)
   const w=(i<4?FING[i]:THUMB).w;w.forEach((x,j)=>{if(rots[i][j])rots[i][j].rotation.x=-sm.f[i]*D*x})
   const el=labs[i];if(el){el.textContent=Math.round(sm.f[i])+'°';el.style.opacity=String(Math.min(1,Math.max(0,(sm.f[i]-5)/10)))}}
  if(splay.current)splay.current.rotation.y=35*D-sm.f[4]*D*.5
  sm.roll=L(sm.roll,d.roll,k);sm.pitch=L(sm.pitch,d.pitch,k);sm.yaw=L(sm.yaw,d.yaw,k);sm.e=L(sm.e,d.e,k)
  Object.assign(smoothed,{roll:sm.roll,pitch:sm.pitch,yaw:sm.yaw})
  root.current?.rotation.set(sm.pitch*D,sm.yaw*D,sm.roll*D)
  mat.led.emissiveIntensity=1.5+Math.sin(performance.now()/800)*.5
  const on=sm.e>30;if(glow.current)glow.current.intensity=.3+sm.e/100*2.2
  const fog=st.scene.fog as THREE.FogExp2;if(fog)fog.density=L(fog.density,.04+(on?sm.e/100*.03:0),.05)})
 return <group ref={root} scale={.5}>
  <RoundedBox args={[1.8,.35,2.2]} radius={.16} smoothness={4} castShadow material={mat.glove}/>
  {[-.6,-.1,.4].map(z=><mesh key={z} position={[0,.185,z]} material={mat.glove}><boxGeometry args={[1.86,.03,.15]}/></mesh>)}
  {FING.map(c=><mesh key={c.x} position={[c.x,.14,-.95]} castShadow material={mat.edge}><boxGeometry args={[.16,.1,.1]}/></mesh>)}
  <mesh castShadow material={mat.glove} position={[0,0,1.15]} scale={[1,.85,1]}><sphereGeometry args={[.52,20,20]}/></mesh>
  <mesh castShadow material={mat.skin} position={[0,0,1.8]} rotation-x={Math.PI/2} scale={[1.05,1,.9]}><cylinderGeometry args={[.7,.55,2.8,20]}/></mesh>
  <mesh castShadow material={mat.glove} position={[0,0,1.4]} rotation-x={Math.PI/2} scale={[1.05,1,.9]}><cylinderGeometry args={[.64,.6,.9,24]}/></mesh>
  <mesh material={mat.glove} position={[0,0,1.85]} scale={[1.05,.9,1]}><torusGeometry args={[.64,.04,8,32]}/></mesh>
  <mesh material={mat.glove} position={[0,0,1.2]} scale={[1.05,.9,1]}><torusGeometry args={[.6,.05,8,32]}/></mesh>
  <mesh castShadow material={mat.box} position={[0,.52,1.2]}><boxGeometry args={[.55,.2,.42]}/></mesh>
  <Label y={.622} z={1.1}/>
  <mesh material={mat.led} position={[0,.624,1.33]}><boxGeometry args={[.15,.008,.015]}/></mesh>
  <pointLight position={[0,.7,1.33]} color="#0F6E5E" intensity={.4} distance={.5}/>
  <mesh material={mat.glove} position={[0,0,2.5]} scale={[1.05,.9,1]}><torusGeometry args={[.68,.05,8,32]}/></mesh>
  <mesh castShadow material={mat.box} position={[.1,.68,2.5]}><boxGeometry args={[.42,.15,.32]}/></mesh>
  <Text position={[.1,.757,2.47]} rotation-x={-Math.PI/2} fontSize={.05} color="#888" anchorX="center" anchorY="middle">RehabGrip</Text>
  <mesh material={mat.led} position={[.26,.759,2.6]}><boxGeometry args={[.03,.008,.03]}/></mesh>
  {[[.2,.6,2.95],[-.15,.6,3.15]].map((p,i)=><mesh key={i} material={mat.pad} position={p as any}><cylinderGeometry args={[.09,.09,.008,32]}/></mesh>)}
  <Wires mat={mat}/>
  <pointLight ref={glow} position={[0,0,2]} color="#0F6E5E" distance={4} intensity={.3}/>
  {FING.map((c,i)=><group key={i} position={[c.x,0,-1.1]} rotation-x={-Math.PI/2}><Chain c={c} i={0} idx={i} rots={rots[i]} labs={labs} mat={mat}/></group>)}
  <group ref={splay} position={[THUMB.x,0,-.2]} rotation-y={35*D}><group rotation-x={-Math.PI/2}><Chain c={THUMB} i={0} idx={4} rots={rots[4]} labs={labs} mat={mat}/></group></group>
 </group>}

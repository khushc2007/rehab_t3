import {useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {smoothed} from '@/store/handStore'
const D=Math.PI/180
function Cube(){const g=useRef<THREE.Group>(null)
 useFrame(()=>g.current?.rotation.set(smoothed.pitch*D,smoothed.yaw*D,smoothed.roll*D))
 return <group ref={g}><mesh><boxGeometry args={[.9,.9,.9]}/><meshStandardMaterial color="#fff"/></mesh><axesHelper args={[1.5]}/></group>}
export default function OrientationWidget(){
 return <div className="absolute bottom-10 left-4"><div className="font-mono text-[8pt] text-[#555] mb-1">ORIENTATION</div>
 <div style={{width:80,height:80,background:'rgba(17,17,17,.3)'}}><Canvas camera={{position:[3,2,3.5],fov:40}}><ambientLight intensity={.8}/><directionalLight position={[2,3,2]}/><Cube/></Canvas></div></div>}

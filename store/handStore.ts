import {create} from 'zustand'
import {SensorFrame,SimState,Rep} from '@/types/sensor'
// Hot path: sensor data lives in refs/module objects, never in React state.
export const sensorRef={current:{t:0,f:[0,0,0,0,0],e:0,roll:0,pitch:0,yaw:0,bat:100} as SensorFrame}
export const smoothed={roll:0,pitch:0,yaw:0}
const fresh=()=>({repCount:0,repHistory:[] as Rep[],sessionStart:Date.now(),sessionEnd:null as number|null,avgROM:0,consistency:0,moveTime:0,emgSync:0,emgLost:false})
export interface HandState{connected:boolean;simMode:boolean;sim:SimState;fingers:number[];emg:number;battery:number;targetReps:number;exerciseName:string;activePatientId:string|null;
repCount:number;repHistory:Rep[];sessionStart:number;sessionEnd:number|null;avgROM:number;consistency:number;moveTime:number;emgSync:number;emgLost:boolean;
set:(p:Partial<HandState>)=>void;setSim:(p:Partial<SimState>)=>void;reset:()=>void}
export const useHand=create<HandState>(s=>({connected:false,simMode:!process.env.NEXT_PUBLIC_WS_URL,
sim:{f:[0,0,0,0,0],emg:0,roll:0,pitch:0,yaw:0,speed:.11,noise:0,noiseOn:false,auto:true,preset:''},
fingers:[0,0,0,0,0],emg:0,battery:100,targetReps:10,exerciseName:'Finger Flexion',activePatientId:null,...fresh(),
set:p=>s(p),setSim:p=>s(st=>({sim:{...st.sim,...p}})),reset:()=>s(fresh())}))

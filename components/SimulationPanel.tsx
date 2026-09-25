import {useState} from 'react'
import {motion} from 'framer-motion'
import {useHand} from '@/store/handStore'
const PRE:Record<string,number[]>={OPEN:[0,0,0,0,0],FIST:[85,85,85,85,60],POINT:[0,85,85,85,60],PEACE:[0,0,85,85,60],PINCH:[50,20,10,5,55],WAVE:[0,0,0,0,0],'FLEX 50%':[45,45,45,45,25]}
const Sl=({l,v,min,max,step=1,on}:any)=><label className="flex items-center gap-3 text-[8pt] font-mono"><span className="w-14 text-[#444]">{l}</span><input type="range" className="sl flex-1" min={min} max={max} step={step} value={v} onChange={e=>on(+e.target.value)}/><span className="w-10 text-right text-[#0F6E5E]">{v}</span></label>
const Tg=({l,on,set}:any)=><button onClick={()=>set(!on)} className="flex items-center gap-2 text-[8pt] font-mono text-[#555]"><span className={`w-6 h-3 rounded-full relative ${on?'bg-[#0F6E5E]':'bg-[#222]'}`}><span className={`absolute top-0.5 w-2 h-2 rounded-full bg-[#ddd] transition-all ${on?'left-3.5':'left-0.5'}`}/></span>{l}</button>
export default function SimulationPanel(){
 const [open,setOpen]=useState(false),{sim,simMode,set,setSim}=useHand(),setF=(i:number,v:number)=>setSim({f:sim.f.map((a,j)=>j===i?v:a),preset:'',auto:false})
 const btn=(on:boolean)=>`h-6 px-2 text-[9pt] font-mono bg-[#161616] border ${on?'border-[#0F6E5E] text-[#0F6E5E]':'border-[#2a2a2a] text-[#555]'}`
 return <><button aria-label="Toggle simulation panel" onClick={()=>setOpen(!open)} className="fixed bottom-1 left-[56px] w-[18px] h-[18px] text-[#222] hover:text-[#333] z-[60] leading-none">⌥</button>
 <motion.div initial={false} animate={{height:open?240:0,opacity:open?1:0}} transition={{duration:.3,ease:'easeInOut'}} className="fixed bottom-0 left-[52px] right-0 z-50 bg-[#0d0d0d] border-t border-[#1f1f1f] overflow-y-auto" style={{pointerEvents:open?'auto':'none'}}>
  <div className="px-6 py-4"><div className="flex items-center gap-4 mb-3"><span className="text-[9pt] font-mono text-[#333]">SIMULATION</span><Tg l="SIM MODE" on={simMode} set={(v:boolean)=>set({simMode:v})}/></div>
  <div className="grid grid-cols-2 gap-x-10 gap-y-1">
   <div className="space-y-1"><Sl l="ALL" v={Math.round(sim.f[0])} min={0} max={90} on={(v:number)=>setSim({f:[v,v,v,v,v],preset:'',auto:false})}/>
    {['INDEX','MIDDLE','RING','PINKY','THUMB'].map((n,i)=><Sl key={n} l={n} v={Math.round(sim.f[i])} min={0} max={90} on={(v:number)=>setF(i,v)}/>)}</div>
   <div className="space-y-1"><Sl l="EMG" v={sim.emg} min={0} max={100} on={(v:number)=>setSim({emg:v})}/><Sl l="ROLL" v={sim.roll} min={-180} max={180} on={(v:number)=>setSim({roll:v})}/>
    <Sl l="PITCH" v={sim.pitch} min={-90} max={90} on={(v:number)=>setSim({pitch:v})}/><Sl l="YAW" v={sim.yaw} min={-180} max={180} on={(v:number)=>setSim({yaw:v})}/>
    <Sl l="SPEED" v={sim.speed} min={.01} max={.3} step={.01} on={(v:number)=>setSim({speed:v})}/><Sl l="NOISE" v={sim.noise} min={0} max={10} step={.5} on={(v:number)=>setSim({noise:v})}/></div></div>
  <div className="flex items-center gap-2 mt-3 flex-wrap"><span className="text-[8pt] font-mono text-[#333]">PRESETS:</span>
   {Object.keys(PRE).map(k=><button key={k} className={btn(sim.preset===k)} onClick={()=>setSim({f:PRE[k],preset:k,auto:false})}>{k}</button>)}
   <span className="ml-4"><Tg l="AUTO CYCLE" on={sim.auto} set={(v:boolean)=>setSim({auto:v})}/></span><span className="ml-2"><Tg l="ADD NOISE" on={sim.noiseOn} set={(v:boolean)=>setSim({noiseOn:v})}/></span></div></div></motion.div></>}

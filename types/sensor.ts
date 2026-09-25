export interface SensorFrame{t:number;f:number[];e:number;roll:number;pitch:number;yaw:number;bat:number}
export interface SimState{f:number[];emg:number;roll:number;pitch:number;yaw:number;speed:number;noise:number;noiseOn:boolean;auto:boolean;preset:string}
export type Rep='correct'|'partial'|'missed'

export type ConditionKey='healthy'|'parkinsonian'|'stroke_mild'|'stroke_severe'|'hand_oa'|'tremor_essential'|'mnd_early'|'cerebral_palsy'|'diabetic_neuropathy'|'carpal_tunnel'
export type Dev='normal'|'mild'|'moderate'|'significant'
export interface Biomarker{name:string;value:string;reference:string;deviation:Dev;description:string}
export interface ConditionProfile{key:ConditionKey;label:string;category:'Neurological'|'Musculoskeletal'|'Neuromuscular'|'Reference';description:string;color:string;severity:'Ref'|'Mild'|'Mod'|'High'
 romScale:number;speedScale:number;variabilityScale:number;tremorAmplitude:number;tremorFrequency:number;initiationDelay:number;smoothnessScale:number;asymmetryScale:number;gripStrengthScale:number;emgScale:number;emgVariabilityScale:number
 fingerModifiers:number[];wristCompensation:number;wristTremorScale:number;patternSummary:string;recommendedAction:string;evidenceLevel:'Reference'|'Research only'|'Emerging evidence'|'Established biomarker';disclaimer:string;biomarkers:Biomarker[]}
export interface SimFrame{t:number;fingers:number[];thumb:number;wristPitch:number;wristRoll:number;emg:number;velocity:number;acceleration:number;jerk:number}

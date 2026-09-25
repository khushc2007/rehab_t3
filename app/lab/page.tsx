'use client'
import dynamic from 'next/dynamic'
const L=dynamic(()=>import('@/components/lab/LabPage'),{ssr:false})
export default function P(){return <L/>}

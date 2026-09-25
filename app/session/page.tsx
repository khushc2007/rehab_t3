'use client'
import dynamic from 'next/dynamic'
const S=dynamic(()=>import('@/components/SessionPage'),{ssr:false})
export default function P(){return <S/>}

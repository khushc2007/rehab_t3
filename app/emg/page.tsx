'use client'
import dynamic from 'next/dynamic'

const EMGPage = dynamic(() => import('@/components/EMGPage'), { ssr: false })

export default function Page() {
  return <EMGPage />
}

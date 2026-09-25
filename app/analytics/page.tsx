'use client'
import dynamic from 'next/dynamic'

const AnalyticsPage = dynamic(() => import('@/components/AnalyticsPage'), { ssr: false })

export default function Page() {
  return <AnalyticsPage />
}

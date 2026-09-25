'use client'
import dynamic from 'next/dynamic'

const CalibrationPage = dynamic(() => import('@/components/CalibrationPage'), { ssr: false })

export default function Page() {
  return <CalibrationPage />
}

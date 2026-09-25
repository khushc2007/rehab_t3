import Link from 'next/link'
import { getPatient } from '@/lib/indianPatients'
import PatientProfilePage from '@/components/patients/PatientProfilePage'

export default function Page({ params }: { params: { id: string } }) {
  const patient = getPatient(params.id)
  if (!patient) {
    return (
      <div className="px-8 py-6">
        <div className="text-[14px] text-[#111827] dark:text-[#f0f0f0]">Patient not found</div>
        <Link href="/patients" className="text-[12px] text-[#0F6E5E] mt-2 inline-block">← Back to patients</Link>
      </div>
    )
  }
  return <PatientProfilePage patient={patient} />
}

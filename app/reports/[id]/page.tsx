import ReportDetailPage from '@/components/reports/ReportDetailPage'
import { ALL_SESSIONS_EXTENDED } from '@/lib/mockData'

export default function Page({ params }: { params: { id: string } }) {
  const index = params.id === 'latest' ? ALL_SESSIONS_EXTENDED.length - 1 : parseInt(params.id, 10)
  return <ReportDetailPage index={index} />
}

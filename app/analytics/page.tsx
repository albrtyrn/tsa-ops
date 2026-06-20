import { PageHeader } from "@/components/page-header"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { fetchAnalyticsData, fetchTotalConfirmedVolunteers } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()
  const volunteersCount = await fetchTotalConfirmedVolunteers()

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Analytics"
        description="Track budget accuracy, spending trends, and volunteer metrics."
      />
      <AnalyticsDashboard
        initialData={data}
        confirmedVolunteersCount={volunteersCount}
      />
    </main>
  )
}

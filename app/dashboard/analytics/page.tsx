import { fetchAnalyticsData } from "@/lib/analytics-queries"
import AnalyticsClient from "./analytics-client"

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track budget, attendance, and volunteer metrics across all culinary events.
        </p>
      </div>

      <AnalyticsClient data={data} />
    </div>
  )
}

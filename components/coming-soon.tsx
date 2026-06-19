import { Construction } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <PageHeader title={title} description={description} />
      <Empty className="rounded-lg border border-dashed py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Construction />
          </EmptyMedia>
          <EmptyTitle>Coming soon</EmptyTitle>
          <EmptyDescription>
            This section is part of the roadmap. The Dashboard and Event Workspace are fully
            interactive today.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  )
}

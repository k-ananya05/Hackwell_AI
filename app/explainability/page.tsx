import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExplainabilityDashboard } from "@/components/explainability-dashboard"

export default function ExplainabilityPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ExplainabilityDashboard />
      </DashboardLayout>
    </AuthGuard>
  )
}

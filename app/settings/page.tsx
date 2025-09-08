import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsDashboard } from "@/components/settings-dashboard"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <SettingsDashboard />
      </DashboardLayout>
    </AuthGuard>
  )
}

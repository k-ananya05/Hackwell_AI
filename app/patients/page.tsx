import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PatientList } from "@/components/patient-list"

export default function PatientsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <PatientList />
      </DashboardLayout>
    </AuthGuard>
  )
}

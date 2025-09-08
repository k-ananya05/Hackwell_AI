import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PatientDetails } from "@/components/patient-details"

interface PatientDetailPageProps {
  params: {
    id: string
  }
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  return (
    <AuthGuard>
      <DashboardLayout>
        <PatientDetails patientId={params.id} />
      </DashboardLayout>
    </AuthGuard>
  )
}

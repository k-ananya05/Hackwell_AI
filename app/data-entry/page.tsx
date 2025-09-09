import { DashboardLayout } from "@/components/dashboard-layout"
import { PatientDataEntryForm } from "@/components/patient-data-entry-form"

export default function DataEntryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Data Entry</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive patient data collection for ML analysis and predictive modeling
          </p>
        </div>
        <PatientDataEntryForm />
      </div>
    </DashboardLayout>
  )
}

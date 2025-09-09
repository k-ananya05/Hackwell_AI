"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, AlertTriangle, TrendingUp, Loader2 } from "lucide-react"
import { apiClient, type Patient } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { IntegrationStatus } from "@/components/integration-status"

export function DashboardOverview() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentPatients, setRecentPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch analytics and recent patients
        const [analyticsData, patientsData] = await Promise.all([
          apiClient.getAnalytics(),
          apiClient.getPatients(0, 4) // Get first 4 patients for recent activity
        ])
        
        setAnalytics(analyticsData)
        setRecentPatients(patientsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = analytics ? [
    {
      title: "Total Patients",
      value: analytics.total_patients?.toString() || "0",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Cases",
      value: analytics.active_cases?.toString() || "0",
      change: "+3%",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Critical Alerts",
      value: analytics.critical_alerts?.toString() || "0",
      change: "-2%",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
    {
      title: "Recovery Rate",
      value: `${(analytics.recovery_rate * 100).toFixed(1)}%` || "0%",
      change: "+1.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ] : []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "stable":
        return "bg-green-100 text-green-800"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "improving":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.full_name || 'Doctor'}
        </h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your patients and recent activity.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>{" "}
                      from last month
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Integration Status */}
          <IntegrationStatus />

          {/* Recent patients */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Latest patient visits and status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => {
                    const medicalHistory = patient.medical_history?.toLowerCase() || ""
                    const status = medicalHistory.includes("critical") ? "critical" :
                                   medicalHistory.includes("monitoring") ? "monitoring" : "stable"

                    // Handle possible undefined updated_at
                    let updatedDate = "N/A"
                    if (patient.updated_at) {
                      try {
                        updatedDate = new Date(patient.updated_at).toLocaleDateString()
                      } catch {
                        updatedDate = "N/A"
                      }
                    }

                    return (
                      <div key={patient.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {patient.name?.split(" ").map((n) => n[0]).join("") || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{patient.name || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.patient_id || "-"} • {patient.age ?? "-"} years
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {updatedDate}
                          </span>
                        </div>
                      </div>
                    )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

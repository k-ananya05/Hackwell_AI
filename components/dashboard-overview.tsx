"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, AlertTriangle, TrendingUp } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Cases",
      value: "89",
      change: "+3%",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Critical Alerts",
      value: "7",
      change: "-2%",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
    {
      title: "Recovery Rate",
      value: "94.2%",
      change: "+1.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  const recentPatients = [
    { id: "P001", name: "John Smith", condition: "Hypertension", status: "Stable", lastVisit: "2024-01-15" },
    { id: "P002", name: "Sarah Johnson", condition: "Diabetes", status: "Monitoring", lastVisit: "2024-01-14" },
    { id: "P003", name: "Michael Brown", condition: "Cardiac", status: "Critical", lastVisit: "2024-01-15" },
    { id: "P004", name: "Emily Davis", condition: "Respiratory", status: "Improving", lastVisit: "2024-01-13" },
  ]

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
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Doctor</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your patients and recent activity.</p>
      </div>

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

      {/* Recent patients */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>Latest patient visits and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.id} • {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                  <span className="text-sm text-muted-foreground">{patient.lastVisit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

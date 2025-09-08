"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Calendar,
  Download,
} from "lucide-react"

export function AnalyticsDashboard() {
  const patientVolumeData = [
    { month: "Jan", patients: 120, newPatients: 15 },
    { month: "Feb", patients: 135, newPatients: 22 },
    { month: "Mar", patients: 142, newPatients: 18 },
    { month: "Apr", patients: 158, newPatients: 25 },
    { month: "May", patients: 165, newPatients: 20 },
    { month: "Jun", patients: 178, newPatients: 28 },
  ]

  const conditionDistribution = [
    { name: "Hypertension", value: 35, color: "#164e63" },
    { name: "Diabetes", value: 25, color: "#8b5cf6" },
    { name: "Cardiac", value: 20, color: "#ec4899" },
    { name: "Respiratory", value: 12, color: "#1f2937" },
    { name: "Other", value: 8, color: "#be123c" },
  ]

  const recoveryRateData = [
    { month: "Jan", rate: 89 },
    { month: "Feb", rate: 91 },
    { month: "Mar", rate: 88 },
    { month: "Apr", rate: 93 },
    { month: "May", rate: 94 },
    { month: "Jun", rate: 96 },
  ]

  const riskDistribution = [
    { risk: "Low", count: 85, percentage: 68 },
    { risk: "Medium", count: 28, percentage: 22 },
    { risk: "High", count: 12, percentage: 10 },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "#10b981"
      case "medium":
        return "#f59e0b"
      case "high":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into patient care and outcomes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">1,247</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        {/* (… keep the other 3 cards the same …) */}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Patient Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Volume Trend</CardTitle>
            <CardDescription>Monthly patient count and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="var(--color-primary)" name="Total Patients" />
                <Bar dataKey="newPatients" fill="var(--color-secondary)" name="New Patients" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Condition Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Condition Distribution</CardTitle>
            <CardDescription>Breakdown of patient conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {conditionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recovery Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Rate Trend</CardTitle>
            <CardDescription>Monthly recovery rate percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={recoveryRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Risk Distribution</CardTitle>
            <CardDescription>Current risk level breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskDistribution.map((item) => (
                <div
                  key={item.risk}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getRiskColor(item.risk) }}
                    />
                    <span className="font-medium">{item.risk} Risk</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {item.count} patients
                    </span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={riskDistribution}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="risk" type="category" hide />
                  <Bar dataKey="count">
                    {riskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getRiskColor(entry.risk)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

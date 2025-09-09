"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"

// API interfaces
interface AnalyticsData {
  total_patients: number
  active_cases: number
  critical_alerts: number
  recovery_rate: number
}

interface PatientVolumeData {
  month: string
  patients: number
  new_patients: number
}

interface ConditionDistribution {
  name: string
  value: number
  percentage: number
}

interface RiskDistribution {
  risk: string
  count: number
  percentage: number
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [patientVolume, setPatientVolume] = useState<PatientVolumeData[]>([])
  const [conditionDistribution, setConditionDistribution] = useState<ConditionDistribution[]>([])
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState("6")

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('hackwell_auth_token')
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        
        const [
          analyticsRes,
          volumeRes,
          conditionRes,
          riskRes
        ] = await Promise.allSettled([
          fetch(`${baseURL}/api/analytics/overview`, { headers }),
          fetch(`${baseURL}/api/analytics/patient-volume?months=${selectedTimeRange}`, { headers }),
          fetch(`${baseURL}/api/analytics/condition-distribution`, { headers }),
          fetch(`${baseURL}/api/analytics/risk-distribution`, { headers })
        ])
        
        // Handle analytics data
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
          const data = await analyticsRes.value.json()
          setAnalytics(data)
        }
        
        // Handle volume data
        if (volumeRes.status === 'fulfilled' && volumeRes.value.ok) {
          const data = await volumeRes.value.json()
          setPatientVolume(data)
        }
        
        // Handle condition data
        if (conditionRes.status === 'fulfilled' && conditionRes.value.ok) {
          const data = await conditionRes.value.json()
          setConditionDistribution(data)
        }
        
        // Handle risk data
        if (riskRes.status === 'fulfilled' && riskRes.value.ok) {
          const data = await riskRes.value.json()
          setRiskDistribution(data)
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
        console.error('Error fetching analytics data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [selectedTimeRange])

  // Fallback data for when API is not available
  const fallbackPatientVolume = [
    { month: "Jan", patients: 120, new_patients: 15 },
    { month: "Feb", patients: 135, new_patients: 22 },
    { month: "Mar", patients: 142, new_patients: 18 },
    { month: "Apr", patients: 158, new_patients: 25 },
    { month: "May", patients: 165, new_patients: 20 },
    { month: "Jun", patients: 178, new_patients: 28 },
  ]

  const fallbackConditionDistribution = [
    { name: "Diabetes", value: 45, percentage: 35.2 },
    { name: "Hypertension", value: 38, percentage: 29.7 },
    { name: "Heart Disease", value: 25, percentage: 19.5 },
    { name: "COPD", value: 12, percentage: 9.4 },
    { name: "Other", value: 8, percentage: 6.2 },
  ]

  const fallbackRiskDistribution = [
    { risk: "Low", count: 89, percentage: 62.2 },
    { risk: "Medium", count: 34, percentage: 23.8 },
    { risk: "High", count: 20, percentage: 14.0 },
  ]

  // Use real data if available, otherwise fallback
  const displayPatientVolume = patientVolume.length > 0 ? patientVolume : fallbackPatientVolume
  const displayConditionDistribution = conditionDistribution.length > 0 ? conditionDistribution : fallbackConditionDistribution
  const displayRiskDistribution = riskDistribution.length > 0 ? riskDistribution : fallbackRiskDistribution

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

  const getConditionColor = (index: number) => {
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into patient care and outcomes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_patients || 143}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.active_cases || 89}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +3.1%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.critical_alerts || 12}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">
                <TrendingDown className="h-3 w-3 inline mr-1" />
                -12.5%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.recovery_rate ? `${(analytics.recovery_rate * 100).toFixed(1)}%` : '94.2%'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +2.4%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Volume Trend</CardTitle>
            <CardDescription>Monthly patient count and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayPatientVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#3b82f6" />
                <Bar dataKey="new_patients" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condition Distribution</CardTitle>
            <CardDescription>Breakdown of patient conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={displayConditionDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {displayConditionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getConditionColor(index)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
          <CardDescription>Current patient risk level breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayRiskDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: getRiskColor(item.risk) }}
                  />
                  <span className="font-medium">{item.risk} Risk</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{item.count} patients</span>
                  <Badge variant="outline">{item.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

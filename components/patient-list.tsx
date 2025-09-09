"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Loader2 } from "lucide-react"
import { apiClient, type Patient } from "@/lib/api"

// Helper function to determine risk level based on conditions
function calculateRiskLevel(patient: Patient): "Low" | "Medium" | "High" {
  const medicalHistory = patient.medical_history?.toLowerCase() || ""
  
  if (medicalHistory.includes("cardiac") || medicalHistory.includes("heart") || medicalHistory.includes("critical")) {
    return "High"
  } else if (medicalHistory.includes("diabetes") || medicalHistory.includes("hypertension") || medicalHistory.includes("monitoring")) {
    return "Medium"
  }
  return "Low"
}

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.getPatients()
        setPatients(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients')
        console.error('Error fetching patients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medical_history?.toLowerCase().includes(searchTerm.toLowerCase())

    // For status filtering, we'll use a simple mapping based on medical history
    const patientStatus = patient.medical_history?.toLowerCase().includes("critical") ? "critical" :
                         patient.medical_history?.toLowerCase().includes("monitoring") ? "monitoring" : "stable"
    
    const matchesFilter = filterStatus === "all" || patientStatus === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

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

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor your patients</p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, ID, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "stable" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("stable")}
              >
                Stable
              </Button>
              <Button
                variant={filterStatus === "monitoring" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("monitoring")}
              >
                Monitoring
              </Button>
              <Button
                variant={filterStatus === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("critical")}
              >
                Critical
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient list */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading patients...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading patients: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => {
            const riskLevel = calculateRiskLevel(patient)
            const status = patient.medical_history?.toLowerCase().includes("critical") ? "critical" :
                          patient.medical_history?.toLowerCase().includes("monitoring") ? "monitoring" : "stable"
            
            return (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-primary">
                          {patient.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.name || 'Unknown'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.patient_id || 'N/A'} • {patient.age || 'N/A'} years • {patient.gender || 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.email || 'No email'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                        <Badge className={getRiskColor(riskLevel)}>Risk: {riskLevel}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground text-right">
                        <p>Created: {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'Unknown'}</p>
                        <p>Updated: {patient.updated_at ? new Date(patient.updated_at).toLocaleDateString() : 'Never'}</p>
                      </div>

                      <Link href={`/patients/${patient.patient_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!loading && !error && filteredPatients.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No patients found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

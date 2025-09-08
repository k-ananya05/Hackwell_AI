"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  status: string
  lastVisit: string
  nextAppointment: string
  riskLevel: "Low" | "Medium" | "High"
}

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const patients: Patient[] = [
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      status: "Stable",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-02-15",
      riskLevel: "Low",
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      condition: "Type 2 Diabetes",
      status: "Monitoring",
      lastVisit: "2024-01-14",
      nextAppointment: "2024-01-28",
      riskLevel: "Medium",
    },
    {
      id: "P003",
      name: "Michael Brown",
      age: 67,
      gender: "Male",
      condition: "Cardiac Arrhythmia",
      status: "Critical",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-18",
      riskLevel: "High",
    },
    {
      id: "P004",
      name: "Emily Davis",
      age: 28,
      gender: "Female",
      condition: "Asthma",
      status: "Improving",
      lastVisit: "2024-01-13",
      nextAppointment: "2024-02-10",
      riskLevel: "Low",
    },
    {
      id: "P005",
      name: "Robert Wilson",
      age: 55,
      gender: "Male",
      condition: "Chronic Kidney Disease",
      status: "Monitoring",
      lastVisit: "2024-01-12",
      nextAppointment: "2024-01-26",
      riskLevel: "Medium",
    },
    {
      id: "P006",
      name: "Lisa Anderson",
      age: 41,
      gender: "Female",
      condition: "Migraine",
      status: "Stable",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-03-10",
      riskLevel: "Low",
    },
  ]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || patient.status.toLowerCase() === filterStatus.toLowerCase()

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
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.id} • {patient.age} years • {patient.gender}
                    </p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    <Badge className={getRiskColor(patient.riskLevel)}>Risk: {patient.riskLevel}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground text-right">
                    <p>Last visit: {patient.lastVisit}</p>
                    <p>Next: {patient.nextAppointment}</p>
                  </div>

                  <Link href={`/patients/${patient.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No patients found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

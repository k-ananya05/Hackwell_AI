"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Phone, Mail, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface PatientDetailsProps {
  patientId: string
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
  // Mock patient data - in real app this would come from API
  const patient = {
    id: patientId,
    name: "John Smith",
    age: 45,
    gender: "Male",
    dateOfBirth: "1979-03-15",
    phone: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Main St, Anytown, ST 12345",
    condition: "Hypertension",
    status: "Stable",
    riskLevel: "Low",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-15",
    allergies: ["Penicillin", "Shellfish"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
    ],
    vitals: [
      { date: "2024-01-15", bloodPressure: "130/85", heartRate: "72", temperature: "98.6°F", weight: "180 lbs" },
      { date: "2024-01-01", bloodPressure: "135/90", heartRate: "75", temperature: "98.4°F", weight: "182 lbs" },
      { date: "2023-12-15", bloodPressure: "140/95", heartRate: "78", temperature: "98.7°F", weight: "184 lbs" },
    ],
    notes: [
      {
        date: "2024-01-15",
        provider: "Dr. Sarah Johnson",
        note: "Patient reports feeling well. Blood pressure improved since last visit. Continue current medication regimen.",
      },
      {
        date: "2024-01-01",
        provider: "Dr. Sarah Johnson",
        note: "Slight increase in blood pressure. Discussed lifestyle modifications including diet and exercise.",
      },
    ],
  }

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
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
      </div>

      {/* Patient overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="text-lg">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-lg">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-lg">{patient.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Primary Condition</p>
                <p className="text-lg">{patient.condition}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
              <Badge className={getRiskColor(patient.riskLevel)}>Risk: {patient.riskLevel}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.email}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{patient.address}</span>
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Next Appointment</p>
                  <p className="text-sm text-muted-foreground">{patient.nextAppointment}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed information tabs */}
      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Vitals & History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="allergies">Allergies & Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
              <CardDescription>Recent vital signs and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.vitals.map((vital, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{vital.date}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">BP: </span>
                          <span>{vital.bloodPressure}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">HR: </span>
                          <span>{vital.heartRate} bpm</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Temp: </span>
                          <span>{vital.temperature}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weight: </span>
                          <span>{vital.weight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Active prescriptions and dosages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.medications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} - {med.frequency}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>Provider notes and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.notes.map((note, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{note.date}</p>
                      <p className="text-sm text-muted-foreground">{note.provider}</p>
                    </div>
                    <p className="text-sm">{note.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies">
          <Card>
            <CardHeader>
              <CardTitle>Allergies & Alerts</CardTitle>
              <CardDescription>Important medical alerts and allergies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border border-destructive/20 bg-destructive/5 rounded-lg"
                  >
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Allergy: {allergy}</p>
                      <p className="text-sm text-muted-foreground">Avoid administration</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

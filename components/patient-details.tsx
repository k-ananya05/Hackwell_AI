"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Phone, Mail, MapPin, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient, type Patient } from "@/lib/api"

interface PatientDetailsProps {
  patientId: string
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [vitals, setVitals] = useState<any[]>([])
  const [medications, setMedications] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch basic patient data first
        const patientData = await apiClient.getPatient(patientId)
        setPatient(patientData)
        
        // Fetch additional data in parallel
        const [vitalsData, medicationsData, notesData, predictionData] = await Promise.allSettled([
          apiClient.getPatientVitals(patientId),
          apiClient.getPatientMedications(patientId),
          apiClient.getPatientNotes(patientId),
          apiClient.getPrediction(patientId)
        ])
        
        // Handle settled promises
        setVitals(vitalsData.status === 'fulfilled' ? vitalsData.value : [])
        setMedications(medicationsData.status === 'fulfilled' ? medicationsData.value : [])
        setNotes(notesData.status === 'fulfilled' ? notesData.value : [])
        setPrediction(predictionData.status === 'fulfilled' ? predictionData.value : null)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patient data')
        console.error('Error fetching patient data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patient details...</span>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading patient: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate risk level and status based on medical history
  const riskLevel = patient.medical_history?.toLowerCase().includes("critical") ? "High" :
                   patient.medical_history?.toLowerCase().includes("monitoring") ? "Medium" : "Low"
  const status = patient.medical_history?.toLowerCase().includes("critical") ? "critical" :
                patient.medical_history?.toLowerCase().includes("monitoring") ? "monitoring" : "stable"

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
          <p className="text-muted-foreground">Patient ID: {patient.patient_id}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-lg">{patient.phone || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Primary Condition</p>
                <p className="text-lg">{patient.medical_history?.split('.')[0] || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <Badge className={getStatusColor(status)}>{status}</Badge>
              <Badge className={getRiskColor(riskLevel)}>Risk: {riskLevel}</Badge>
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
              <span className="text-sm">{patient.phone || 'Not available'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.email || 'Not available'}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{patient.address || 'Address not available'}</span>
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Next Appointment</p>
                  <p className="text-sm text-muted-foreground">Not scheduled</p>
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
          <TabsTrigger value="history">Medical History</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
              <CardDescription>Recent vital signs and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitals.length > 0 ? (
                  vitals.map((vital, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{vital.recorded_at ? new Date(vital.recorded_at).toLocaleDateString() : 'Date unknown'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">BP: </span>
                            <span>{vital.systolic_bp && vital.diastolic_bp ? `${vital.systolic_bp}/${vital.diastolic_bp}` : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">HR: </span>
                            <span>{vital.heart_rate ? `${vital.heart_rate} bpm` : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Temp: </span>
                            <span>{vital.body_temperature ? `${vital.body_temperature}°F` : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">O2: </span>
                            <span>{vital.blood_oxygen ? `${vital.blood_oxygen}%` : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No vital signs recorded yet.</p>
                  </div>
                )}
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
                {medications.length > 0 ? (
                  medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} - {med.frequency}
                        </p>
                        {med.side_effects && (
                          <p className="text-sm text-amber-600 mt-1">
                            Side effects: {med.side_effects}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={med.is_active ? "default" : "secondary"}>
                          {med.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {med.adherence_rate && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Adherence: {Math.round(med.adherence_rate * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No medications recorded.</p>
                  </div>
                )}
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
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{note.visit_date ? new Date(note.visit_date).toLocaleDateString() : 'Date unknown'}</p>
                        <p className="text-sm text-muted-foreground">{note.note_type || 'General'}</p>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No clinical notes available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Patient's medical background and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Medical History</h4>
                  <p className="text-sm">{patient.medical_history || 'No medical history recorded.'}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Emergency Contact</h4>
                  <p className="text-sm">{patient.emergency_contact || 'No emergency contact on file.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

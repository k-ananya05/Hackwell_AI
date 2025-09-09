"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { User, Activity, FlaskConical, Pill, Heart, Target, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

export function PatientDataEntryForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    // Demographics - required by backend
    patient_id: "",
    name: "",
    age: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
    emergency_contact: "",
    medical_history: "",
    height: "",
    weight: "",
    chronic_conditions: [] as string[],
    family_history: "",

    // Additional form fields for vitals/labs (these would be separate API calls)
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    bloodOxygen: "",
    bodyTemp: "",
    respiratoryRate: "",
    weightChange: "",

    // Lab Results
    fastingGlucose: "",
    hba1c: "",
    ldlCholesterol: "",
    hdlCholesterol: "",
    triglycerides: "",
    creatinine: "",
    egfr: "",
    hemoglobin: "",
    bnp: "",

    // Medication
    currentMedications: "",
    missedDoses: "",
    sideEffects: "",

    // Lifestyle
    dietQuality: "",
    exerciseMinutes: "",
    sleepDuration: "",
    smokingStatus: "",
    alcoholUsage: "",
    stressLevel: [5],

    // Clinical Outcomes
    hospitalizationEvents: "",
    emergencyVisits: "",
    deteriorationEvents: "",
  })

  const chronicConditionsList = [
    "Diabetes",
    "Hypertension",
    "Obesity",
    "Heart Failure",
    "COPD",
    "Kidney Disease",
    "Liver Disease",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Validate required fields
      if (!formData.patient_id || !formData.name || !formData.age || !formData.gender || !formData.date_of_birth) {
        throw new Error("Please fill in all required fields (Patient ID, Name, Age, Gender, Date of Birth)")
      }

      // Prepare patient data for API
      const patientData = {
        patient_id: formData.patient_id,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        emergency_contact: formData.emergency_contact || undefined,
        medical_history: formData.medical_history || undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        chronic_conditions: formData.chronic_conditions,
        family_history: formData.family_history || undefined
      }

      // Create patient via API
      const newPatient = await apiClient.createPatient(patientData)
      console.log("Patient created successfully:", newPatient)
      
      setSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          patient_id: "",
          name: "",
          age: "",
          gender: "",
          date_of_birth: "",
          phone: "",
          email: "",
          address: "",
          emergency_contact: "",
          medical_history: "",
          height: "",
          weight: "",
          chronic_conditions: [],
          family_history: "",
          systolicBP: "",
          diastolicBP: "",
          heartRate: "",
          bloodOxygen: "",
          bodyTemp: "",
          respiratoryRate: "",
          weightChange: "",
          fastingGlucose: "",
          hba1c: "",
          ldlCholesterol: "",
          hdlCholesterol: "",
          triglycerides: "",
          creatinine: "",
          egfr: "",
          hemoglobin: "",
          bnp: "",
          currentMedications: "",
          missedDoses: "",
          sideEffects: "",
          exerciseFrequency: "",
          smokingStatus: "",
          alcoholConsumption: "",
          sleepQuality: "",
          stressLevel: 5,
          dietQuality: "",
          alcoholUnits: "",
          wellbeingScore: "",
          environmentalFactors: "",
          socialSupport: "",
          functionalStatus: ""
        })
        setSuccess(false)
      }, 3000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient')
      console.error('Error creating patient:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      chronic_conditions: checked
        ? [...prev.chronic_conditions, condition]
        : prev.chronic_conditions.filter((c: string) => c !== condition),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Demographics
          </CardTitle>
          <CardDescription>Baseline patient information for ML model training</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient ID (Anonymized)</Label>
            <Input
              id="patient_id"
              value={formData.patient_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, patient_id: e.target.value }))}
              placeholder="e.g., PT-2024-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Patient full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="patient@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Full address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact</Label>
            <Input
              id="emergency_contact"
              value={formData.emergency_contact}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergency_contact: e.target.value }))}
              placeholder="Emergency contact info"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical History</Label>
            <Textarea
              id="medical_history"
              value={formData.medical_history}
              onChange={(e) => setFormData((prev) => ({ ...prev, medical_history: e.target.value }))}
              placeholder="Past medical history..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
              placeholder="Years"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
              placeholder="170"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
              placeholder="70"
            />
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label>Chronic Conditions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {chronicConditionsList.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.chronic_conditions.includes(condition)}
                    onCheckedChange={(checked) => handleCheckboxChange(condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label htmlFor="family_history">Family History (Optional)</Label>
            <Textarea
              id="family_history"
              value={formData.family_history}
              onChange={(e) => setFormData((prev) => ({ ...prev, family_history: e.target.value }))}
              placeholder="Relevant family medical history..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            Vital Signs
          </CardTitle>
          <CardDescription>Daily/weekly vital measurements</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
            <Input
              id="systolicBP"
              type="number"
              value={formData.systolicBP}
              onChange={(e) => setFormData((prev) => ({ ...prev, systolicBP: e.target.value }))}
              placeholder="120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
            <Input
              id="diastolicBP"
              type="number"
              value={formData.diastolicBP}
              onChange={(e) => setFormData((prev) => ({ ...prev, diastolicBP: e.target.value }))}
              placeholder="80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
            <Input
              id="heartRate"
              type="number"
              value={formData.heartRate}
              onChange={(e) => setFormData((prev) => ({ ...prev, heartRate: e.target.value }))}
              placeholder="72"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodOxygen">Blood Oxygen (SpO₂%)</Label>
            <Input
              id="bloodOxygen"
              type="number"
              value={formData.bloodOxygen}
              onChange={(e) => setFormData((prev) => ({ ...prev, bloodOxygen: e.target.value }))}
              placeholder="98"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyTemp">Body Temperature (°C)</Label>
            <Input
              id="bodyTemp"
              type="number"
              step="0.1"
              value={formData.bodyTemp}
              onChange={(e) => setFormData((prev) => ({ ...prev, bodyTemp: e.target.value }))}
              placeholder="36.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
            <Input
              id="respiratoryRate"
              type="number"
              value={formData.respiratoryRate}
              onChange={(e) => setFormData((prev) => ({ ...prev, respiratoryRate: e.target.value }))}
              placeholder="16"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lab Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-amber-500" />
            Laboratory Results
          </CardTitle>
          <CardDescription>Periodic lab test results and biomarkers</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fastingGlucose">Fasting Glucose (mg/dL)</Label>
            <Input
              id="fastingGlucose"
              type="number"
              value={formData.fastingGlucose}
              onChange={(e) => setFormData((prev) => ({ ...prev, fastingGlucose: e.target.value }))}
              placeholder="90"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hba1c">HbA1c (%)</Label>
            <Input
              id="hba1c"
              type="number"
              step="0.1"
              value={formData.hba1c}
              onChange={(e) => setFormData((prev) => ({ ...prev, hba1c: e.target.value }))}
              placeholder="5.7"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ldlCholesterol">LDL Cholesterol (mg/dL)</Label>
            <Input
              id="ldlCholesterol"
              type="number"
              value={formData.ldlCholesterol}
              onChange={(e) => setFormData((prev) => ({ ...prev, ldlCholesterol: e.target.value }))}
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hdlCholesterol">HDL Cholesterol (mg/dL)</Label>
            <Input
              id="hdlCholesterol"
              type="number"
              value={formData.hdlCholesterol}
              onChange={(e) => setFormData((prev) => ({ ...prev, hdlCholesterol: e.target.value }))}
              placeholder="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
            <Input
              id="creatinine"
              type="number"
              step="0.1"
              value={formData.creatinine}
              onChange={(e) => setFormData((prev) => ({ ...prev, creatinine: e.target.value }))}
              placeholder="1.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
            <Input
              id="hemoglobin"
              type="number"
              step="0.1"
              value={formData.hemoglobin}
              onChange={(e) => setFormData((prev) => ({ ...prev, hemoglobin: e.target.value }))}
              placeholder="14.0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medication Adherence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-purple-500" />
            Medication Adherence
          </CardTitle>
          <CardDescription>Current medications and adherence patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              value={formData.currentMedications}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentMedications: e.target.value }))}
              placeholder="List medications with dosage and frequency..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="missedDoses">Missed Doses per Week</Label>
              <Input
                id="missedDoses"
                type="number"
                value={formData.missedDoses}
                onChange={(e) => setFormData((prev) => ({ ...prev, missedDoses: e.target.value }))}
                placeholder="0-7"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sideEffects">Side Effects Reported</Label>
              <Input
                id="sideEffects"
                value={formData.sideEffects}
                onChange={(e) => setFormData((prev) => ({ ...prev, sideEffects: e.target.value }))}
                placeholder="None, mild nausea, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Lifestyle Factors
          </CardTitle>
          <CardDescription>Daily lifestyle and behavioral patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exerciseMinutes">Exercise Minutes/Day</Label>
              <Input
                id="exerciseMinutes"
                type="number"
                value={formData.exerciseMinutes}
                onChange={(e) => setFormData((prev) => ({ ...prev, exerciseMinutes: e.target.value }))}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepDuration">Sleep Duration (hours)</Label>
              <Input
                id="sleepDuration"
                type="number"
                step="0.5"
                value={formData.sleepDuration}
                onChange={(e) => setFormData((prev) => ({ ...prev, sleepDuration: e.target.value }))}
                placeholder="8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smokingStatus">Smoking Status</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, smokingStatus: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="former">Former</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stress Level (1-10 scale)</Label>
            <div className="px-3">
              <Slider
                value={formData.stressLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, stressLevel: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low (1)</span>
                <span>Current: {formData.stressLevel[0]}</span>
                <span>High (10)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Clinical Outcomes
          </CardTitle>
          <CardDescription>Historical events for ML model training labels</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalizationEvents">Hospitalizations (Past 12 months)</Label>
            <Input
              id="hospitalizationEvents"
              type="number"
              value={formData.hospitalizationEvents}
              onChange={(e) => setFormData((prev) => ({ ...prev, hospitalizationEvents: e.target.value }))}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyVisits">Emergency Visits (Past 12 months)</Label>
            <Input
              id="emergencyVisits"
              type="number"
              value={formData.emergencyVisits}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergencyVisits: e.target.value }))}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="text-green-800">
              <strong>Success:</strong> Patient created successfully! The form will reset in a moment.
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" disabled={loading}>
          Save Draft
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Patient...
            </>
          ) : (
            "Create Patient"
          )}
        </Button>
      </div>
    </form>
  )
}

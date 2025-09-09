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
import { User, Activity, FlaskConical, Pill, Heart, Target } from "lucide-react"

export function PatientDataEntryForm() {
  const [formData, setFormData] = useState({
    // Demographics
    patientId: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    chronicConditions: [] as string[],
    familyHistory: "",

    // Vitals
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Patient data submitted:", formData)
    // Here you would typically send the data to your ML pipeline
    alert("Patient data submitted successfully for ML analysis!")
  }

  const handleCheckboxChange = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: checked
        ? [...prev.chronicConditions, condition]
        : prev.chronicConditions.filter((c) => c !== condition),
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
            <Label htmlFor="patientId">Patient ID (Anonymized)</Label>
            <Input
              id="patientId"
              value={formData.patientId}
              onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
              placeholder="e.g., PT-2024-001"
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
                    checked={formData.chronicConditions.includes(condition)}
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
            <Label htmlFor="familyHistory">Family History (Optional)</Label>
            <Textarea
              id="familyHistory"
              value={formData.familyHistory}
              onChange={(e) => setFormData((prev) => ({ ...prev, familyHistory: e.target.value }))}
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

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Submit for ML Analysis
        </Button>
      </div>
    </form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { User, Activity, FlaskConical, Pill, Heart, Target, Dna, Baby } from "lucide-react"

export function PatientDataEntryForm() {
  const [formData, setFormData] = useState({
    // Basic Demographics
    patientId: "",
    age: "",
    sex: "",

    // Cardiac Parameters
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
    condition: "",

    // Lifestyle and Nutrition
    family_history_with_overweight: "",
    FAVC: "",
    FCVC: [1],
    NCP: "",
    CAEC: "",
    SMOKE: "",
    CH2O: "",
    SCC: "",
    FAF: [0],
    TUE: "",
    CALC: "",
    MTRANS: "",
    NObeyesdad: "",

    // Diabetes and Metabolic
    Target: "",
    geneticMarkers: "",
    autoantibodies: "",
    familyHistory: "",
    environmentalFactors: "",
    insulinLevels: "",
    BMI: "",
    physicalActivity: "",
    dietaryHabits: "",
    bloodPressure: "",
    cholesterolLevels: "",
    waistCircumference: "",
    bloodGlucoseLevels: "",
    ethnicity: "",
    socioeconomicFactors: "",
    smokingStatus: "",
    alcoholConsumption: "",
    glucoseToleranceTest: "",

    // Reproductive Health
    historyOfPCOS: "",
    previousGestationalDiabetes: "",
    pregnancyHistory: "",
    weightGainDuringPregnancy: "",

    // Organ Function
    pancreaticHealth: "",
    pulmonaryFunction: "",
    cysticFibrosisdiagnosis: "",
    steroidUseHistory: "",
    geneticTesting: "",
    neurologicalAssessments: "",
    liverFunctionTests: "",
    digestiveEnzymeLevels: "",
    urineTest: "",
    birthWeight: "",
    earlyOnsetSymptoms: "",

    // Original fields for compatibility
    height: "",
    weight: "",
    chronicConditions: [] as string[],
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
    dietQuality: "",
    exerciseMinutes: "",
    sleepDuration: "",
    stressLevel: [5],
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
            Patient Demographics & Basic Info
          </CardTitle>
          <CardDescription>Essential patient information and identifiers</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID (Required)</Label>
            <Input
              id="patientId"
              value={formData.patientId}
              onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
              placeholder="e.g., PT-2024-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              min="1"
              value={formData.age}
              onChange={(e) => {
                const value = e.target.value;
                // Only update if the value is empty or a positive number
                if (value === '' || (parseInt(value) > 0)) {
                  setFormData((prev) => ({ ...prev, age: value }));
                }
              }}
              onBlur={(e) => {
                // If the field is not empty and the value is 0 or negative, reset it
                if (e.target.value && parseInt(e.target.value) <= 0) {
                  setFormData((prev) => ({ ...prev, age: '' }));
                }
              }}
              placeholder="25, 45, 60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Female (0)</SelectItem>
                <SelectItem value="1">Male (1)</SelectItem>
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

          <div className="space-y-2">
            <Label htmlFor="BMI">BMI (kg/m²)</Label>
            <Input
              id="BMI"
              type="number"
              step="0.1"
              value={formData.BMI}
              onChange={(e) => setFormData((prev) => ({ ...prev, BMI: e.target.value }))}
              placeholder="18.5, 25.0, 30.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ethnicity">Ethnicity</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, ethnicity: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="caucasian">Caucasian</SelectItem>
                <SelectItem value="african_american">African American</SelectItem>
                <SelectItem value="hispanic">Hispanic</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="socioeconomicFactors">Socioeconomic Status</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, socioeconomicFactors: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthWeight">Birth Weight (grams)</Label>
            <Input
              id="birthWeight"
              type="number"
              value={formData.birthWeight}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthWeight: e.target.value }))}
              placeholder="1500, 2500, 3500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cardiac Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Cardiac Parameters
          </CardTitle>
          <CardDescription>Heart-related measurements and conditions</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cp">Chest Pain Type</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, cp: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Type 0</SelectItem>
                <SelectItem value="1">Type 1</SelectItem>
                <SelectItem value="2">Type 2</SelectItem>
                <SelectItem value="3">Type 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trestbps">Resting Blood Pressure (mmHg)</Label>
            <Input
              id="trestbps"
              type="number"
              value={formData.trestbps}
              onChange={(e) => setFormData((prev) => ({ ...prev, trestbps: e.target.value }))}
              placeholder="120, 140, 160"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chol">Serum Cholesterol (mg/dl)</Label>
            <Input
              id="chol"
              type="number"
              value={formData.chol}
              onChange={(e) => setFormData((prev) => ({ ...prev, chol: e.target.value }))}
              placeholder="200, 240, 300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fbs">Fasting Blood Sugar &gt; 120 mg/dl</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, fbs: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">False (0)</SelectItem>
                <SelectItem value="1">True (1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restecg">Resting ECG Results</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, restecg: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Normal (0)</SelectItem>
                <SelectItem value="1">ST-T abnormality (1)</SelectItem>
                <SelectItem value="2">LV hypertrophy (2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thalach">Maximum Heart Rate Achieved</Label>
            <Input
              id="thalach"
              type="number"
              value={formData.thalach}
              onChange={(e) => setFormData((prev) => ({ ...prev, thalach: e.target.value }))}
              placeholder="120, 150, 180"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exang">Exercise Induced Angina</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, exang: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No (0)</SelectItem>
                <SelectItem value="1">Yes (1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="oldpeak">ST Depression (Exercise vs Rest)</Label>
            <Input
              id="oldpeak"
              type="number"
              step="0.1"
              value={formData.oldpeak}
              onChange={(e) => setFormData((prev) => ({ ...prev, oldpeak: e.target.value }))}
              placeholder="0.0, 1.5, 2.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slope">Peak Exercise ST Segment Slope</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, slope: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select slope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Upsloping (0)</SelectItem>
                <SelectItem value="1">Flat (1)</SelectItem>
                <SelectItem value="2">Downsloping (2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ca">Major Vessels Colored by Fluoroscopy</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, ca: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thal">Thalassemia</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, thal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Normal (1)</SelectItem>
                <SelectItem value="2">Fixed Defect (2)</SelectItem>
                <SelectItem value="3">Reversible Defect (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Heart Disease Presence</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No (0)</SelectItem>
                <SelectItem value="1">Yes (1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle and Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            Lifestyle & Nutrition Factors
          </CardTitle>
          <CardDescription>Daily habits and nutritional patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="family_history_with_overweight">Family History of Overweight</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, family_history_with_overweight: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="FAVC">Frequent High-Calorie Food Consumption</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, FAVC: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="NCP">Number of Main Meals Per Day</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, NCP: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="CAEC">Food Between Meals</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, CAEC: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="sometimes">Sometimes</SelectItem>
                  <SelectItem value="frequently">Frequently</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="SMOKE">Smoking Status</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, SMOKE: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="CH2O">Water Consumption (Liters/Day)</Label>
              <Input
                id="CH2O"
                type="number"
                step="0.1"
                value={formData.CH2O}
                onChange={(e) => setFormData((prev) => ({ ...prev, CH2O: e.target.value }))}
                placeholder="1.5, 2.0, 2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="SCC">Monitor Caloric Consumption</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, SCC: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="TUE">Electronic Device Usage (hours/day)</Label>
              <Input
                id="TUE"
                type="number"
                step="0.1"
                value={formData.TUE}
                onChange={(e) => setFormData((prev) => ({ ...prev, TUE: e.target.value }))}
                placeholder="0.5, 1.0, 1.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="CALC">Alcohol Consumption</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, CALC: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="sometimes">Sometimes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="MTRANS">Mode of Transportation</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, MTRANS: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public_transportation">Public Transportation</SelectItem>
                  <SelectItem value="automobile">Automobile</SelectItem>
                  <SelectItem value="walking">Walking</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vegetable Consumption Frequency (1-3 scale)</Label>
            <div className="px-3">
              <Slider
                value={formData.FCVC}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, FCVC: value }))}
                max={3}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low (1)</span>
                <span>Current: {formData.FCVC[0]}</span>
                <span>High (3)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Physical Activity Frequency (0-3 scale)</Label>
            <div className="px-3">
              <Slider
                value={formData.FAF}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, FAF: value }))}
                max={3}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>None (0)</span>
                <span>Current: {formData.FAF[0]}</span>
                <span>High (3)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diabetes and Metabolic Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-amber-500" />
            Diabetes & Metabolic Factors
          </CardTitle>
          <CardDescription>Diabetes-related parameters and metabolic health indicators</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="Target">Diabetes Type</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, Target: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steroid_induced">Steroid-Induced Diabetes</SelectItem>
                <SelectItem value="type_1">Type 1 Diabetes</SelectItem>
                <SelectItem value="type_2">Type 2 Diabetes</SelectItem>
                <SelectItem value="gestational">Gestational Diabetes</SelectItem>
                <SelectItem value="none">No Diabetes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="geneticMarkers">Genetic Markers</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, geneticMarkers: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoantibodies">Autoantibodies</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, autoantibodies: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyHistory">Family History of Diabetes</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, familyHistory: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environmentalFactors">Environmental Risk Factors</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, environmentalFactors: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insulinLevels">Insulin Level (μU/mL)</Label>
            <Input
              id="insulinLevels"
              type="number"
              value={formData.insulinLevels}
              onChange={(e) => setFormData((prev) => ({ ...prev, insulinLevels: e.target.value }))}
              placeholder="10, 50, 100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGlucoseLevels">Blood Glucose Level (mg/dL)</Label>
            <Input
              id="bloodGlucoseLevels"
              type="number"
              value={formData.bloodGlucoseLevels}
              onChange={(e) => setFormData((prev) => ({ ...prev, bloodGlucoseLevels: e.target.value }))}
              placeholder="80, 120, 200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waistCircumference">Waist Circumference (cm)</Label>
            <Input
              id="waistCircumference"
              type="number"
              value={formData.waistCircumference}
              onChange={(e) => setFormData((prev) => ({ ...prev, waistCircumference: e.target.value }))}
              placeholder="80, 90, 100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="glucoseToleranceTest">Glucose Tolerance Test</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, glucoseToleranceTest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="impaired">Impaired</SelectItem>
                <SelectItem value="diabetic">Diabetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reproductive Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-pink-500" />
            Reproductive Health
          </CardTitle>
          <CardDescription>Pregnancy and reproductive health factors</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="historyOfPCOS">History of PCOS</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, historyOfPCOS: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousGestationalDiabetes">Previous Gestational Diabetes</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, previousGestationalDiabetes: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pregnancyHistory">Pregnancy History</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, pregnancyHistory: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weightGainDuringPregnancy">Excess Weight Gain During Pregnancy</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, weightGainDuringPregnancy: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Organ Function Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-purple-500" />
            Organ Function & Specialized Tests
          </CardTitle>
          <CardDescription>Organ function assessments and specialized medical tests</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pancreaticHealth">Pancreatic Health Status</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, pancreaticHealth: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="abnormal">Abnormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pulmonaryFunction">Pulmonary Function Test</Label>
            <Input
              id="pulmonaryFunction"
              type="number"
              value={formData.pulmonaryFunction}
              onChange={(e) => setFormData((prev) => ({ ...prev, pulmonaryFunction: e.target.value }))}
              placeholder="Numerical value (e.g., 76)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cysticFibrosisdiagnosis">Cystic Fibrosis Diagnosis</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, cysticFibrosisdiagnosis: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="steroidUseHistory">History of Steroid Use</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, steroidUseHistory: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="geneticTesting">Genetic Testing Result</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, geneticTesting: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neurologicalAssessments">Neurological Assessment Score</Label>
            <Input
              id="neurologicalAssessments"
              type="number"
              value={formData.neurologicalAssessments}
              onChange={(e) => setFormData((prev) => ({ ...prev, neurologicalAssessments: e.target.value }))}
              placeholder="Score (e.g., 1, 2, 3)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liverFunctionTests">Liver Function Tests</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, liverFunctionTests: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="abnormal">Abnormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="digestiveEnzymeLevels">Digestive Enzyme Levels</Label>
            <Input
              id="digestiveEnzymeLevels"
              type="number"
              value={formData.digestiveEnzymeLevels}
              onChange={(e) => setFormData((prev) => ({ ...prev, digestiveEnzymeLevels: e.target.value }))}
              placeholder="Numerical value (e.g., 56)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urineTest">Urine Test Results</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, urineTest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ketones_present">Ketones Present</SelectItem>
                <SelectItem value="glucose_present">Glucose Present</SelectItem>
                <SelectItem value="protein_present">Protein Present</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="earlyOnsetSymptoms">Early Onset Symptoms</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, earlyOnsetSymptoms: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
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

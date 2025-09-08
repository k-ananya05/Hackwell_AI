"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp, Users } from "lucide-react"

export function ExplainabilityDashboard() {
  const aiInsights = [
    {
      id: 1,
      type: "Risk Prediction",
      patient: "John Smith (P001)",
      confidence: 87,
      prediction: "Low risk of readmission",
      factors: ["Stable vitals", "Medication compliance", "Regular follow-ups"],
      recommendation: "Continue current treatment plan",
      status: "active",
    },
    {
      id: 2,
      type: "Treatment Optimization",
      patient: "Sarah Johnson (P002)",
      confidence: 92,
      prediction: "Medication adjustment recommended",
      factors: ["Blood sugar trends", "Weight changes", "Exercise patterns"],
      recommendation: "Consider increasing Metformin dosage",
      status: "pending",
    },
    {
      id: 3,
      type: "Early Warning",
      patient: "Michael Brown (P003)",
      confidence: 78,
      prediction: "Potential cardiac event risk",
      factors: ["Irregular heart rhythm", "Blood pressure spikes", "Stress indicators"],
      recommendation: "Schedule immediate cardiology consultation",
      status: "urgent",
    },
  ]

  const modelPerformance = [
    { model: "Risk Prediction Model", accuracy: 94.2, lastUpdated: "2024-01-15" },
    { model: "Treatment Response Model", accuracy: 89.7, lastUpdated: "2024-01-14" },
    { model: "Readmission Prediction", accuracy: 91.5, lastUpdated: "2024-01-13" },
    { model: "Drug Interaction Checker", accuracy: 97.8, lastUpdated: "2024-01-15" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Info className="h-4 w-4 text-yellow-600" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Insights & Explainability</h1>
          <p className="text-muted-foreground mt-2">Understanding AI-driven medical insights and recommendations</p>
        </div>
        <Button variant="outline">
          <Brain className="mr-2 h-4 w-4" />
          Model Settings
        </Button>
      </div>

      {/* AI Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Predictions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Model Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">93.1%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patients Analyzed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">100%</span> coverage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="explanations">How It Works</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(insight.status)}
                      <div>
                        <CardTitle className="text-lg">{insight.type}</CardTitle>
                        <CardDescription>{insight.patient}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(insight.status)}>{insight.status}</Badge>
                      <Badge variant="outline">Confidence: {insight.confidence}%</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">AI Prediction</h4>
                    <p className="text-sm text-muted-foreground">{insight.prediction}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {insight.factors.map((factor, index) => (
                        <Badge key={index} variant="secondary">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendation</h4>
                    <p className="text-sm">{insight.recommendation}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Confidence Level</h4>
                    <div className="flex items-center gap-3">
                      <Progress value={insight.confidence} className="flex-1" />
                      <span className="text-sm font-medium">{insight.confidence}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm">Accept Recommendation</Button>
                    <Button variant="outline" size="sm">
                      Request More Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Current accuracy and status of deployed models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modelPerformance.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{model.model}</h4>
                      <p className="text-sm text-muted-foreground">Last updated: {model.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{model.accuracy}%</p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                      <Progress value={model.accuracy} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explanations">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How Our AI Works</CardTitle>
                <CardDescription>Understanding the technology behind medical predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Prediction Model</h4>
                  <p className="text-sm text-muted-foreground">
                    Uses machine learning algorithms trained on historical patient data to identify patterns that
                    indicate potential health risks. The model analyzes vital signs, lab results, medication history,
                    and lifestyle factors to generate risk scores.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Treatment Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzes patient response patterns to different treatments and medications. The AI considers factors
                    like age, weight, medical history, and genetic markers to suggest personalized treatment
                    adjustments.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Early Warning System</h4>
                  <p className="text-sm text-muted-foreground">
                    Continuously monitors patient data streams to detect subtle changes that may indicate deteriorating
                    health conditions. The system alerts healthcare providers before critical events occur.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Confidence Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Each prediction includes a confidence score based on data quality, model certainty, and historical
                    accuracy. Higher confidence scores indicate more reliable predictions that can guide clinical
                    decisions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Privacy & Security</CardTitle>
                <CardDescription>How we protect patient information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">HIPAA Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    All AI models are trained and operated in full compliance with HIPAA regulations. Patient data is
                    encrypted, anonymized, and access is strictly controlled.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Federated Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Our models are trained using federated learning techniques, which means patient data never leaves
                    your facility. Only model updates are shared to improve overall performance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

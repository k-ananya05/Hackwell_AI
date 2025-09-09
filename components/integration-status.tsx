"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/lib/auth"

export function IntegrationStatus() {
  const { isAuthenticated, user } = useAuth()
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [backendData, setBackendData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkIntegration = async () => {
    setApiStatus('checking')
    setError(null)
    
    try {
      // Test multiple endpoints to verify integration
      const [health, patients, analytics] = await Promise.all([
        apiClient.healthCheck(),
        apiClient.getPatients(0, 3),
        apiClient.getAnalytics()
      ])
      
      setBackendData({
        health,
        patientCount: patients.length,
        analytics
      })
      setApiStatus('connected')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
      setApiStatus('error')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      checkIntegration()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Frontend-Backend Integration Status
          <Button
            variant="outline"
            size="sm"
            onClick={checkIntegration}
            disabled={apiStatus === 'checking'}
          >
            {apiStatus === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Authentication Status */}
          <div className="flex items-center justify-between">
            <span>Authentication</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Connected as {user?.full_name}
            </Badge>
          </div>

          {/* API Connection Status */}
          <div className="flex items-center justify-between">
            <span>Backend API</span>
            <Badge variant="outline" className="flex items-center gap-1">
              {apiStatus === 'connected' ? (
                <>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Connected
                </>
              ) : apiStatus === 'error' ? (
                <>
                  <XCircle className="h-3 w-3 text-red-500" />
                  Error
                </>
              ) : (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking...
                </>
              )}
            </Badge>
          </div>

          {/* Data Integration */}
          {backendData && (
            <>
              <div className="flex items-center justify-between">
                <span>Patient Data</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {backendData.patientCount} patients loaded
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Analytics</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Dashboard metrics active
                </Badge>
              </div>
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              Error: {error}
            </div>
          )}

          {apiStatus === 'connected' && (
            <div className="text-green-600 text-sm p-2 bg-green-50 rounded">
              ✅ Integration successful! Frontend is connected to backend API.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

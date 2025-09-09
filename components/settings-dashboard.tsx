"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Bell, Shield, Database, Palette, Globe, Save, AlertTriangle, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/lib/auth"

export function SettingsDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<{
    profile: null | 'saving' | 'success' | 'error',
    notifications: null | 'saving' | 'success' | 'error',
    preferences: null | 'saving' | 'success' | 'error',
    security: null | 'saving' | 'success' | 'error'
  }>({
    profile: null,
    notifications: null,
    preferences: null,
    security: null
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    criticalAlerts: true,
    weeklyReports: false,
  })

  const [profile, setProfile] = useState({
    name: user?.full_name || "Dr. Sarah Johnson",
    email: user?.email || "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    department: "Cardiology",
    license: "MD123456789",
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    defaultView: "dashboard",
  })

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAlerts: true,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get user settings from API
        const userSettings = await apiClient.getUserSettings()
        
        // Update local state with fetched settings
        if (userSettings) {
          if (userSettings.notifications) {
            setNotifications(userSettings.notifications)
          }
          
          if (userSettings.preferences) {
            setPreferences(userSettings.preferences)
          }
          
          if (userSettings.security) {
            setSecurity(userSettings.security)
          }
        }
        
        // Get user profile from API
        const userProfile = await apiClient.getUserProfile()
        
        if (userProfile) {
          setProfile({
            name: userProfile.full_name || user?.full_name || "Dr. Sarah Johnson",
            email: userProfile.email || user?.email || "sarah.johnson@hospital.com",
            phone: userProfile.phone || "+1 (555) 123-4567",
            department: userProfile.department || "Cardiology",
            license: userProfile.license || "MD123456789",
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch settings')
        console.error('Error fetching settings:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [user])

  const handleSaveProfile = async () => {
    try {
      setSaveStatus(prev => ({ ...prev, profile: 'saving' }))
      await apiClient.updateUserProfile(profile)
      setSaveStatus(prev => ({ ...prev, profile: 'success' }))
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, profile: null }))
      }, 3000)
    } catch (err) {
      setSaveStatus(prev => ({ ...prev, profile: 'error' }))
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      console.error('Error saving profile:', err)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, profile: null }))
      }, 3000)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      setSaveStatus(prev => ({ ...prev, notifications: 'saving' }))
      await apiClient.updateUserSettings({ notifications })
      setSaveStatus(prev => ({ ...prev, notifications: 'success' }))
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, notifications: null }))
      }, 3000)
    } catch (err) {
      setSaveStatus(prev => ({ ...prev, notifications: 'error' }))
      setError(err instanceof Error ? err.message : 'Failed to update notifications')
      console.error('Error saving notifications:', err)
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, notifications: null }))
      }, 3000)
    }
  }

  const handleSavePreferences = async () => {
    try {
      setSaveStatus(prev => ({ ...prev, preferences: 'saving' }))
      await apiClient.updateUserSettings({ preferences })
      setSaveStatus(prev => ({ ...prev, preferences: 'success' }))
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, preferences: null }))
      }, 3000)
    } catch (err) {
      setSaveStatus(prev => ({ ...prev, preferences: 'error' }))
      setError(err instanceof Error ? err.message : 'Failed to update preferences')
      console.error('Error saving preferences:', err)
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, preferences: null }))
      }, 3000)
    }
  }

  const handleSaveSecurity = async () => {
    try {
      setSaveStatus(prev => ({ ...prev, security: 'saving' }))
      await apiClient.updateUserSettings({ security })
      setSaveStatus(prev => ({ ...prev, security: 'success' }))
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, security: null }))
      }, 3000)
    } catch (err) {
      setSaveStatus(prev => ({ ...prev, security: 'error' }))
      setError(err instanceof Error ? err.message : 'Failed to update security settings')
      console.error('Error saving security:', err)
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, security: null }))
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and system configuration</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">Error loading settings: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={profile.department}
                    onValueChange={(value) => setProfile({ ...profile, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Emergency">Emergency Medicine</SelectItem>
                      <SelectItem value="Internal">Internal Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Medical License</Label>
                  <Input
                    id="license"
                    value={profile.license}
                    onChange={(e) => setProfile({ ...profile, license: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                {saveStatus.profile === 'success' && (
                  <span className="text-sm text-green-600">Profile saved successfully!</span>
                )}
                {saveStatus.profile === 'error' && (
                  <span className="text-sm text-red-600">Error saving profile</span>
                )}
                <Button 
                  onClick={handleSaveProfile}
                  disabled={saveStatus.profile === 'saving'}
                >
                  {saveStatus.profile === 'saving' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Patient Alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate alerts for critical patient conditions</p>
                  </div>
                  <Switch
                    checked={notifications.criticalAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, criticalAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of patient statistics</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                {saveStatus.notifications === 'success' && (
                  <span className="text-sm text-green-600">Notification settings saved!</span>
                )}
                {saveStatus.notifications === 'error' && (
                  <span className="text-sm text-red-600">Error saving notification settings</span>
                )}
                <Button 
                  onClick={handleSaveNotifications}
                  disabled={saveStatus.notifications === 'saving'}
                >
                  {saveStatus.notifications === 'saving' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default View</Label>
                  <Select
                    value={preferences.defaultView}
                    onValueChange={(value) => setPreferences({ ...preferences, defaultView: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="patients">Patients</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                {saveStatus.preferences === 'success' && (
                  <span className="text-sm text-green-600">Preferences saved!</span>
                )}
                {saveStatus.preferences === 'error' && (
                  <span className="text-sm text-red-600">Error saving preferences</span>
                )}
                <Button 
                  onClick={handleSavePreferences}
                  disabled={saveStatus.preferences === 'saving'}
                >
                  {saveStatus.preferences === 'saving' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={security.twoFactor ? "default" : "secondary"}>
                      {security.twoFactor ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Select
                    value={security.passwordExpiry}
                    onValueChange={(value) => setSecurity({ ...security, passwordExpiry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For enhanced security, we recommend enabling two-factor authentication and setting a session timeout
                  of 30 minutes or less.
                </AlertDescription>
              </Alert>

              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button variant="outline">Change Password</Button>
                  {saveStatus.security === 'success' && (
                    <span className="text-sm text-green-600">Security settings saved!</span>
                  )}
                  {saveStatus.security === 'error' && (
                    <span className="text-sm text-red-600">Error saving security settings</span>
                  )}
                </div>
                <Button 
                  onClick={handleSaveSecurity}
                  disabled={saveStatus.security === 'saving'}
                >
                  {saveStatus.security === 'saving' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>View system status and configuration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Application Version</Label>
                    <p className="text-sm text-muted-foreground">v2.1.4</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Database Status</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Backup</Label>
                    <p className="text-sm text-muted-foreground">2024-01-15 03:00 AM</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Server Status</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">AI Models Status</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Storage Usage</Label>
                    <p className="text-sm text-muted-foreground">2.4 GB / 10 GB</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">System Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Database className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    System Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  )
}

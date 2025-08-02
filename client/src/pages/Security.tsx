import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Eye, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Download
} from "lucide-react";

export default function Security() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [apiAccessEnabled, setApiAccessEnabled] = useState(true);
  const [auditLogsEnabled, setAuditLogsEnabled] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  // Mock security data
  const securityMetrics = {
    threatLevel: "Low",
    lastScan: "2024-01-19 14:32:15",
    activeConnections: 5,
    failedAttempts: 0,
    uptime: "99.8%",
  };

  const recentActivity = [
    { time: "14:30", action: "Admin login", user: "admin", status: "success" },
    { time: "14:25", action: "Configuration change", user: "admin", status: "success" },
    { time: "14:20", action: "GPU optimization", user: "system", status: "success" },
    { time: "14:15", action: "Pool failover", user: "system", status: "warning" },
    { time: "14:10", action: "Alert cleared", user: "admin", status: "success" },
  ];

  const accessLogs = [
    { timestamp: "2024-01-19 14:30:15", ip: "192.168.1.100", action: "Dashboard access", result: "Allowed" },
    { timestamp: "2024-01-19 14:25:42", ip: "192.168.1.100", action: "Configuration change", result: "Allowed" },
    { timestamp: "2024-01-19 14:20:13", ip: "10.0.0.15", action: "API request", result: "Allowed" },
    { timestamp: "2024-01-19 14:15:37", ip: "192.168.1.200", action: "Login attempt", result: "Blocked" },
    { timestamp: "2024-01-19 14:10:28", ip: "192.168.1.100", action: "GPU monitoring", result: "Allowed" },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="security-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Shield className="h-8 w-8 text-emerald-400" />
            Security & Access Control
          </h1>
          <p className="text-slate-400 mt-2">
            Manage security settings, access controls, and monitor system activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-security-scan">
            <RefreshCw className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
          <Button variant="outline" data-testid="button-export-logs">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-slate-400 text-sm">Threat Level</div>
            <div className="text-2xl font-bold text-emerald-400" data-testid="security-threat-level">
              {securityMetrics.threatLevel}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-slate-400 text-sm">Last Security Scan</div>
            <div className="text-sm font-medium text-slate-50" data-testid="security-last-scan">
              {securityMetrics.lastScan}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-slate-400 text-sm">Active Connections</div>
            <div className="text-2xl font-bold text-slate-50" data-testid="security-active-connections">
              {securityMetrics.activeConnections}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-slate-400 text-sm">Failed Attempts</div>
            <div className="text-2xl font-bold text-emerald-400" data-testid="security-failed-attempts">
              {securityMetrics.failedAttempts}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-slate-400 text-sm">System Uptime</div>
            <div className="text-2xl font-bold text-slate-50" data-testid="security-uptime">
              {securityMetrics.uptime}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="authentication" data-testid="tab-authentication">
            <Key className="h-4 w-4 mr-2" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="access" data-testid="tab-access">
            <Users className="h-4 w-4 mr-2" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="monitoring" data-testid="tab-monitoring">
            <Eye className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="logs" data-testid="tab-logs">
            <FileText className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Authentication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa-enabled" className="text-slate-200">
                    Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="2fa-enabled"
                  checked={is2FAEnabled}
                  onCheckedChange={setIs2FAEnabled}
                  data-testid="switch-2fa"
                />
              </div>

              {is2FAEnabled && (
                <Alert className="border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <AlertDescription className="text-emerald-400">
                    Two-factor authentication is enabled. Your account is more secure.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="text-slate-200 mb-2 block">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="Enter current password"
                    data-testid="input-current-password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password" className="text-slate-200 mb-2 block">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="Enter new password"
                    data-testid="input-new-password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password" className="text-slate-200 mb-2 block">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="Confirm new password"
                    data-testid="input-confirm-password"
                  />
                </div>
                
                <Button className="bg-emerald-500 hover:bg-emerald-600" data-testid="button-change-password">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-slate-200 font-medium">Current Session</div>
                    <div className="text-slate-400 text-sm">Started: Jan 19, 2024 at 14:30</div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm">Session ID</div>
                    <div className="text-slate-50 text-sm font-mono">sess_1a2b3c4d5e6f7g8h</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">IP Address</div>
                    <div className="text-slate-50 text-sm">192.168.1.100</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">User Agent</div>
                    <div className="text-slate-50 text-sm">Chrome 120.0.0.0</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Location</div>
                    <div className="text-slate-50 text-sm">Local Network</div>
                  </div>
                </div>
                
                <Button variant="outline" className="text-red-400 hover:text-red-300 hover:border-red-400" data-testid="button-terminate-session">
                  <Unlock className="h-4 w-4 mr-2" />
                  Terminate Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">API Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="api-access" className="text-slate-200">
                    API Access Enabled
                  </Label>
                  <p className="text-slate-400 text-sm">Allow external applications to access the API</p>
                </div>
                <Switch
                  id="api-access"
                  checked={apiAccessEnabled}
                  onCheckedChange={setApiAccessEnabled}
                  data-testid="switch-api-access"
                />
              </div>

              {apiAccessEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key" className="text-slate-200 mb-2 block">
                      API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        value="sk-1234567890abcdef"
                        readOnly
                        className="bg-slate-700 border-slate-600 text-slate-50 font-mono"
                        data-testid="input-api-key"
                      />
                      <Button variant="outline" data-testid="button-regenerate-api-key">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="allowed-ips" className="text-slate-200 mb-2 block">
                      Allowed IP Addresses
                    </Label>
                    <Input
                      id="allowed-ips"
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="192.168.1.0/24, 10.0.0.0/8"
                      data-testid="input-allowed-ips"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Security Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-200">Data Encryption</Label>
                  <p className="text-slate-400 text-sm">Encrypt sensitive data at rest and in transit</p>
                </div>
                <Switch
                  checked={encryptionEnabled}
                  onCheckedChange={setEncryptionEnabled}
                  data-testid="switch-encryption"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-200">Audit Logging</Label>
                  <p className="text-slate-400 text-sm">Log all security-related events</p>
                </div>
                <Switch
                  checked={auditLogsEnabled}
                  onCheckedChange={setAuditLogsEnabled}
                  data-testid="switch-audit-logs"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <Label htmlFor="session-timeout" className="text-slate-200 mb-2 block">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue="60"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="input-session-timeout"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-login-attempts" className="text-slate-200 mb-2 block">
                    Max Login Attempts
                  </Label>
                  <Input
                    id="max-login-attempts"
                    type="number"
                    defaultValue="5"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="input-max-login-attempts"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Recent Security Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                    data-testid={`activity-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-emerald-500' :
                        activity.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="text-slate-200 text-sm font-medium">{activity.action}</div>
                        <div className="text-slate-400 text-xs">by {activity.user}</div>
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Threat Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-emerald-400 font-medium">No threats detected</p>
                <p className="text-slate-400 text-sm mt-1">Your system is secure</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Access Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-slate-400 border-b border-slate-700 pb-2">
                  <div>Timestamp</div>
                  <div>IP Address</div>
                  <div>Action</div>
                  <div>Result</div>
                </div>
                
                {accessLogs.map((log, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-slate-700 hover:bg-slate-700/50"
                    data-testid={`access-log-${index}`}
                  >
                    <div className="text-slate-300">{log.timestamp}</div>
                    <div className="text-slate-300 font-mono">{log.ip}</div>
                    <div className="text-slate-300">{log.action}</div>
                    <div className={`font-medium ${
                      log.result === 'Allowed' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {log.result}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-slate-400 text-sm">Showing 5 of 247 entries</p>
                <Button variant="outline" size="sm" data-testid="button-load-more-logs">
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No security events in the last 24 hours</p>
                <p className="text-slate-500 text-sm mt-1">This is good news!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

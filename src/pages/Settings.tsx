import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon,
  Building2,
  Clock,
  Bell,
  Download,
  Trash2,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import companyLogo from '@/assets/company-logo.jpg';

export default function Settings() {
  const [companyName, setCompanyName] = useState('Vishwakarma World Private Limited');
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [lateThreshold, setLateThreshold] = useState('10:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoCheckout, setAutoCheckout] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('vwpl_employees');
      localStorage.removeItem('vwpl_attendance');
      toast.success('All data cleared. Refresh the page to see changes.');
    }
  };

  const handleDownloadData = () => {
    const employees = localStorage.getItem('vwpl_employees') || '[]';
    const attendance = localStorage.getItem('vwpl_attendance') || '[]';
    
    const data = {
      exportDate: new Date().toISOString(),
      employees: JSON.parse(employees),
      attendance: JSON.parse(attendance)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vwpl-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const handleInstallApp = () => {
    toast.info('To install this app on your desktop, use your browser\'s "Install App" feature from the address bar or menu.');
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your attendance system</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Settings
              </CardTitle>
              <CardDescription>Basic company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={companyLogo} 
                  alt="Company Logo"
                  className="h-16 w-16 rounded-lg object-contain bg-muted p-2"
                />
                <div className="flex-1">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Work Hours
              </CardTitle>
              <CardDescription>Set work timing rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="workStart">Work Start Time</Label>
                  <Input
                    id="workStart"
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lateThreshold">Late Threshold</Label>
                  <Input
                    id="lateThreshold"
                    type="time"
                    value={lateThreshold}
                    onChange={(e) => setLateThreshold(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Employees checking in after {lateThreshold} will be marked as late
              </p>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-warning" />
                Notifications
              </CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Show alerts for check-ins and check-outs
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Check-out</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically check out at end of day
                  </p>
                </div>
                <Switch
                  checked={autoCheckout}
                  onCheckedChange={setAutoCheckout}
                />
              </div>
            </CardContent>
          </Card>

          {/* Desktop App */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-success" />
                Desktop App
              </CardTitle>
              <CardDescription>Install as desktop application</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Install this application on your desktop for quick access. Works offline!
              </p>
              <Button onClick={handleInstallApp} variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Install Desktop App
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Export or clear your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleDownloadData} variant="secondary" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button onClick={handleClearData} variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

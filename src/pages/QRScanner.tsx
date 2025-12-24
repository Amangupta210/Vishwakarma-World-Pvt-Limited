import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
  Camera,
  CheckCircle,
  XCircle,
  Search,
  CameraOff,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function QRScanner() {
  const { employees, checkIn, checkOut, getTodayAttendance } = useData();
  const [manualInput, setManualInput] = useState('');
  const [lastScanned, setLastScanned] = useState<{
    employee: typeof employees[0];
    action: 'checkin' | 'checkout';
    time: string;
  } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const todayAttendance = getTodayAttendance();

  useEffect(() => {
    // Check camera permission on mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));
    }
  }, []);

  const handleManualSearch = () => {
    if (!manualInput.trim()) {
      toast.error('Please enter an employee ID');
      return;
    }

    processEmployeeId(manualInput.trim());
    setManualInput('');
  };

  const processEmployeeId = (input: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    let employeeId = input;
    
    // Try to parse as QR JSON data
    try {
      const qrData = JSON.parse(input);
      employeeId = qrData.employeeId || qrData.id || input;
    } catch {
      // Not JSON, check if it's just the ID
      employeeId = input.toUpperCase();
    }

    const employee = employees.find(
      e => e.employeeId.toUpperCase() === employeeId.toUpperCase() ||
           e.id === employeeId
    );

    if (!employee) {
      toast.error('Employee not found');
      setIsProcessing(false);
      return;
    }

    processAttendance(employee);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const processAttendance = (employee: typeof employees[0]) => {
    const existingRecord = todayAttendance.find(a => a.employeeId === employee.id);
    const now = new Date().toLocaleTimeString('en-US', { hour12: true });

    if (!existingRecord) {
      checkIn(employee.id);
      setLastScanned({ employee, action: 'checkin', time: now });
      toast.success(`${employee.name} checked in at ${now}`);
    } else if (!existingRecord.checkOut) {
      checkOut(employee.id);
      setLastScanned({ employee, action: 'checkout', time: now });
      toast.success(`${employee.name} checked out at ${now}`);
    } else {
      toast.info(`${employee.name} has already checked out today`);
      setLastScanned({ employee, action: 'checkout', time: existingRecord.checkOut });
    }
  };

  const handleQRScan = (result: { rawValue: string }[]) => {
    if (result && result.length > 0 && result[0].rawValue) {
      processEmployeeId(result[0].rawValue);
    }
  };

  const handleQRError = (error: unknown) => {
    console.error('QR Scanner Error:', error);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Scanner</h1>
          <p className="text-muted-foreground">Scan employee QR codes for attendance</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scanner Area */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                {isCameraActive ? 'Position the QR code within the frame' : 'Click to start camera'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square overflow-hidden rounded-xl border-4 border-dashed border-primary/30 bg-muted/50">
                {isCameraActive ? (
                  <div className="h-full w-full">
                    <Scanner
                      onScan={handleQRScan}
                      onError={handleQRError}
                      constraints={{ facingMode: 'environment' }}
                      styles={{
                        container: { width: '100%', height: '100%' },
                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                      }}
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm font-medium">Processing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    {hasPermission === false ? (
                      <>
                        <CameraOff className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-center text-muted-foreground">
                          Camera access denied.<br />
                          Please enable camera permissions.
                        </p>
                      </>
                    ) : (
                      <>
                        <Camera className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-muted-foreground">Camera is not active</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  variant={isCameraActive ? 'secondary' : 'default'}
                >
                  {isCameraActive ? (
                    <>
                      <CameraOff className="h-4 w-4" />
                      Stop Camera
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      Start Camera
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry & Result */}
          <div className="space-y-6">
            {/* Manual Entry */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-secondary" />
                  Manual Entry
                </CardTitle>
                <CardDescription>
                  Enter employee ID or paste QR data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Employee ID (e.g., VW001)"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                  />
                  <Button onClick={handleManualSearch} variant="secondary">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Last Scanned Result */}
            <Card className={lastScanned ? 'ring-2 ring-success' : ''}>
              <CardHeader>
                <CardTitle>Last Scanned</CardTitle>
              </CardHeader>
              <CardContent>
                {lastScanned ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {lastScanned.employee.photo ? (
                        <img 
                          src={lastScanned.employee.photo} 
                          alt={lastScanned.employee.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {lastScanned.employee.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{lastScanned.employee.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lastScanned.employee.employeeId} • {lastScanned.employee.department}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {lastScanned.action === 'checkin' ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-secondary" />
                        )}
                        <span className="font-medium">
                          {lastScanned.action === 'checkin' ? 'Checked In' : 'Checked Out'}
                        </span>
                        <span className="text-muted-foreground">at {lastScanned.time}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Camera className="mx-auto h-12 w-12 opacity-30" />
                    <p className="mt-2">No scans yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-success/10 p-4 text-center">
                    <p className="text-2xl font-bold text-success">
                      {todayAttendance.filter(a => a.checkIn).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Checked In</p>
                  </div>
                  <div className="rounded-lg bg-secondary/10 p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">
                      {todayAttendance.filter(a => a.checkOut).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Checked Out</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

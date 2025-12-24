import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { 
  Search, 
  Clock,
  UserCheck,
  UserX,
  LogIn,
  LogOut as LogOutIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Attendance() {
  const { employees, getTodayAttendance, checkIn, checkOut, shifts, getEmployeeCurrentShift } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const todayAttendance = getTodayAttendance();

  const filteredEmployees = employees.filter(emp => 
    emp.status === 'active' && (
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getEmployeeTodayRecord = (employeeId: string) => {
    return todayAttendance.find(a => a.employeeId === employeeId);
  };

  const handleCheckIn = (employee: { id: string; name: string }) => {
    checkIn(employee.id);
    toast.success(`${employee.name} checked in successfully!`);
  };

  const handleCheckOut = (employee: { id: string; name: string }) => {
    checkOut(employee.id);
    toast.success(`${employee.name} checked out successfully!`);
  };

  const presentCount = todayAttendance.filter(a => a.checkIn).length;
  const checkedOutCount = todayAttendance.filter(a => a.checkOut).length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Mark attendance for {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-success/20 p-3">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{presentCount}</p>
                <p className="text-sm text-muted-foreground">Present Today</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-secondary/20 p-3">
                <LogOutIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{checkedOutCount}</p>
                <p className="text-sm text-muted-foreground">Checked Out</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-destructive/20 p-3">
                <UserX className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeEmployees - presentCount}</p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              Mark check-in and check-out for employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Work Hours</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => {
                    const record = getEmployeeTodayRecord(employee.id);
                    const hasCheckedIn = !!record?.checkIn;
                    const hasCheckedOut = !!record?.checkOut;
                    const employeeShift = getEmployeeCurrentShift(employee.id);

                    return (
                      <TableRow key={employee.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                              {employee.photo ? (
                                <img 
                                  src={employee.photo} 
                                  alt={employee.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="font-semibold text-primary">
                                  {employee.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {employeeShift ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: employeeShift.color }}
                              />
                              <div>
                                <p className="text-sm font-medium">{employeeShift.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {employeeShift.startTime} - {employeeShift.endTime}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No shift</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record?.checkIn ? (
                            <span className="font-medium text-success">{record.checkIn}</span>
                          ) : (
                            <span className="text-muted-foreground">--:--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record?.checkOut ? (
                            <span className="font-medium text-secondary">{record.checkOut}</span>
                          ) : (
                            <span className="text-muted-foreground">--:--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record ? (
                            <Badge 
                              variant={
                                record.status === 'present' ? 'default' :
                                record.status === 'late' ? 'secondary' :
                                'outline'
                              }
                              className={
                                record.status === 'present' ? 'bg-success hover:bg-success/90' :
                                record.status === 'late' ? 'bg-warning hover:bg-warning/90' :
                                ''
                              }
                            >
                              {record.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              absent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {record?.workHours ? (
                            <span className="font-medium">{record.workHours.toFixed(2)} hrs</span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={hasCheckedIn ? 'outline' : 'default'}
                              disabled={hasCheckedIn}
                              onClick={() => handleCheckIn(employee)}
                              className="gap-1"
                            >
                              <LogIn className="h-4 w-4" />
                              Check In
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={!hasCheckedIn || hasCheckedOut}
                              onClick={() => handleCheckOut(employee)}
                              className="gap-1"
                            >
                              <LogOutIcon className="h-4 w-4" />
                              Check Out
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

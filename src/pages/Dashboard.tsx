import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { employees, getTodayAttendance, attendance } = useData();
  const todayAttendance = getTodayAttendance();

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const presentToday = todayAttendance.filter(a => a.checkIn).length;
  const checkedOut = todayAttendance.filter(a => a.checkOut).length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;

  const stats = [
    {
      title: 'Total Employees',
      value: activeEmployees,
      icon: Users,
      description: 'Active employees',
      color: 'from-primary to-primary/80'
    },
    {
      title: 'Present Today',
      value: presentToday,
      icon: UserCheck,
      description: `${checkedOut} checked out`,
      color: 'from-success to-success/80'
    },
    {
      title: 'Late Arrivals',
      value: lateToday,
      icon: Clock,
      description: 'After 10:00 AM',
      color: 'from-warning to-warning/80'
    },
    {
      title: 'Absent Today',
      value: activeEmployees - presentToday,
      icon: AlertCircle,
      description: 'Not checked in',
      color: 'from-destructive to-destructive/80'
    }
  ];

  const recentAttendance = [...todayAttendance]
    .sort((a, b) => {
      const timeA = a.checkIn || '';
      const timeB = b.checkIn || '';
      return timeB.localeCompare(timeA);
    })
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of today's attendance.
          </p>
        </div>

        {/* Date Display */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="overflow-hidden hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Today's Check-ins
              </CardTitle>
              <CardDescription>Recent attendance activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAttendance.length > 0 ? (
                <div className="space-y-4">
                  {recentAttendance.map((record) => {
                    const employee = employees.find(e => e.id === record.employeeId);
                    if (!employee) return null;
                    
                    return (
                      <div 
                        key={record.id} 
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-success">{record.checkIn}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            record.status === 'present' 
                              ? 'bg-success/10 text-success' 
                              : record.status === 'late'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No check-ins recorded today yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '500ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                Quick Stats
              </CardTitle>
              <CardDescription>Monthly overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <span className="text-xl font-bold text-success">
                      {activeEmployees > 0 
                        ? Math.round((presentToday / activeEmployees) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-success to-success/80 transition-all duration-500"
                      style={{ width: `${activeEmployees > 0 ? (presentToday / activeEmployees) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">{employees.length}</p>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{attendance.length}</p>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-dashed border-primary/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Use the QR Scanner for quick check-in/check-out
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { MonthlyReport } from '@/types/employee';
import { 
  FileText,
  Download,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import companyLogo from '@/assets/company-logo.jpg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

const CHART_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function Reports() {
  const { employees, attendance, shifts } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const monthlyReports = useMemo(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const daysInMonth = getDaysInMonth(new Date(year, month));
    
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));

    return employees
      .filter(emp => emp.status === 'active')
      .map(employee => {
        const empAttendance = attendance.filter(a => {
          const recordDate = new Date(a.date);
          return a.employeeId === employee.id &&
            recordDate.getMonth() === month &&
            recordDate.getFullYear() === year;
        });

        const presentDays = empAttendance.filter(a => a.status === 'present').length;
        const lateDays = empAttendance.filter(a => a.status === 'late').length;
        const halfDays = empAttendance.filter(a => a.status === 'half-day').length;
        const leaveDays = empAttendance.filter(a => a.status === 'leave').length;
        const absentDays = daysInMonth - presentDays - lateDays - halfDays - leaveDays;

        const totalWorkHours = empAttendance.reduce((sum, a) => sum + (a.workHours || 0), 0);

        const checkInTimes = empAttendance
          .filter(a => a.checkIn)
          .map(a => {
            const [hours, minutes] = (a.checkIn || '00:00').split(':');
            return parseInt(hours) * 60 + parseInt(minutes);
          });
        
        const checkOutTimes = empAttendance
          .filter(a => a.checkOut)
          .map(a => {
            const [hours, minutes] = (a.checkOut || '00:00').split(':');
            return parseInt(hours) * 60 + parseInt(minutes);
          });

        const avgCheckIn = checkInTimes.length > 0
          ? Math.round(checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length)
          : 0;
        
        const avgCheckOut = checkOutTimes.length > 0
          ? Math.round(checkOutTimes.reduce((a, b) => a + b, 0) / checkOutTimes.length)
          : 0;

        const formatTime = (minutes: number) => {
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        const shift = shifts.find(s => s.id === employee.shiftId);

        return {
          employeeId: employee.employeeId,
          employeeName: employee.name,
          department: employee.department,
          shift: shift?.name || 'No Shift',
          month: months[month],
          year,
          totalDays: daysInMonth,
          presentDays: presentDays + lateDays,
          absentDays: Math.max(0, absentDays),
          lateDays,
          halfDays,
          leaveDays,
          totalWorkHours: Math.round(totalWorkHours * 100) / 100,
          averageCheckIn: avgCheckIn > 0 ? formatTime(avgCheckIn) : '--:--',
          averageCheckOut: avgCheckOut > 0 ? formatTime(avgCheckOut) : '--:--'
        } as MonthlyReport & { department: string; shift: string };
      });
  }, [employees, attendance, shifts, selectedMonth, selectedYear]);

  // Chart data
  const barChartData = useMemo(() => {
    return monthlyReports.slice(0, 10).map(r => ({
      name: r.employeeName.split(' ')[0],
      Present: r.presentDays,
      Absent: r.absentDays,
      Late: r.lateDays
    }));
  }, [monthlyReports]);

  const pieChartData = useMemo(() => {
    const totalPresent = monthlyReports.reduce((sum, r) => sum + r.presentDays, 0);
    const totalAbsent = monthlyReports.reduce((sum, r) => sum + r.absentDays, 0);
    const totalLate = monthlyReports.reduce((sum, r) => sum + r.lateDays, 0);
    const totalHalfDay = monthlyReports.reduce((sum, r) => sum + r.halfDays, 0);
    const totalLeave = monthlyReports.reduce((sum, r) => sum + r.leaveDays, 0);

    return [
      { name: 'Present', value: totalPresent, color: '#22c55e' },
      { name: 'Absent', value: totalAbsent, color: '#ef4444' },
      { name: 'Late', value: totalLate, color: '#f59e0b' },
      { name: 'Half Day', value: totalHalfDay, color: '#3b82f6' },
      { name: 'Leave', value: totalLeave, color: '#8b5cf6' }
    ].filter(d => d.value > 0);
  }, [monthlyReports]);

  const departmentData = useMemo(() => {
    const deptMap = new Map<string, { present: number; absent: number; employees: number }>();
    
    monthlyReports.forEach(r => {
      const existing = deptMap.get(r.department) || { present: 0, absent: 0, employees: 0 };
      deptMap.set(r.department, {
        present: existing.present + r.presentDays,
        absent: existing.absent + r.absentDays,
        employees: existing.employees + 1
      });
    });

    return Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      Present: data.present,
      Absent: data.absent,
      Employees: data.employees
    }));
  }, [monthlyReports]);

  // Export functions
  const downloadPDF = () => {
    const pdf = new jsPDF('landscape');
    const month = months[parseInt(selectedMonth)];
    
    // Add logo
    pdf.addImage(companyLogo, 'JPEG', 14, 10, 25, 25);
    
    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(30, 64, 175);
    pdf.text('VISHWAKARMA WORLD PRIVATE LIMITED', 45, 20);
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Monthly Attendance Report - ${month} ${selectedYear}`, 45, 28);
    
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${format(new Date(), 'PPP')}`, 45, 35);

    // Summary Statistics
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const totalPresent = monthlyReports.reduce((sum, r) => sum + r.presentDays, 0);
    const totalAbsent = monthlyReports.reduce((sum, r) => sum + r.absentDays, 0);
    const totalWorkHours = monthlyReports.reduce((sum, r) => sum + r.totalWorkHours, 0);
    const avgAttendance = monthlyReports.length > 0 
      ? ((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(1) 
      : 0;

    pdf.text(`Total Employees: ${monthlyReports.length}`, 14, 45);
    pdf.text(`Total Present Days: ${totalPresent}`, 80, 45);
    pdf.text(`Total Absent Days: ${totalAbsent}`, 150, 45);
    pdf.text(`Attendance Rate: ${avgAttendance}%`, 220, 45);

    // Table
    const tableData = monthlyReports.map(r => [
      r.employeeId,
      r.employeeName,
      r.department,
      r.shift,
      r.presentDays.toString(),
      r.absentDays.toString(),
      r.lateDays.toString(),
      r.halfDays.toString(),
      r.totalWorkHours.toString(),
      r.averageCheckIn,
      r.averageCheckOut
    ]);

    autoTable(pdf, {
      startY: 55,
      head: [['ID', 'Name', 'Dept', 'Shift', 'Present', 'Absent', 'Late', 'Half Day', 'Work Hrs', 'Avg In', 'Avg Out']],
      body: tableData,
      theme: 'striped',
      headStyles: { 
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8
      },
      styles: { fontSize: 7, cellPadding: 2 },
      alternateRowStyles: { fillColor: [240, 240, 250] }
    });

    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${pageCount} | Vishwakarma World Private Limited`,
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    pdf.save(`attendance-report-${month}-${selectedYear}.pdf`);
  };

  const downloadExcel = () => {
    const month = months[parseInt(selectedMonth)];
    const headers = ['Employee ID', 'Name', 'Department', 'Shift', 'Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Work Hours', 'Avg Check In', 'Avg Check Out'];
    const data = monthlyReports.map(r => [
      r.employeeId,
      r.employeeName,
      r.department,
      r.shift,
      r.presentDays,
      r.absentDays,
      r.lateDays,
      r.halfDays,
      r.leaveDays,
      r.totalWorkHours,
      r.averageCheckIn,
      r.averageCheckOut
    ]);

    let tableHtml = '<table border="1">';
    tableHtml += '<tr><th colspan="12" style="background-color:#1e40af;color:white;font-size:16px;padding:15px;">VISHWAKARMA WORLD PRIVATE LIMITED - Attendance Report</th></tr>';
    tableHtml += `<tr><th colspan="12" style="background-color:#e5e7eb;padding:10px;">${month} ${selectedYear}</th></tr>`;
    tableHtml += '<tr>' + headers.map(h => `<th style="background-color:#3b82f6;color:white;font-weight:bold;padding:10px;">${h}</th>`).join('') + '</tr>';
    data.forEach(row => {
      tableHtml += '<tr>' + row.map(cell => `<td style="padding:8px;">${cell}</td>`).join('') + '</tr>';
    });
    
    // Add summary row
    const totalPresent = monthlyReports.reduce((sum, r) => sum + r.presentDays, 0);
    const totalAbsent = monthlyReports.reduce((sum, r) => sum + r.absentDays, 0);
    const totalWorkHours = monthlyReports.reduce((sum, r) => sum + r.totalWorkHours, 0);
    tableHtml += `<tr style="font-weight:bold;background-color:#f3f4f6;">
      <td colspan="4">TOTAL</td>
      <td>${totalPresent}</td>
      <td>${totalAbsent}</td>
      <td>${monthlyReports.reduce((sum, r) => sum + r.lateDays, 0)}</td>
      <td>${monthlyReports.reduce((sum, r) => sum + r.halfDays, 0)}</td>
      <td>${monthlyReports.reduce((sum, r) => sum + r.leaveDays, 0)}</td>
      <td>${totalWorkHours.toFixed(1)}</td>
      <td colspan="2">-</td>
    </tr>`;
    tableHtml += '</table>';

    const blob = new Blob([`
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"></head>
        <body>${tableHtml}</body>
      </html>
    `], { type: 'application/vnd.ms-excel' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance-report-${month}-${selectedYear}.xls`;
    link.click();
  };

  const downloadCSV = () => {
    const month = months[parseInt(selectedMonth)];
    const headers = ['Employee ID', 'Name', 'Department', 'Shift', 'Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Work Hours', 'Avg Check In', 'Avg Check Out'];
    const data = monthlyReports.map(r => [
      r.employeeId,
      r.employeeName,
      r.department,
      r.shift,
      r.presentDays,
      r.absentDays,
      r.lateDays,
      r.halfDays,
      r.leaveDays,
      r.totalWorkHours,
      r.averageCheckIn,
      r.averageCheckOut
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance-report-${month}-${selectedYear}.csv`;
    link.click();
  };

  const totalPresent = monthlyReports.reduce((sum, r) => sum + r.presentDays, 0);
  const totalAbsent = monthlyReports.reduce((sum, r) => sum + r.absentDays, 0);
  const totalWorkHours = monthlyReports.reduce((sum, r) => sum + r.totalWorkHours, 0);
  const avgAttendance = monthlyReports.length > 0 && (totalPresent + totalAbsent) > 0
    ? ((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(1)
    : '0';

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monthly Reports</h1>
            <p className="text-muted-foreground">View and download attendance reports with analytics</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4 text-destructive" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadExcel} className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4 text-success" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Present</p>
                  <p className="text-3xl font-bold text-success">{totalPresent}</p>
                </div>
                <div className="rounded-full bg-success/20 p-3">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Absent</p>
                  <p className="text-3xl font-bold text-destructive">{totalAbsent}</p>
                </div>
                <div className="rounded-full bg-destructive/20 p-3">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Work Hours</p>
                  <p className="text-3xl font-bold text-primary">{totalWorkHours.toFixed(1)}</p>
                </div>
                <div className="rounded-full bg-primary/20 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-3xl font-bold text-warning">{avgAttendance}%</p>
                </div>
                <div className="rounded-full bg-warning/20 p-3">
                  <Users className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bar Chart - Employee Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Employee Attendance Overview
              </CardTitle>
              <CardDescription>Present vs Absent days per employee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Overall Attendance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Attendance Distribution
              </CardTitle>
              <CardDescription>Overall attendance status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Department-wise Attendance
              </CardTitle>
              <CardDescription>Attendance breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {months[parseInt(selectedMonth)]} {selectedYear} Detailed Report
            </CardTitle>
            <CardDescription>
              Complete attendance summary for all {monthlyReports.length} employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Late</TableHead>
                    <TableHead className="text-center">Half Day</TableHead>
                    <TableHead className="text-center">Work Hours</TableHead>
                    <TableHead className="text-center">Avg Check In</TableHead>
                    <TableHead className="text-center">Avg Check Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReports.map((report) => (
                    <TableRow key={report.employeeId} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{report.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{report.department}</TableCell>
                      <TableCell>
                        <span className="text-sm">{report.shift}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium text-success">{report.presentDays}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium text-destructive">{report.absentDays}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium text-warning">{report.lateDays}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{report.halfDays}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{report.totalWorkHours}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground">{report.averageCheckIn}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground">{report.averageCheckOut}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

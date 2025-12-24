export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  photo?: string;
  status: 'active' | 'inactive';
  shiftId?: string;
  state?: string;
  workLocation?: string;
  fatherName?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  workHours?: number;
  notes?: string;
  shiftId?: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  lateThreshold: number; // minutes after start time
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate?: string;
  isRotating: boolean;
  rotationDays?: number;
}

export interface MonthlyReport {
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leaveDays: number;
  totalWorkHours: number;
  averageCheckIn: string;
  averageCheckOut: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

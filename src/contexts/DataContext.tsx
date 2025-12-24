import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, AttendanceRecord, Shift, ShiftAssignment } from '@/types/employee';

interface DataContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  shifts: Shift[];
  shiftAssignments: ShiftAssignment[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  getEmployeeAttendance: (employeeId: string, month?: number, year?: number) => AttendanceRecord[];
  getTodayAttendance: () => AttendanceRecord[];
  updateEmployeePhoto: (employeeId: string, photo: string) => void;
  batchUpdatePhotos: (updates: { employeeId: string; photo: string }[]) => void;
  addShift: (shift: Omit<Shift, 'id' | 'createdAt'>) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  assignShift: (assignment: Omit<ShiftAssignment, 'id'>) => void;
  removeShiftAssignment: (id: string) => void;
  getEmployeeCurrentShift: (employeeId: string) => Shift | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: 'vwpl_employees',
  ATTENDANCE: 'vwpl_attendance',
  SHIFTS: 'vwpl_shifts',
  SHIFT_ASSIGNMENTS: 'vwpl_shift_assignments'
};

// Sample employees for demo
const sampleEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'VW001',
    name: 'Rajesh Kumar',
    email: 'rajesh@vishwakarma.com',
    phone: '+91 9876543210',
    department: 'Engineering',
    designation: 'Senior Engineer',
    joiningDate: '2022-01-15',
    status: 'active',
    shiftId: '1',
    createdAt: '2022-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    employeeId: 'VW002',
    name: 'Priya Sharma',
    email: 'priya@vishwakarma.com',
    phone: '+91 9876543211',
    department: 'HR',
    designation: 'HR Manager',
    joiningDate: '2021-06-01',
    status: 'active',
    shiftId: '1',
    createdAt: '2021-06-01T00:00:00.000Z'
  },
  {
    id: '3',
    employeeId: 'VW003',
    name: 'Amit Patel',
    email: 'amit@vishwakarma.com',
    phone: '+91 9876543212',
    department: 'Production',
    designation: 'Production Supervisor',
    joiningDate: '2023-03-20',
    status: 'active',
    shiftId: '2',
    createdAt: '2023-03-20T00:00:00.000Z'
  },
  {
    id: '4',
    employeeId: 'VW004',
    name: 'Sunita Devi',
    email: 'sunita@vishwakarma.com',
    phone: '+91 9876543213',
    department: 'Accounts',
    designation: 'Accountant',
    joiningDate: '2022-08-10',
    status: 'active',
    shiftId: '1',
    createdAt: '2022-08-10T00:00:00.000Z'
  },
  {
    id: '5',
    employeeId: 'VW005',
    name: 'Vikram Singh',
    email: 'vikram@vishwakarma.com',
    phone: '+91 9876543214',
    department: 'Engineering',
    designation: 'Junior Engineer',
    joiningDate: '2024-01-05',
    status: 'active',
    shiftId: '3',
    createdAt: '2024-01-05T00:00:00.000Z'
  }
];

const sampleShifts: Shift[] = [
  {
    id: '1',
    name: 'Morning Shift',
    startTime: '09:00',
    endTime: '18:00',
    lateThreshold: 15,
    color: '#22c55e',
    isActive: true,
    createdAt: '2022-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Afternoon Shift',
    startTime: '14:00',
    endTime: '23:00',
    lateThreshold: 15,
    color: '#3b82f6',
    isActive: true,
    createdAt: '2022-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '07:00',
    lateThreshold: 15,
    color: '#8b5cf6',
    isActive: true,
    createdAt: '2022-01-01T00:00:00.000Z'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const storedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    const storedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const storedShifts = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    const storedAssignments = localStorage.getItem(STORAGE_KEYS.SHIFT_ASSIGNMENTS);

    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(sampleEmployees);
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(sampleEmployees));
    }

    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance));
    }

    if (storedShifts) {
      setShifts(JSON.parse(storedShifts));
    } else {
      setShifts(sampleShifts);
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(sampleShifts));
    }

    if (storedAssignments) {
      setShiftAssignments(JSON.parse(storedAssignments));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    if (shifts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    }
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIFT_ASSIGNMENTS, JSON.stringify(shiftAssignments));
  }, [shiftAssignments]);

  const getEmployeeCurrentShift = (employeeId: string): Shift | undefined => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee?.shiftId) {
      return shifts.find(s => s.id === employee.shiftId);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const assignment = shiftAssignments.find(
      a => a.employeeId === employeeId && 
           a.startDate <= today && 
           (!a.endDate || a.endDate >= today)
    );
    
    if (assignment) {
      return shifts.find(s => s.id === assignment.shiftId);
    }
    
    return shifts[0]; // Default to first shift
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setAttendance(prev => prev.filter(att => att.employeeId !== id));
    setShiftAssignments(prev => prev.filter(a => a.employeeId !== id));
  };

  const checkIn = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    const existingRecord = attendance.find(
      a => a.employeeId === employeeId && a.date === today
    );

    if (existingRecord) {
      return;
    }

    const employeeShift = getEmployeeCurrentShift(employeeId);
    let isLate = false;

    if (employeeShift) {
      const [shiftHours, shiftMinutes] = employeeShift.startTime.split(':').map(Number);
      const shiftStartMinutes = shiftHours * 60 + shiftMinutes;
      const currentTotalMinutes = currentHours * 60 + currentMinutes;
      isLate = currentTotalMinutes > (shiftStartMinutes + employeeShift.lateThreshold);
    } else {
      isLate = currentHours >= 10;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId,
      date: today,
      checkIn: now,
      status: isLate ? 'late' : 'present',
      shiftId: employeeShift?.id
    };

    setAttendance(prev => [...prev, newRecord]);
  };

  const checkOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });

    setAttendance(prev =>
      prev.map(record => {
        if (record.employeeId === employeeId && record.date === today && !record.checkOut) {
          const checkInTime = new Date(`${today}T${record.checkIn}`);
          const checkOutTime = new Date(`${today}T${now}`);
          const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

          return {
            ...record,
            checkOut: now,
            workHours: Math.round(workHours * 100) / 100,
            status: workHours < 4 ? 'half-day' : record.status
          };
        }
        return record;
      })
    );
  };

  const getEmployeeAttendance = (employeeId: string, month?: number, year?: number) => {
    return attendance.filter(record => {
      if (record.employeeId !== employeeId) return false;
      if (month !== undefined && year !== undefined) {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === month && recordDate.getFullYear() === year;
      }
      return true;
    });
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.filter(record => record.date === today);
  };

  const updateEmployeePhoto = (employeeId: string, photo: string) => {
    setEmployees(prev =>
      prev.map(emp => (emp.employeeId === employeeId ? { ...emp, photo } : emp))
    );
  };

  const batchUpdatePhotos = (updates: { employeeId: string; photo: string }[]) => {
    setEmployees(prev =>
      prev.map(emp => {
        const update = updates.find(u => u.employeeId === emp.employeeId);
        return update ? { ...emp, photo: update.photo } : emp;
      })
    );
  };

  const addShift = (shiftData: Omit<Shift, 'id' | 'createdAt'>) => {
    const newShift: Shift = {
      ...shiftData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(prev =>
      prev.map(shift => (shift.id === id ? { ...shift, ...updates } : shift))
    );
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(shift => shift.id !== id));
    setShiftAssignments(prev => prev.filter(a => a.shiftId !== id));
    setEmployees(prev => 
      prev.map(emp => emp.shiftId === id ? { ...emp, shiftId: undefined } : emp)
    );
  };

  const assignShift = (assignmentData: Omit<ShiftAssignment, 'id'>) => {
    const newAssignment: ShiftAssignment = {
      ...assignmentData,
      id: Date.now().toString()
    };
    setShiftAssignments(prev => [...prev, newAssignment]);
    
    // Also update the employee's shiftId for quick access
    setEmployees(prev =>
      prev.map(emp => 
        emp.id === assignmentData.employeeId 
          ? { ...emp, shiftId: assignmentData.shiftId } 
          : emp
      )
    );
  };

  const removeShiftAssignment = (id: string) => {
    const assignment = shiftAssignments.find(a => a.id === id);
    if (assignment) {
      setEmployees(prev =>
        prev.map(emp => 
          emp.id === assignment.employeeId 
            ? { ...emp, shiftId: undefined } 
            : emp
        )
      );
    }
    setShiftAssignments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        attendance,
        shifts,
        shiftAssignments,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        checkIn,
        checkOut,
        getEmployeeAttendance,
        getTodayAttendance,
        updateEmployeePhoto,
        batchUpdatePhotos,
        addShift,
        updateShift,
        deleteShift,
        assignShift,
        removeShiftAssignment,
        getEmployeeCurrentShift
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { Employee } from '@/types/employee';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  QrCode,
  Download,
  FileText,
  FileSpreadsheet,
  Upload,
  X,
  User,
  FileDown
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { EmployeeQRCard } from '@/components/employee/EmployeeQRCard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import companyLogo from '@/assets/company-logo.jpg';

// Indian states list
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// Employee Profile PDF Generator
const generateEmployeeProfilePDF = (employee: Employee, shiftName?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add watermark
  doc.setFontSize(60);
  doc.setTextColor(230, 230, 230);
  doc.text('VISHWAKARMA', pageWidth / 2, pageHeight / 2, { 
    align: 'center', 
    angle: 45 
  });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Header background
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Add logo
  try {
    doc.addImage(companyLogo, 'JPEG', 10, 8, 35, 35);
  } catch (e) {
    console.log('Logo not loaded');
  }
  
  // Company name
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('VISHWAKARMA.WORLD PRIVATE LIMITED', 55, 22);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text('Mining Excellence Since Inception', 55, 30);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('www.vishwakarma.world', 55, 38);
  
  // Title section
  doc.setFillColor(240, 240, 250);
  doc.rect(0, 55, pageWidth, 15, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL EMPLOYEE PROFILE', pageWidth / 2, 65, { align: 'center' });
  
  // Employee photo placeholder
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(2);
  if (employee.photo) {
    try {
      doc.addImage(employee.photo, 'JPEG', pageWidth - 55, 80, 40, 50);
    } catch (e) {
      doc.rect(pageWidth - 55, 80, 40, 50);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('PHOTO', pageWidth - 35, 108, { align: 'center' });
    }
  } else {
    doc.rect(pageWidth - 55, 80, 40, 50);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('PHOTO', pageWidth - 35, 108, { align: 'center' });
  }
  
  // Employee details section
  let yPos = 85;
  const leftCol = 20;
  const rightCol = 85;
  
  const addDetailRow = (label: string, value: string) => {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(label, leftCol, yPos);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(value || 'N/A', rightCol, yPos);
    
    yPos += 10;
  };
  
  addDetailRow('EMPLOYEE ID:', employee.employeeId);
  addDetailRow('FULL NAME:', employee.name);
  addDetailRow('FATHER NAME:', employee.fatherName || 'N/A');
  addDetailRow('DATE OF JOINING:', format(new Date(employee.joiningDate), 'dd MMMM yyyy'));
  addDetailRow('DESIGNATION:', employee.designation);
  addDetailRow('DEPARTMENT:', employee.department);
  addDetailRow('WORK LOCATION:', employee.workLocation || 'N/A');
  addDetailRow('STATE:', employee.state || 'N/A');
  addDetailRow('SHIFT:', shiftName || 'Not Assigned');
  addDetailRow('STATUS:', employee.status.toUpperCase());
  
  // Contact Information Section
  yPos += 8;
  doc.setFillColor(30, 64, 175);
  doc.rect(15, yPos, pageWidth - 30, 10, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTACT INFORMATION', pageWidth / 2, yPos + 7, { align: 'center' });
  
  yPos += 18;
  
  addDetailRow('MOBILE NUMBER:', employee.phone);
  addDetailRow('EMAIL ADDRESS:', employee.email);
  
  // Footer section
  const footerY = pageHeight - 30;
  
  // Issue date
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text(`Document generated on ${format(new Date(), 'dd MMMM yyyy')}`, pageWidth / 2, footerY, { align: 'center' });
  
  // Official document notice
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('This is an official document of VISHWAKARMA.WORLD PRIVATE LIMITED', pageWidth / 2, footerY + 8, { align: 'center' });
  
  // Border around entire page
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(1);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  
  // Save the PDF
  doc.save(`VISHWAKARMA_EMPLOYEE_PROFILE_${employee.employeeId}.pdf`);
  toast.success('Employee profile PDF downloaded successfully!');
};

// Bulk Export All Employee Profiles
const generateBulkEmployeeProfilesPDF = (employees: Employee[], getShiftName: (shiftId?: string) => string | undefined) => {
  if (employees.length === 0) {
    toast.error('No employees to export');
    return;
  }
  
  toast.info(`Generating ${employees.length} employee profile PDFs...`);
  
  let completed = 0;
  employees.forEach((employee, index) => {
    setTimeout(() => {
      generateEmployeeProfilePDF(employee, getShiftName(employee.shiftId));
      completed++;
      if (completed === employees.length) {
        toast.success(`All ${employees.length} employee profiles exported!`);
      }
    }, index * 500); // Stagger downloads to prevent browser issues
  });
};

const departments = ['Engineering', 'HR', 'Production', 'Accounts', 'Sales', 'Admin'];

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, shifts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    shiftId: '',
    status: 'active' as 'active' | 'inactive',
    photo: '',
    state: '',
    workLocation: '',
    fatherName: ''
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData({ ...formData, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFormData({ ...formData, photo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, formData);
      toast.success('Employee updated successfully!');
    } else {
      addEmployee(formData);
      toast.success('Employee added successfully!');
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      joiningDate: '',
      shiftId: '',
      status: 'active',
      photo: '',
      state: '',
      workLocation: '',
      fatherName: ''
    });
    setPhotoPreview(null);
    setSelectedEmployee(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
      shiftId: employee.shiftId || '',
      status: employee.status,
      photo: employee.photo || '',
      state: employee.state || '',
      workLocation: employee.workLocation || '',
      fatherName: employee.fatherName || ''
    });
    setPhotoPreview(employee.photo || null);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      toast.success('Employee deleted successfully!');
    }
  };

  const handleViewQR = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsQRDialogOpen(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const getShiftInfo = (shiftId?: string) => {
    if (!shiftId) return null;
    return shifts.find(s => s.id === shiftId);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Status', 'Shift'];
    const data = filteredEmployees.map(emp => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.phone,
      emp.department,
      emp.designation,
      format(new Date(emp.joiningDate), 'yyyy-MM-dd'),
      emp.status,
      getShiftInfo(emp.shiftId)?.name || 'No Shift'
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('CSV exported successfully!');
  };

  const exportToExcel = () => {
    // Create Excel-compatible HTML table
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Status', 'Shift'];
    const data = filteredEmployees.map(emp => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.phone,
      emp.department,
      emp.designation,
      format(new Date(emp.joiningDate), 'yyyy-MM-dd'),
      emp.status,
      getShiftInfo(emp.shiftId)?.name || 'No Shift'
    ]);

    let tableHtml = '<table border="1">';
    tableHtml += '<tr>' + headers.map(h => `<th style="background-color:#1e40af;color:white;font-weight:bold;padding:10px;">${h}</th>`).join('') + '</tr>';
    data.forEach(row => {
      tableHtml += '<tr>' + row.map(cell => `<td style="padding:8px;">${cell}</td>`).join('') + '</tr>';
    });
    tableHtml += '</table>';

    const blob = new Blob([`
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"></head>
        <body>${tableHtml}</body>
      </html>
    `], { type: 'application/vnd.ms-excel' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${format(new Date(), 'yyyy-MM-dd')}.xls`;
    link.click();
    toast.success('Excel exported successfully!');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add logo
    const logoWidth = 30;
    const logoHeight = 30;
    doc.addImage(companyLogo, 'JPEG', 14, 10, logoWidth, logoHeight);
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text('Vishwakarma World Private Limited', 50, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Employee Directory', 50, 33);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 50, 40);

    // Add table
    const headers = [['ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'Shift']];
    const data = filteredEmployees.map(emp => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.department,
      emp.designation,
      emp.status,
      getShiftInfo(emp.shiftId)?.name || 'No Shift'
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 50,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 250]
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      }
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | Vishwakarma World Private Limited`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`employees_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF exported successfully!');
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Manage your employee directory</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-destructive" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => generateBulkEmployeeProfilesPDF(
                    filteredEmployees, 
                    (shiftId) => getShiftInfo(shiftId)?.name
                  )} 
                  className="cursor-pointer"
                >
                  <FileDown className="mr-2 h-4 w-4 text-primary" />
                  Bulk Export All Profiles (PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                  <DialogDescription>
                    {selectedEmployee ? 'Update employee details' : 'Fill in the employee information'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                        {photoPreview ? (
                          <>
                            <img 
                              src={photoPreview} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <User className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          ref={fileInputRef}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Label
                          htmlFor="photo-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        placeholder="VW006"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@vishwakarma.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        placeholder="Senior Engineer"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift">Shift</Label>
                      <Select
                        value={formData.shiftId || 'none'}
                        onValueChange={(value) => setFormData({ ...formData, shiftId: value === 'none' ? '' : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Shift</SelectItem>
                          {shifts.filter(s => s.isActive).map(shift => (
                            <SelectItem key={shift.id} value={shift.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: shift.color }}
                                />
                                {shift.name} ({shift.startTime} - {shift.endTime})
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input
                        id="fatherName"
                        placeholder="Father's Name"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workLocation">Work Location</Label>
                      <Input
                        id="workLocation"
                        placeholder="City/Office Location"
                        value={formData.workLocation}
                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={formData.state || 'none'}
                        onValueChange={(value) => setFormData({ ...formData, state: value === 'none' ? '' : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select State</SelectItem>
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {selectedEmployee ? 'Update Employee' : 'Add Employee'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>
              {filteredEmployees.length} employees found
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
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => {
                    const shift = getShiftInfo(employee.shiftId);
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
                          <div>
                            <p>{employee.department}</p>
                            <p className="text-sm text-muted-foreground">{employee.designation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {shift ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: shift.color }}
                              />
                              <span className="text-sm">{shift.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No shift</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(employee.joiningDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewQR(employee)}
                              title="View QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(employee)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(employee)}
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(employee.id)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* View Employee Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                    {selectedEmployee.photo ? (
                      <img 
                        src={selectedEmployee.photo} 
                        alt={selectedEmployee.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-primary">
                        {selectedEmployee.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                    <p className="text-muted-foreground">{selectedEmployee.employeeId}</p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Email</span>
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Father's Name</span>
                    <span>{selectedEmployee.fatherName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Department</span>
                    <span>{selectedEmployee.department}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Designation</span>
                    <span>{selectedEmployee.designation}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Work Location</span>
                    <span>{selectedEmployee.workLocation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">State</span>
                    <span>{selectedEmployee.state || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Shift</span>
                    {selectedEmployee.shiftId ? (
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: getShiftInfo(selectedEmployee.shiftId)?.color }}
                        />
                        {getShiftInfo(selectedEmployee.shiftId)?.name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Joining Date</span>
                    <span>{format(new Date(selectedEmployee.joiningDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => generateEmployeeProfilePDF(
                    selectedEmployee, 
                    getShiftInfo(selectedEmployee.shiftId)?.name
                  )}
                >
                  <FileDown className="h-4 w-4" />
                  Download Profile PDF
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Employee ID Card</DialogTitle>
              <DialogDescription>
                Scan this QR code for attendance check-in/check-out
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <EmployeeQRCard 
                employee={selectedEmployee} 
                shiftName={getShiftInfo(selectedEmployee.shiftId)?.name}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

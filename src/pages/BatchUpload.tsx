import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { 
  Upload,
  ImagePlus,
  X,
  Check,
  AlertCircle,
  FileImage,
  FileSpreadsheet,
  FileText,
  Users,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import companyLogo from '@/assets/company-logo.jpg';

interface PhotoUpload {
  employeeId: string;
  file: File;
  preview: string;
  matched: boolean;
  employeeName?: string;
}

interface EmployeeImport {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  valid: boolean;
  errors: string[];
}

export default function BatchUpload() {
  const { employees, batchUpdatePhotos, addEmployee } = useData();
  const [uploads, setUploads] = useState<PhotoUpload[]>([]);
  const [employeeImports, setEmployeeImports] = useState<EmployeeImport[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCSV, setIsDraggingCSV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Photo upload functions
  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const filename = file.name.split('.')[0];
      const employeeIdMatch = filename.match(/VW\d+/i);
      const employeeId = employeeIdMatch ? employeeIdMatch[0].toUpperCase() : '';

      const employee = employees.find(e => e.employeeId === employeeId);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploads(prev => [...prev, {
          employeeId,
          file,
          preview: reader.result as string,
          matched: !!employee,
          employeeName: employee?.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const updateEmployeeId = (index: number, newId: string) => {
    setUploads(prev => prev.map((upload, i) => {
      if (i !== index) return upload;
      
      const employee = employees.find(e => e.employeeId.toUpperCase() === newId.toUpperCase());
      return {
        ...upload,
        employeeId: newId.toUpperCase(),
        matched: !!employee,
        employeeName: employee?.name
      };
    }));
  };

  const handleUploadAll = () => {
    const matchedUploads = uploads.filter(u => u.matched);
    
    if (matchedUploads.length === 0) {
      toast.error('No matched employees to update');
      return;
    }

    const updates = matchedUploads.map(u => ({
      employeeId: u.employeeId,
      photo: u.preview
    }));

    batchUpdatePhotos(updates);
    toast.success(`Successfully updated ${matchedUploads.length} employee photos!`);
    setUploads([]);
  };

  // CSV/Excel import functions
  const parseCSV = (content: string): EmployeeImport[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const results: EmployeeImport[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const errors: string[] = [];

      const getValueByHeader = (possibleHeaders: string[]) => {
        for (const h of possibleHeaders) {
          const idx = headers.findIndex(header => header.includes(h));
          if (idx !== -1) return values[idx] || '';
        }
        return '';
      };

      const employeeId = getValueByHeader(['employee id', 'employeeid', 'id', 'emp id', 'empid']);
      const name = getValueByHeader(['name', 'full name', 'fullname', 'employee name']);
      const email = getValueByHeader(['email', 'mail', 'e-mail']);
      const phone = getValueByHeader(['phone', 'mobile', 'contact', 'telephone']);
      const department = getValueByHeader(['department', 'dept']);
      const designation = getValueByHeader(['designation', 'position', 'title', 'role']);
      const joiningDate = getValueByHeader(['joining date', 'joiningdate', 'join date', 'date of joining', 'doj']);
      const status = getValueByHeader(['status']) as 'active' | 'inactive' || 'active';

      // Validation
      if (!employeeId) errors.push('Employee ID required');
      if (!name) errors.push('Name required');
      if (!email) errors.push('Email required');
      if (!department) errors.push('Department required');
      if (employees.find(e => e.employeeId === employeeId)) errors.push('ID already exists');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email');

      results.push({
        employeeId,
        name,
        email,
        phone,
        department,
        designation,
        joiningDate: joiningDate || format(new Date(), 'yyyy-MM-dd'),
        status: status === 'inactive' ? 'inactive' : 'active',
        valid: errors.length === 0,
        errors
      });
    }

    return results;
  };

  const handleCSVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const content = reader.result as string;
      const imports = parseCSV(content);
      setEmployeeImports(imports);
      toast.success(`Parsed ${imports.length} employees from file`);
    };
    reader.readAsText(file);
  };

  const handleCSVDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCSV(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const content = reader.result as string;
        const imports = parseCSV(content);
        setEmployeeImports(imports);
        toast.success(`Parsed ${imports.length} employees from file`);
      };
      reader.readAsText(file);
    }
  };

  const removeImport = (index: number) => {
    setEmployeeImports(prev => prev.filter((_, i) => i !== index));
  };

  const handleImportAll = () => {
    const validImports = employeeImports.filter(e => e.valid);
    
    if (validImports.length === 0) {
      toast.error('No valid employees to import');
      return;
    }

    validImports.forEach(emp => {
      addEmployee({
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        designation: emp.designation,
        joiningDate: emp.joiningDate,
        status: emp.status
      });
    });

    toast.success(`Successfully imported ${validImports.length} employees!`);
    setEmployeeImports([]);
  };

  // Download template
  const downloadCSVTemplate = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Status'];
    const sampleData = [
      ['VW001', 'John Doe', 'john@company.com', '+91 9876543210', 'Engineering', 'Senior Engineer', '2024-01-15', 'active'],
      ['VW002', 'Jane Smith', 'jane@company.com', '+91 9876543211', 'HR', 'HR Manager', '2024-02-01', 'active']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_import_template.csv';
    link.click();
    toast.success('Template downloaded!');
  };

  // Export upload results as PDF
  const exportUploadResultsPDF = () => {
    if (uploads.length === 0) {
      toast.error('No photos to export');
      return;
    }

    const doc = new jsPDF();
    
    // Add logo
    doc.addImage(companyLogo, 'JPEG', 14, 10, 30, 30);
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text('Vishwakarma World Private Limited', 50, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Batch Photo Upload Report', 50, 33);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 50, 40);

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Photos: ${uploads.length}`, 14, 55);
    doc.text(`Matched: ${matchedCount}`, 14, 62);
    doc.text(`Unmatched: ${unmatchedCount}`, 14, 69);

    // Table
    const headers = [['#', 'File Name', 'Employee ID', 'Employee Name', 'Status']];
    const data = uploads.map((u, i) => [
      (i + 1).toString(),
      u.file.name,
      u.employeeId || 'N/A',
      u.employeeName || 'Not Found',
      u.matched ? 'Ready' : 'No Match'
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 80,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      }
    });

    doc.save(`batch_upload_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF report exported!');
  };

  // Export import results as PDF
  const exportImportResultsPDF = () => {
    if (employeeImports.length === 0) {
      toast.error('No employees to export');
      return;
    }

    const doc = new jsPDF('landscape');
    
    // Add logo
    doc.addImage(companyLogo, 'JPEG', 14, 10, 25, 25);
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);
    doc.text('Vishwakarma World Private Limited', 45, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Employee Import Preview Report', 45, 28);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 45, 35);

    // Summary
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${employeeImports.length} | Valid: ${validImportCount} | Invalid: ${invalidImportCount}`, 14, 45);

    // Table
    const headers = [['ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Valid']];
    const data = employeeImports.map(e => [
      e.employeeId || 'N/A',
      e.name || 'N/A',
      e.email || 'N/A',
      e.phone || 'N/A',
      e.department || 'N/A',
      e.designation || 'N/A',
      e.status,
      e.valid ? 'Yes' : 'No'
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
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
    });

    doc.save(`employee_import_preview_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF report exported!');
  };

  const matchedCount = uploads.filter(u => u.matched).length;
  const unmatchedCount = uploads.filter(u => !u.matched).length;
  const validImportCount = employeeImports.filter(e => e.valid).length;
  const invalidImportCount = employeeImports.filter(e => !e.valid).length;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batch Upload & Import</h1>
          <p className="text-muted-foreground">
            Upload photos or import employees from files
          </p>
        </div>

        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="photos" className="gap-2">
              <ImagePlus className="h-4 w-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Users className="h-4 w-4" />
              Import Employees
            </TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            {/* Instructions */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="rounded-full bg-primary/20 p-3">
                    <FileImage className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Naming Convention</h3>
                    <p className="text-sm text-muted-foreground">
                      Name your photos with the employee ID for automatic matching.
                      <br />
                      Example: <code className="rounded bg-muted px-1">VW001.jpg</code>, <code className="rounded bg-muted px-1">VW002_photo.png</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImagePlus className="h-5 w-5 text-primary" />
                  Upload Photos
                </CardTitle>
                <CardDescription>
                  Drag and drop images or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">
                    Drop your images here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click the button below to browse
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Queue */}
            {uploads.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upload Queue</CardTitle>
                      <CardDescription className="flex gap-4 mt-1">
                        <span className="flex items-center gap-1 text-success">
                          <Check className="h-4 w-4" />
                          {matchedCount} matched
                        </span>
                        {unmatchedCount > 0 && (
                          <span className="flex items-center gap-1 text-warning">
                            <AlertCircle className="h-4 w-4" />
                            {unmatchedCount} unmatched
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={exportUploadResultsPDF} className="gap-2">
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Preview</TableHead>
                          <TableHead>File Name</TableHead>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Matched Employee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploads.map((upload, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img 
                                src={upload.preview} 
                                alt="Preview"
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {upload.file.name}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={upload.employeeId}
                                onChange={(e) => updateEmployeeId(index, e.target.value)}
                                className="w-24"
                                placeholder="VW001"
                              />
                            </TableCell>
                            <TableCell>
                              {upload.matched ? (
                                <span className="text-success">{upload.employeeName}</span>
                              ) : (
                                <span className="text-muted-foreground">Not found</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {upload.matched ? (
                                <span className="flex items-center gap-1 text-success">
                                  <Check className="h-4 w-4" />
                                  Ready
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-warning">
                                  <AlertCircle className="h-4 w-4" />
                                  No match
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeUpload(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setUploads([])}
                    >
                      Clear All
                    </Button>
                    <Button 
                      onClick={handleUploadAll}
                      disabled={matchedCount === 0}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload {matchedCount} Photo{matchedCount !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Import Employees Tab */}
          <TabsContent value="import" className="space-y-6">
            {/* Instructions */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="rounded-full bg-primary/20 p-3">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Import from CSV/Excel</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a CSV or Excel file with employee data.
                        <br />
                        Required columns: Employee ID, Name, Email, Department
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadCSVTemplate} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CSV Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Import Employees
                </CardTitle>
                <CardDescription>
                  Upload CSV or Excel file with employee data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                    isDraggingCSV 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDrop={handleCSVDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingCSV(true); }}
                  onDragLeave={() => setIsDraggingCSV(false)}
                >
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleCSVChange}
                    className="hidden"
                  />
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">
                    Drop your CSV/Excel file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click the button below to browse
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => csvInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Import Preview */}
            {employeeImports.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Import Preview</CardTitle>
                      <CardDescription className="flex gap-4 mt-1">
                        <span className="flex items-center gap-1 text-success">
                          <Check className="h-4 w-4" />
                          {validImportCount} valid
                        </span>
                        {invalidImportCount > 0 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {invalidImportCount} invalid
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={exportImportResultsPDF} className="gap-2">
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Designation</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Valid</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeImports.map((emp, index) => (
                          <TableRow key={index} className={!emp.valid ? 'bg-destructive/5' : ''}>
                            <TableCell className="font-mono">{emp.employeeId || '-'}</TableCell>
                            <TableCell>{emp.name || '-'}</TableCell>
                            <TableCell>{emp.email || '-'}</TableCell>
                            <TableCell>{emp.department || '-'}</TableCell>
                            <TableCell>{emp.designation || '-'}</TableCell>
                            <TableCell>{emp.status}</TableCell>
                            <TableCell>
                              {emp.valid ? (
                                <span className="flex items-center gap-1 text-success">
                                  <Check className="h-4 w-4" />
                                  Valid
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-destructive" title={emp.errors.join(', ')}>
                                  <AlertCircle className="h-4 w-4" />
                                  {emp.errors[0]}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeImport(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setEmployeeImports([])}
                    >
                      Clear All
                    </Button>
                    <Button 
                      onClick={handleImportAll}
                      disabled={validImportCount === 0}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Import {validImportCount} Employee{validImportCount !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

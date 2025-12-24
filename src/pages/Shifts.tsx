import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useData } from '@/contexts/DataContext';
import { Shift } from '@/types/employee';
import { 
  Plus, 
  Clock, 
  Edit2, 
  Trash2, 
  Users,
  UserPlus,
  Calendar,
  RotateCw
} from 'lucide-react';
import { toast } from 'sonner';

const colorOptions = [
  { value: '#22c55e', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#ec4899', label: 'Pink' },
];

export default function Shifts() {
  const { shifts, employees, shiftAssignments, addShift, updateShift, deleteShift, assignShift, removeShiftAssignment } = useData();
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  const [shiftForm, setShiftForm] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    lateThreshold: 15,
    color: '#22c55e',
    isActive: true
  });

  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    shiftId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isRotating: false,
    rotationDays: 7
  });

  const resetShiftForm = () => {
    setShiftForm({
      name: '',
      startTime: '09:00',
      endTime: '18:00',
      lateThreshold: 15,
      color: '#22c55e',
      isActive: true
    });
    setSelectedShift(null);
  };

  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shiftForm.name.trim()) {
      toast.error('Please enter a shift name');
      return;
    }

    if (selectedShift) {
      updateShift(selectedShift.id, shiftForm);
      toast.success('Shift updated successfully!');
    } else {
      addShift(shiftForm);
      toast.success('Shift created successfully!');
    }
    
    setIsAddShiftOpen(false);
    resetShiftForm();
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setShiftForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      lateThreshold: shift.lateThreshold,
      color: shift.color,
      isActive: shift.isActive
    });
    setIsAddShiftOpen(true);
  };

  const handleDeleteShift = (id: string) => {
    if (window.confirm('Are you sure you want to delete this shift? All assignments will be removed.')) {
      deleteShift(id);
      toast.success('Shift deleted successfully!');
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignForm.employeeId || !assignForm.shiftId) {
      toast.error('Please select both employee and shift');
      return;
    }

    assignShift({
      employeeId: assignForm.employeeId,
      shiftId: assignForm.shiftId,
      startDate: assignForm.startDate,
      endDate: assignForm.endDate || undefined,
      isRotating: assignForm.isRotating,
      rotationDays: assignForm.isRotating ? assignForm.rotationDays : undefined
    });

    toast.success('Shift assigned successfully!');
    setIsAssignOpen(false);
    setAssignForm({
      employeeId: '',
      shiftId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isRotating: false,
      rotationDays: 7
    });
  };

  const getEmployeesInShift = (shiftId: string) => {
    return employees.filter(emp => emp.shiftId === shiftId);
  };

  const unassignedEmployees = employees.filter(emp => !emp.shiftId && emp.status === 'active');

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shift Management</h1>
            <p className="text-muted-foreground">Create and manage work shifts</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Assign Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Shift to Employee</DialogTitle>
                  <DialogDescription>
                    Select an employee and assign them to a shift
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAssignSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select
                      value={assignForm.employeeId}
                      onValueChange={(value) => setAssignForm({ ...assignForm, employeeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter(e => e.status === 'active').map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} ({emp.employeeId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Shift</Label>
                    <Select
                      value={assignForm.shiftId}
                      onValueChange={(value) => setAssignForm({ ...assignForm, shiftId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.filter(s => s.isActive).map(shift => (
                          <SelectItem key={shift.id} value={shift.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: shift.color }} 
                              />
                              {shift.name} ({shift.startTime} - {shift.endTime})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={assignForm.startDate}
                        onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date (Optional)</Label>
                      <Input
                        type="date"
                        value={assignForm.endDate}
                        onChange={(e) => setAssignForm({ ...assignForm, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <RotateCw className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Rotating Shift</p>
                        <p className="text-sm text-muted-foreground">Automatically rotate shifts</p>
                      </div>
                    </div>
                    <Switch
                      checked={assignForm.isRotating}
                      onCheckedChange={(checked) => setAssignForm({ ...assignForm, isRotating: checked })}
                    />
                  </div>
                  {assignForm.isRotating && (
                    <div className="space-y-2">
                      <Label>Rotation Period (Days)</Label>
                      <Input
                        type="number"
                        min={1}
                        value={assignForm.rotationDays}
                        onChange={(e) => setAssignForm({ ...assignForm, rotationDays: parseInt(e.target.value) || 7 })}
                      />
                    </div>
                  )}
                  <DialogFooter>
                    <Button type="submit">Assign Shift</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddShiftOpen} onOpenChange={(open) => {
              setIsAddShiftOpen(open);
              if (!open) resetShiftForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedShift ? 'Edit Shift' : 'Create New Shift'}</DialogTitle>
                  <DialogDescription>
                    {selectedShift ? 'Update shift details' : 'Set up a new work shift'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleShiftSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Shift Name</Label>
                    <Input
                      placeholder="e.g., Morning Shift"
                      value={shiftForm.name}
                      onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={shiftForm.startTime}
                        onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={shiftForm.endTime}
                        onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Late Threshold (minutes)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={60}
                      value={shiftForm.lateThreshold}
                      onChange={(e) => setShiftForm({ ...shiftForm, lateThreshold: parseInt(e.target.value) || 15 })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Employees checking in after this many minutes will be marked as late
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            shiftForm.color === color.value ? 'border-foreground scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setShiftForm({ ...shiftForm, color: color.value })}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch
                      checked={shiftForm.isActive}
                      onCheckedChange={(checked) => setShiftForm({ ...shiftForm, isActive: checked })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {selectedShift ? 'Update Shift' : 'Create Shift'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Shift Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shifts.map((shift) => {
            const employeesInShift = getEmployeesInShift(shift.id);
            return (
              <Card key={shift.id} className="overflow-hidden hover-lift">
                <div 
                  className="h-2" 
                  style={{ backgroundColor: shift.color }}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" style={{ color: shift.color }} />
                        {shift.name}
                      </CardTitle>
                      <CardDescription>
                        {shift.startTime} - {shift.endTime}
                      </CardDescription>
                    </div>
                    <Badge variant={shift.isActive ? 'default' : 'secondary'}>
                      {shift.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{employeesInShift.length} employees assigned</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Late after: </span>
                    <span className="font-medium">{shift.lateThreshold} minutes</span>
                  </div>
                  {employeesInShift.length > 0 && (
                    <div className="flex -space-x-2">
                      {employeesInShift.slice(0, 5).map(emp => (
                        <div
                          key={emp.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground"
                          title={emp.name}
                        >
                          {emp.name.charAt(0)}
                        </div>
                      ))}
                      {employeesInShift.length > 5 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{employeesInShift.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditShift(shift)}
                    >
                      <Edit2 className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteShift(shift.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Unassigned Employees */}
        {unassignedEmployees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Users className="h-5 w-5" />
                Unassigned Employees
              </CardTitle>
              <CardDescription>
                These employees have not been assigned to any shift
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {unassignedEmployees.map(emp => (
                  <Badge key={emp.id} variant="outline" className="gap-2 py-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {emp.name.charAt(0)}
                    </div>
                    {emp.name} ({emp.employeeId})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shift Schedule Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Employee Shift Schedule
            </CardTitle>
            <CardDescription>
              Overview of all employee shift assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Current Shift</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.filter(e => e.status === 'active').map((employee) => {
                    const shift = shifts.find(s => s.id === employee.shiftId);
                    const assignment = shiftAssignments.find(a => a.employeeId === employee.id);
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {shift ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: shift.color }}
                              />
                              {shift.name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {shift ? `${shift.startTime} - ${shift.endTime}` : '-'}
                        </TableCell>
                        <TableCell>
                          {assignment?.isRotating ? (
                            <Badge variant="outline" className="gap-1">
                              <RotateCw className="h-3 w-3" />
                              Rotating ({assignment.rotationDays}d)
                            </Badge>
                          ) : shift ? (
                            <Badge variant="secondary">Fixed</Badge>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right">
                          {assignment && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                removeShiftAssignment(assignment.id);
                                toast.success('Shift assignment removed');
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          )}
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

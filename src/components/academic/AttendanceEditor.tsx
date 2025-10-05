import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, Calendar, Minus, Plus as PlusIcon } from 'lucide-react';
import { useAttendance, useCreateAttendance, useUpdateAttendance, useDeleteAttendance, useSemesters } from '@/hooks/useAcademic';
import { getAttendanceStatus } from '@/utils/gradeCalculations';
import type { AttendanceRecord } from '@/services/academicService';

interface AttendanceEditorProps {
  semesterId?: string;
}

export function AttendanceEditor({ semesterId }: AttendanceEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [formData, setFormData] = useState({
    subject_name: '',
    total_classes: 0,
    attended_classes: 0,
    note: '',
    semester_id: semesterId || '',
    source_json_import: false
  });

  const { data: attendanceRecords = [], isLoading } = useAttendance();
  const { data: semesters = [] } = useSemesters();
  const createAttendance = useCreateAttendance();
  const updateAttendance = useUpdateAttendance();
  const deleteAttendance = useDeleteAttendance();

  const filteredRecords = semesterId 
    ? attendanceRecords.filter((record: { semester_id: string }) => record.semester_id === semesterId)
    : attendanceRecords;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert null values to appropriate defaults
    const submitData = {
      ...formData,
      total_classes: formData.total_classes || 0,
      attended_classes: formData.attended_classes || 0
    };
    
    try {
      if (editingRecord) {
        await updateAttendance.mutateAsync({
          id: editingRecord.id,
          updates: submitData
        });
      } else {
        await createAttendance.mutateAsync(submitData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving attendance record:', error);
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setFormData({
      subject_name: record.subject_name,
      total_classes: record.total_classes,
      attended_classes: record.attended_classes,
      note: record.note || '',
      semester_id: record.semester_id,
      source_json_import: record.source_json_import
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      await deleteAttendance.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setEditingRecord(null);
    setFormData({
      subject_name: '',
      total_classes: 0,
      attended_classes: 0,
      note: '',
      semester_id: semesterId || '',
      source_json_import: false
    });
  };

  const adjustClasses = (type: 'total' | 'attended', increment: boolean) => {
    const field = type === 'total' ? 'total_classes' : 'attended_classes';
    const currentValue = formData[field];
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    
    if (type === 'attended' && newValue > formData.total_classes) return;
    if (type === 'total' && newValue < formData.attended_classes) {
      setFormData({ ...formData, [field]: newValue, attended_classes: newValue });
    } else {
      setFormData({ ...formData, [field]: newValue });
    }
  };

  const getSemesterNumber = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId);
    return semester?.number || 'Unknown';
  };

  const getPreviewPercentage = () => {
    if (formData.total_classes === 0) return 0;
    return Math.round((formData.attended_classes / formData.total_classes) * 100 * 100) / 100;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading attendance records...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Attendance Records
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Edit Attendance' : 'Add Attendance Record'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject_name">Subject Name</Label>
                <Input
                  id="subject_name"
                  value={formData.subject_name}
                  onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                  placeholder="e.g., Engineering Mathematics"
                  required
                />
              </div>

              {!semesterId && (
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select 
                    value={formData.semester_id} 
                    onValueChange={(value) => setFormData({ ...formData, semester_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          Semester {semester.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="total_classes">Total Classes</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => adjustClasses('total', false)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="total_classes"
                    type="number"
                    min="0"
                    value={formData.total_classes}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      total_classes: parseInt(e.target.value) || 0 
                    })}
                    className="text-center"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => adjustClasses('total', true)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="attended_classes">Attended Classes</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => adjustClasses('attended', false)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="attended_classes"
                    type="number"
                    min="0"
                    max={formData.total_classes || undefined}
                    value={formData.attended_classes || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseInt(e.target.value);
                      setFormData({ 
                        ...formData, 
                        attended_classes: value
                      });
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setFormData({ 
                          ...formData, 
                          attended_classes: 0 
                        });
                      }
                    }}
                    className="text-center"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => adjustClasses('attended', true)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>

              {formData.total_classes > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    Attendance: {formData.attended_classes} / {formData.total_classes}
                  </p>
                  <p className="text-sm font-medium">
                    Percentage: {getPreviewPercentage()}%
                  </p>
                  <Badge className={getAttendanceStatus(getPreviewPercentage()).color}>
                    {getAttendanceStatus(getPreviewPercentage()).status}
                  </Badge>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRecord ? 'Update' : 'Create'} Record
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No attendance records added yet</p>
          </div>
        ) : (
          filteredRecords.map((record: { id: string; subject_name: string; percentage?: number; attended_classes: number; total_classes: number; note?: string; semester_id: string }) => {
            const attendanceStatus = getAttendanceStatus(record.percentage || 0);
            const isLow = (record.percentage || 0) < 75;
            
            return (
              <div key={record.id} className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow ${isLow ? 'border-red-200 bg-red-50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{record.subject_name}</h4>
                    <Badge className={attendanceStatus.color}>
                      {attendanceStatus.status}
                    </Badge>
                    {!semesterId && (
                      <Badge variant="outline">
                        Sem {getSemesterNumber(record.semester_id)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{record.attended_classes} / {record.total_classes} classes</span>
                    <span className="font-medium">{record.percentage?.toFixed(1)}%</span>
                    {isLow && <span className="text-red-600">⚠️ Below 75%</span>}
                  </div>
                  {record.note && (
                    <p className="text-sm text-muted-foreground mt-1">{record.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

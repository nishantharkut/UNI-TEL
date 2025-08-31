
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck, UserX, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { useCreateAttendance, useUpdateAttendance, useDeleteAttendance, useSemesters } from '@/hooks/useAcademic';
import { getAttendanceStatus } from '@/utils/gradeCalculations';
import type { AttendanceRecord } from '@/services/academicService';

interface ActiveAttendanceCardProps {
  records: AttendanceRecord[];
}

export function ActiveAttendanceCard({ records }: ActiveAttendanceCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [newSubject, setNewSubject] = useState({
    subject_name: '',
    semester_id: ''
  });

  const { data: semesters = [] } = useSemesters();
  const createAttendance = useCreateAttendance();
  const updateAttendance = useUpdateAttendance();
  const deleteAttendance = useDeleteAttendance();

  const handleMarkAttendance = async (recordId: string, isPresent: boolean) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    const updates = {
      total_classes: record.total_classes + 1,
      attended_classes: record.attended_classes + (isPresent ? 1 : 0)
    };

    await updateAttendance.mutateAsync({ id: recordId, updates });
  };

  const handleAddSubject = async () => {
    if (!newSubject.subject_name.trim() || !newSubject.semester_id) return;

    await createAttendance.mutateAsync({
      subject_name: newSubject.subject_name.trim(),
      semester_id: newSubject.semester_id,
      total_classes: 0,
      attended_classes: 0,
      source_json_import: false
    });

    setNewSubject({ subject_name: '', semester_id: '' });
    setIsAddDialogOpen(false);
  };

  const handleEdit = async (recordId: string, updates: Partial<AttendanceRecord>) => {
    await updateAttendance.mutateAsync({ id: recordId, updates });
    setEditingRecord(null);
  };

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      await deleteAttendance.mutateAsync(recordId);
    }
  };

  const getSemesterName = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId);
    return semester ? `Sem ${semester.number}` : 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Active Attendance Tracking</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject_name">Subject Name</Label>
                <Input
                  id="subject_name"
                  value={newSubject.subject_name}
                  onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select value={newSubject.semester_id} onValueChange={(value) => setNewSubject({ ...newSubject, semester_id: value })}>
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
              <div className="flex gap-2">
                <Button onClick={handleAddSubject} className="flex-1">Add</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {records.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No subjects added yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => {
            const percentage = record.total_classes > 0 ? (record.attended_classes / record.total_classes) * 100 : 0;
            const { status, color } = getAttendanceStatus(percentage);
            const isLowAttendance = percentage < 75;

            return (
              <Card key={record.id} className={`${isLowAttendance ? 'border-red-200 bg-red-50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{record.subject_name}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline">{getSemesterName(record.semester_id)}</Badge>
                        <Badge className={color}>{status}</Badge>
                        {isLowAttendance && <Badge variant="destructive">⚠️ Low</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRecord(record)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-lg font-semibold">{record.attended_classes}</div>
                      <div className="text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-lg font-semibold">{record.total_classes - record.attended_classes}</div>
                      <div className="text-muted-foreground">Absent</div>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">
                      {record.attended_classes} / {record.total_classes} classes
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMarkAttendance(record.id, true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={updateAttendance.isPending}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Present
                    </Button>
                    <Button
                      onClick={() => handleMarkAttendance(record.id, false)}
                      variant="destructive"
                      className="flex-1"
                      disabled={updateAttendance.isPending}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Absent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      {editingRecord && (
        <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={editingRecord.subject_name}
                  onChange={(e) => setEditingRecord({ ...editingRecord, subject_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Classes</Label>
                  <Input
                    type="number"
                    value={editingRecord.total_classes}
                    onChange={(e) => setEditingRecord({ ...editingRecord, total_classes: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Attended</Label>
                  <Input
                    type="number"
                    value={editingRecord.attended_classes}
                    onChange={(e) => setEditingRecord({ ...editingRecord, attended_classes: Math.min(parseInt(e.target.value) || 0, editingRecord.total_classes) })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(editingRecord.id, editingRecord)} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setEditingRecord(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

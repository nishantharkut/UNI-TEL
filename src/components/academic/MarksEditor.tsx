import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, FileText } from 'lucide-react';
import { useMarks, useCreateMarks, useUpdateMarks, useDeleteMarks, useSemesters } from '@/hooks/useAcademic';
import type { MarksRecord } from '@/services/academicService';

const EXAM_TYPES = ['Quiz', 'Mid', 'End', 'Assignment', 'Lab', 'Project', 'Other'];

interface MarksEditorProps {
  semesterId?: string;
}

export function MarksEditor({ semesterId }: MarksEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MarksRecord | null>(null);
  const [formData, setFormData] = useState({
    subject_name: '',
    exam_type: '',
    total_marks: 0,
    obtained_marks: 0,
    semester_id: semesterId || '',
    source_json_import: false
  });

  const { data: marksRecords = [], isLoading } = useMarks();
  const { data: semesters = [] } = useSemesters();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();
  const deleteMarks = useDeleteMarks();

  const filteredRecords = semesterId 
    ? marksRecords.filter((record: any) => record.semester_id === semesterId)
    : marksRecords;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRecord) {
        await updateMarks.mutateAsync({
          id: editingRecord.id,
          updates: formData
        });
      } else {
        await createMarks.mutateAsync(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving marks record:', error);
    }
  };

  const handleEdit = (record: MarksRecord) => {
    setEditingRecord(record);
    setFormData({
      subject_name: record.subject_name,
      exam_type: record.exam_type,
      total_marks: record.total_marks,
      obtained_marks: record.obtained_marks,
      semester_id: record.semester_id,
      source_json_import: record.source_json_import
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this marks record?')) {
      await deleteMarks.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setEditingRecord(null);
    setFormData({
      subject_name: '',
      exam_type: '',
      total_marks: 0,
      obtained_marks: 0,
      semester_id: semesterId || '',
      source_json_import: false
    });
  };

  const getSemesterNumber = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId);
    return semester?.number || 'Unknown';
  };

  const getPreviewPercentage = () => {
    if (formData.total_marks === 0) return 0;
    return Math.round((formData.obtained_marks / formData.total_marks) * 100 * 100) / 100;
  };

  const getPercentageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceLabel = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading marks records...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Marks & Exams
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Marks
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Edit Marks' : 'Add Marks Record'}
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
                <Label htmlFor="exam_type">Exam Type</Label>
                <Select 
                  value={formData.exam_type} 
                  onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    type="number"
                    min="1"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      total_marks: parseInt(e.target.value) || 0 
                    })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="obtained_marks">Obtained Marks</Label>
                  <Input
                    id="obtained_marks"
                    type="number"
                    min="0"
                    max={formData.total_marks}
                    value={formData.obtained_marks}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      obtained_marks: Math.min(
                        parseInt(e.target.value) || 0, 
                        formData.total_marks
                      )
                    })}
                    required
                  />
                </div>
              </div>

              {formData.total_marks > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    Score: {formData.obtained_marks} / {formData.total_marks}
                  </p>
                  <p className="text-sm font-medium">
                    Percentage: {getPreviewPercentage()}%
                  </p>
                  <Badge className={getPercentageColor(getPreviewPercentage())}>
                    {getPerformanceLabel(getPreviewPercentage())}
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
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No marks records added yet</p>
          </div>
        ) : (
          Object.entries(
            filteredRecords.reduce((groups: any, record: any) => {
              const key = record.subject_name;
              if (!groups[key]) groups[key] = [];
              groups[key].push(record);
              return groups;
            }, {})
          ).map(([subjectName, records]: [string, any]) => (
            <div key={subjectName} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                {subjectName}
                {!semesterId && records[0] && (
                  <Badge variant="outline">
                    Sem {getSemesterNumber(records[0].semester_id)}
                  </Badge>
                )}
              </h4>
              <div className="grid gap-2">
                {records.map((record: any) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="min-w-fit">
                        {record.exam_type}
                      </Badge>
                      <span className="text-sm">
                        {record.obtained_marks} / {record.total_marks}
                      </span>
                      <span className="text-sm font-medium">
                        {record.percentage?.toFixed(1)}%
                      </span>
                      <Badge className={getPercentageColor(record.percentage || 0)}>
                        {getPerformanceLabel(record.percentage || 0)}
                      </Badge>
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
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

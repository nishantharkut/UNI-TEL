
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';
import { useCreateMarks, useUpdateMarks, useSemesters } from '@/hooks/useAcademic';
import type { MarksRecord } from '@/services/academicService';

// Custom exam types - user can create their own
const DEFAULT_EXAM_TYPES = ['Mid Term', 'End Term', 'Quiz', 'Assignment', 'Lab Exam', 'Viva', 'Project', 'Other'];

interface MarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId?: string;
  editingRecord?: MarksRecord | null;
}

export function MarksDialog({ 
  open, 
  onOpenChange, 
  semesterId,
  editingRecord 
}: MarksDialogProps) {
  const [formData, setFormData] = useState({
    subject_name: '',
    exam_type: '',
    total_marks: 100,
    obtained_marks: 0,
    weightage: 100,
    semester_id: semesterId || ''
  });

  const { data: semesters = [] } = useSemesters();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();

  const resetForm = useCallback(() => {
    setFormData({
      subject_name: '',
      exam_type: '',
      total_marks: 100,
      obtained_marks: 0,
      weightage: 100,
      semester_id: semesterId || ''
    });
  }, [semesterId]);

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        subject_name: editingRecord.subject_name,
        exam_type: editingRecord.exam_type,
        total_marks: editingRecord.total_marks,
        obtained_marks: editingRecord.obtained_marks,
        semester_id: editingRecord.semester_id
      });
    } else {
      resetForm();
    }
  }, [editingRecord, semesterId, resetForm]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.subject_name.trim()) {
      console.error('Subject name is required');
      return;
    }
    
    if (!formData.exam_type) {
      console.error('Exam type is required');
      return;
    }

    if (!formData.semester_id) {
      console.error('Semester is required');
      return;
    }

    // Convert null values to appropriate defaults
    const totalMarks = formData.total_marks || 0;
    const obtainedMarks = formData.obtained_marks || 0;
    const weightage = formData.weightage || 100;

    if (totalMarks <= 0) {
      console.error('Total marks must be greater than 0');
      return;
    }

    if (obtainedMarks < 0 || obtainedMarks > totalMarks) {
      console.error('Obtained marks must be between 0 and total marks');
      return;
    }
    
    try {
      const payload = {
        subject_name: formData.subject_name.trim(),
        exam_type: formData.exam_type,
        total_marks: Number(totalMarks),
        obtained_marks: Number(obtainedMarks),
        weightage: Number(weightage),
        semester_id: formData.semester_id,
        source_json_import: false
      };

      if (editingRecord) {
        await updateMarks.mutateAsync({
          id: editingRecord.id,
          updates: payload
        });
      } else {
        await createMarks.mutateAsync(payload);
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving marks record:', error);
    }
  };

  const getPercentage = () => {
    if (formData.total_marks === 0) return 0;
    return Math.round((formData.obtained_marks / formData.total_marks) * 100 * 100) / 100;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? 'Edit Marks' : 'Add Marks Record'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject_name">Subject Name *</Label>
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
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester_id}
                onValueChange={(value) => setFormData({ ...formData, semester_id: value })}
                required
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
            <Label htmlFor="exam_type">Exam Type *</Label>
            <Select
              value={formData.exam_type}
              onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
              required
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
              <Label htmlFor="total_marks">Total Marks *</Label>
              <Input
                id="total_marks"
                type="number"
                min="1"
                step="1"
                value={formData.total_marks || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value);
                  setFormData({ 
                    ...formData, 
                    total_marks: value,
                    obtained_marks: value ? Math.min(formData.obtained_marks || 0, value) : formData.obtained_marks
                  });
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setFormData({ 
                      ...formData, 
                      total_marks: 0 
                    });
                  }
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="obtained_marks">Obtained Marks *</Label>
              <Input
                id="obtained_marks"
                type="number"
                min="0"
                max={formData.total_marks || undefined}
                step="1"
                value={formData.obtained_marks || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value);
                  setFormData({ 
                    ...formData, 
                    obtained_marks: value
                  });
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setFormData({ 
                      ...formData, 
                      obtained_marks: 0 
                    });
                  }
                }}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="weightage">Weightage (%) *</Label>
            <div className="space-y-2">
              <Input
                id="weightage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.weightage || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseFloat(e.target.value);
                  setFormData({ 
                    ...formData, 
                    weightage: value
                  });
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setFormData({ 
                      ...formData, 
                      weightage: 100 
                    });
                  }
                }}
                required
              />
              <div className="text-sm text-muted-foreground">
                This determines how much this exam contributes to the overall subject grade (0-100%)
              </div>
            </div>
          </div>

          {formData.total_marks > 0 && (
            <div className="p-3 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span className="font-medium">Performance Preview</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Raw Score:</span>
                  <div className="font-medium">
                    {formData.obtained_marks}/{formData.total_marks} ({getPercentage()}%)
                  </div>
                  <Badge className={getPercentageColor(getPercentage())}>
                    {getPerformanceLabel(getPercentage())}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Weighted Score:</span>
                  <div className="font-medium">
                    {Math.round(getPercentage() * formData.weightage / 100 * 100) / 100}%
                  </div>
                  <Badge className={getPercentageColor(Math.round(getPercentage() * formData.weightage / 100 * 100) / 100)}>
                    Weighted
                  </Badge>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Weighted Score = Raw Percentage × Weightage ÷ 100
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRecord ? 'Update' : 'Add'} Marks
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

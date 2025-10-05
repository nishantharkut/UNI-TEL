import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Edit, Trash2, Target } from 'lucide-react';
import { useCreateMarks, useUpdateMarks, useSemesters } from '@/hooks/useAcademic';
import type { MarksRecord } from '@/services/academicService';

interface CustomMarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId?: string;
  editingRecord?: MarksRecord | null;
}

export function CustomMarksDialog({ 
  open, 
  onOpenChange, 
  semesterId,
  editingRecord 
}: CustomMarksDialogProps) {
  
  const [formData, setFormData] = useState({
    subject_name: '',
    exam_type: '',
    total_marks: 100,
    obtained_marks: 0,
    weightage: 100,
    semester_id: semesterId || '',
    source_json_import: false
  });

  const [customExamTypes, setCustomExamTypes] = useState<string[]>([]);
  const [newExamType, setNewExamType] = useState('');
  const [showAddExamType, setShowAddExamType] = useState(false);

  const { data: semesters = [] } = useSemesters();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();

  // Load custom exam types from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customExamTypes');
    if (saved) {
      setCustomExamTypes(JSON.parse(saved));
    }
  }, []);

  // Save custom exam types to localStorage
  const saveCustomExamTypes = useCallback((types: string[]) => {
    setCustomExamTypes(types);
    localStorage.setItem('customExamTypes', JSON.stringify(types));
  }, []);

  // Add new custom exam type
  const handleAddExamType = () => {
    if (newExamType.trim() && !customExamTypes.includes(newExamType.trim())) {
      const updated = [...customExamTypes, newExamType.trim()];
      saveCustomExamTypes(updated);
      setNewExamType('');
      setShowAddExamType(false);
    }
  };

  // Remove custom exam type
  const handleRemoveExamType = (examType: string) => {
    const updated = customExamTypes.filter(type => type !== examType);
    saveCustomExamTypes(updated);
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      subject_name: '',
      exam_type: '',
      total_marks: 100,
      obtained_marks: 0,
      weightage: 100,
      semester_id: semesterId || '',
      source_json_import: false
    });
  }, [semesterId]);

  // Load editing record
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        subject_name: editingRecord.subject_name,
        exam_type: editingRecord.exam_type,
        total_marks: editingRecord.total_marks,
        obtained_marks: editingRecord.obtained_marks,
        weightage: (editingRecord as any).weightage || 100,
        semester_id: editingRecord.semester_id,
        source_json_import: editingRecord.source_json_import
      });
    } else {
      resetForm();
    }
  }, [editingRecord, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.subject_name.trim()) {
      console.error('Subject name is required');
      return;
    }
    
    if (!formData.exam_type.trim()) {
      console.error('Exam type is required');
      return;
    }

    if (!formData.semester_id) {
      console.error('Semester is required');
      return;
    }

    if (formData.total_marks <= 0) {
      console.error('Total marks must be greater than 0');
      return;
    }

    if (formData.obtained_marks < 0 || formData.obtained_marks > formData.total_marks) {
      console.error('Obtained marks must be between 0 and total marks');
      return;
    }

    if (formData.weightage < 0 || formData.weightage > 100) {
      console.error('Weightage must be between 0 and 100');
      return;
    }
    
    try {
      const payload = {
        subject_name: formData.subject_name.trim(),
        exam_type: formData.exam_type.trim(),
        total_marks: Number(formData.total_marks),
        obtained_marks: Number(formData.obtained_marks),
        weightage: Number(formData.weightage),
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

  const getWeightedPercentage = () => {
    const percentage = getPercentage();
    return Math.round(percentage * formData.weightage / 100 * 100) / 100;
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
    return 'Below Average';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {editingRecord ? 'Edit Marks Record' : 'Add New Marks Record'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject_name">Subject Name *</Label>
            <Input
              id="subject_name"
              value={formData.subject_name}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
              placeholder="Enter subject name"
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
            <div className="space-y-2">
              <Select
                value={formData.exam_type}
                onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select or create exam type" />
                </SelectTrigger>
                <SelectContent>
                  {customExamTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="__create_new__" className="text-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Exam Type
                  </SelectItem>
                </SelectContent>
              </Select>

              {formData.exam_type === '__create_new__' && (
                <div className="flex gap-2">
                  <Input
                    value={newExamType}
                    onChange={(e) => setNewExamType(e.target.value)}
                    placeholder="Enter custom exam type"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddExamType}
                    size="sm"
                    disabled={!newExamType.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
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
                  const value = parseInt(e.target.value) || 0;
                  setFormData({ 
                    ...formData, 
                    total_marks: value,
                    obtained_marks: Math.min(formData.obtained_marks, value)
                  });
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
                step="1"
                value={formData.obtained_marks || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData({ 
                    ...formData, 
                    obtained_marks: Math.min(value, formData.total_marks)
                  });
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
                onChange={(e) => setFormData({ 
                  ...formData, 
                  weightage: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                })}
                required
              />
              <div className="text-sm text-muted-foreground">
                This determines how much this exam contributes to the overall subject grade
              </div>
            </div>
          </div>

          {/* Performance Preview */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="font-medium">Performance Preview</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Raw Percentage:</span>
                <Badge className={`ml-2 ${getPercentageColor(getPercentage())}`}>
                  {getPercentage()}% - {getPerformanceLabel(getPercentage())}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Weighted Score:</span>
                <Badge className={`ml-2 ${getPercentageColor(getWeightedPercentage())}`}>
                  {getWeightedPercentage()}%
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMarks.isPending || updateMarks.isPending}>
              {editingRecord ? 'Update' : 'Add'} Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

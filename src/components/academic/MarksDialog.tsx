
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
import { useToast } from '@/hooks/use-toast';
import { FormFieldError } from '@/components/ui/form-field-error';
import { cn } from '@/lib/utils';

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
  const [touched, setTouched] = useState({
    subject_name: false,
    exam_type: false,
    total_marks: false,
    obtained_marks: false,
    weightage: false,
    semester_id: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const { data: semesters = [] } = useSemesters();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();
  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setFormData({
      subject_name: '',
      exam_type: '',
      total_marks: 100,
      obtained_marks: 0,
      weightage: 100,
      semester_id: semesterId || ''
    });
    setTouched({
      subject_name: false,
      exam_type: false,
      total_marks: false,
      obtained_marks: false,
      weightage: false,
      semester_id: false
    });
    setErrors({});
  }, [semesterId]);

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        subject_name: editingRecord.subject_name,
        exam_type: editingRecord.exam_type,
        total_marks: editingRecord.total_marks,
        obtained_marks: editingRecord.obtained_marks,
        weightage: (editingRecord as any).weightage || 100,
        semester_id: editingRecord.semester_id
      });
      setTouched({
        subject_name: false,
        exam_type: false,
        total_marks: false,
        obtained_marks: false,
        weightage: false,
        semester_id: false
      });
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingRecord, semesterId, resetForm]);

  // Validation functions
  const validateField = (field: keyof typeof formData, value: any): string | null => {
    switch (field) {
      case 'subject_name':
        const trimmed = String(value || '').trim();
        if (!trimmed) return 'Subject name is required';
        if (trimmed.length < 2) return 'Subject name must be at least 2 characters';
        if (trimmed.length > 100) return 'Subject name must be less than 100 characters';
        return null;
      case 'exam_type':
        if (!value || !String(value).trim()) return 'Exam type is required';
        return null;
      case 'total_marks':
        const total = Number(value) || 0;
        if (total <= 0) return 'Total marks must be greater than 0';
        if (total > 10000) return 'Total marks seems too high. Please verify.';
        return null;
      case 'obtained_marks':
        const obtained = Number(value) || 0;
        const totalMarks = Number(formData.total_marks) || 0;
        if (obtained < 0) return 'Obtained marks cannot be negative';
        if (obtained > totalMarks && totalMarks > 0) {
          return `Obtained marks (${obtained}) cannot exceed total marks (${totalMarks})`;
        }
        return null;
      case 'weightage':
        const weight = Number(value) || 0;
        if (weight < 0) return 'Weightage cannot be negative';
        if (weight > 100) return 'Weightage cannot exceed 100%';
        return null;
      case 'semester_id':
        if (!value) return 'Please select a semester';
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If field was touched, validate immediately
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }

    // Special case: if total_marks changes, revalidate obtained_marks
    if (field === 'total_marks' && touched.obtained_marks) {
      const obtainedError = validateField('obtained_marks', formData.obtained_marks);
      setErrors(prev => ({ ...prev, obtained_marks: obtainedError || undefined }));
    }
  };

  const handleFieldBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  };

  const validateAll = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof typeof formData>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      subject_name: true,
      exam_type: true,
      total_marks: true,
      obtained_marks: true,
      weightage: true,
      semester_id: true
    });
    return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form before submitting.',
        variant: 'destructive',
      });
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
        toast({
          title: 'Marks Updated',
          description: `Marks record for ${payload.subject_name} has been updated successfully.`,
        });
      } else {
        await createMarks.mutateAsync(payload);
        toast({
          title: 'Marks Added',
          description: `Marks record for ${payload.subject_name} has been added successfully.`,
        });
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error Saving Marks',
        description: error?.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
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
              onChange={(e) => handleFieldChange('subject_name', e.target.value)}
              onBlur={() => handleFieldBlur('subject_name')}
              placeholder="e.g., Engineering Mathematics"
              required
              className={cn(errors.subject_name && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={!!errors.subject_name}
              aria-describedby={errors.subject_name ? "subject_name-error" : undefined}
            />
            <FormFieldError error={errors.subject_name} id="subject_name-error" />
          </div>

          {!semesterId && (
            <div>
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester_id}
                onValueChange={(value) => {
                  handleFieldChange('semester_id', value);
                  handleFieldBlur('semester_id');
                }}
                required
              >
                <SelectTrigger className={cn(errors.semester_id && "border-destructive")}>
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
              <FormFieldError error={errors.semester_id} />
            </div>
          )}

          <div>
            <Label htmlFor="exam_type">Exam Type *</Label>
            <Select
              value={formData.exam_type}
              onValueChange={(value) => {
                handleFieldChange('exam_type', value);
                handleFieldBlur('exam_type');
              }}
              required
            >
              <SelectTrigger className={cn(errors.exam_type && "border-destructive")}>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_EXAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={errors.exam_type} />
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
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  handleFieldChange('total_marks', value);
                  // Auto-adjust obtained marks if it exceeds new total
                  if (value > 0 && formData.obtained_marks > value) {
                    handleFieldChange('obtained_marks', value);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleFieldChange('total_marks', 0);
                  }
                  handleFieldBlur('total_marks');
                }}
                required
                className={cn(errors.total_marks && "border-destructive focus-visible:ring-destructive")}
                aria-invalid={!!errors.total_marks}
                aria-describedby={errors.total_marks ? "total_marks-error" : undefined}
              />
              <FormFieldError error={errors.total_marks} id="total_marks-error" />
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
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                  handleFieldChange('obtained_marks', value);
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleFieldChange('obtained_marks', 0);
                  }
                  handleFieldBlur('obtained_marks');
                }}
                required
                className={cn(errors.obtained_marks && "border-destructive focus-visible:ring-destructive")}
                aria-invalid={!!errors.obtained_marks}
                aria-describedby={errors.obtained_marks ? "obtained_marks-error" : undefined}
              />
              <FormFieldError error={errors.obtained_marks} id="obtained_marks-error" />
              {!errors.obtained_marks && formData.total_marks > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.obtained_marks} of {formData.total_marks} marks
                </p>
              )}
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
                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                  handleFieldChange('weightage', value);
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleFieldChange('weightage', 100);
                  }
                  handleFieldBlur('weightage');
                }}
                required
                className={cn(errors.weightage && "border-destructive focus-visible:ring-destructive")}
                aria-invalid={!!errors.weightage}
                aria-describedby={errors.weightage ? "weightage-error" : undefined}
              />
              <FormFieldError error={errors.weightage} id="weightage-error" />
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
            <Button 
              type="submit" 
              disabled={
                createMarks.isPending || 
                updateMarks.isPending || 
                !!errors.subject_name || 
                !!errors.exam_type || 
                !!errors.total_marks || 
                !!errors.obtained_marks || 
                !!errors.weightage || 
                !!errors.semester_id
              }
            >
              {createMarks.isPending || updateMarks.isPending ? (
                <>Saving...</>
              ) : (
                <>{editingRecord ? 'Update' : 'Add'} Marks</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

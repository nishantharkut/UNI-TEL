import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Target, Edit, Trash2 } from 'lucide-react';
import { useCreateMarks, useUpdateMarks, useSemesters } from '@/hooks/useAcademic';
import type { MarksRecord } from '@/services/academicService';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId?: string;
  editingRecord?: MarksRecord | null;
}

export function EnhancedMarksDialog({ 
  open, 
  onOpenChange, 
  semesterId,
  editingRecord 
}: EnhancedMarksDialogProps) {
  
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
  const { data: allSubjects = [] } = useSubjects();
  const { data: semesterSubjects = [] } = useSubjectsBySemester(formData.semester_id || semesterId || '');
  const { data: marksRecords = [] } = useMarks();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();
  const { toast } = useToast();
  
  // Determine which subjects to show based on whether semester is selected
  const availableSubjects = (formData.semester_id || semesterId) 
    ? semesterSubjects 
    : allSubjects;
  
  // Get existing marks subject names to exclude from dropdown
  const existingMarksSubjects = marksRecords
    .filter(r => (!editingRecord || r.id !== editingRecord.id))
    .filter(r => (formData.semester_id || semesterId) ? r.semester_id === (formData.semester_id || semesterId) : true)
    .map(r => r.subject_name.toLowerCase().trim());
  
  // Filter out subjects that already have marks records
  const selectableSubjects = availableSubjects.filter((subject: { name: string }) => 
    !existingMarksSubjects.includes(subject.name.toLowerCase().trim())
  );
  
  // Allow manual entry option
  const [useManualEntry, setUseManualEntry] = useState(false);

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
      setFormData({ ...formData, exam_type: newExamType.trim() });
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
    setUseManualEntry(false);
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
      // Check if the subject exists in the semester's subjects
      const subjectExists = availableSubjects.some((s: { name: string }) => 
        s.name.toLowerCase().trim() === editingRecord.subject_name.toLowerCase().trim()
      );
      setUseManualEntry(!subjectExists);
    } else {
      resetForm();
    }
  }, [editingRecord, resetForm, availableSubjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const errors: string[] = [];
    if (!formData.subject_name.trim()) {
      errors.push('Subject name is required');
    }
    if (!formData.exam_type.trim()) {
      errors.push('Exam type is required');
    }
    if (!formData.semester_id) {
      errors.push('Semester is required');
    }
    if (formData.total_marks <= 0) {
      errors.push('Total marks must be greater than 0');
    }
    if (formData.obtained_marks < 0 || formData.obtained_marks > formData.total_marks) {
      errors.push('Obtained marks must be between 0 and total marks');
    }
    if (formData.weightage < 0 || formData.weightage > 100) {
      errors.push('Weightage must be between 0 and 100');
    }

    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join('. '),
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

  const allExamTypes = [
    'Mid Term', 'End Term', 'Quiz', 'Assignment', 'Lab Exam', 
    'Viva', 'Project', 'Presentation', 'Practical', 'Other',
    ...customExamTypes
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {editingRecord ? 'Edit Marks Record' : 'Add New Marks Record'}
            <Badge variant="outline" className="ml-auto">
              Custom Weightage
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="subject_name">Subject Name *</Label>
                {selectableSubjects.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setUseManualEntry(!useManualEntry);
                      if (!useManualEntry) {
                        setFormData({ ...formData, subject_name: '' });
                      }
                    }}
                  >
                    {useManualEntry ? 'Select from list' : 'Enter manually'}
                  </Button>
                )}
              </div>
              {!useManualEntry && selectableSubjects.length > 0 ? (
                <Select
                  value={formData.subject_name}
                  onValueChange={(value) => setFormData({ ...formData, subject_name: value })}
                >
                  <SelectTrigger className={cn(errors?.subject_name && "border-destructive")}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableSubjects.map((subject: { id: string; name: string; credits: number }) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name} ({subject.credits} credits)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="subject_name"
                  value={formData.subject_name}
                  onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                  placeholder="Enter subject name"
                  required
                />
              )}
              {!useManualEntry && selectableSubjects.length === 0 && (formData.semester_id || semesterId) && (
                <p className="text-xs text-muted-foreground mt-1">
                  No subjects available for this semester. Please add subjects first or enter manually.
                </p>
              )}
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
          </div>

          <div>
            <Label htmlFor="exam_type">Exam Type *</Label>
            <div className="space-y-3">
              <Select
                value={formData.exam_type}
                onValueChange={(value) => {
                  if (value === '__create_new__') {
                    setShowAddExamType(true);
                  } else {
                    setFormData({ ...formData, exam_type: value });
                  }
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select or create exam type" />
                </SelectTrigger>
                <SelectContent>
                  {allExamTypes.map((type) => (
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

              {showAddExamType && (
                <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
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
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddExamType(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Custom Exam Types Management */}
              {customExamTypes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Your Custom Exam Types:</Label>
                  <div className="flex flex-wrap gap-2">
                    {customExamTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        {type}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveExamType(type)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_marks">Total Marks *</Label>
              <Input
                id="total_marks"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.total_marks === 0 ? '' : String(formData.total_marks)}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (value === '') {
                    setFormData({ ...formData, total_marks: 0 });
                    return;
                  }
                  if (/^\d+$/.test(value)) {
                    const numValue = parseInt(value, 10);
                    if (!isNaN(numValue)) {
                      setFormData({ 
                        ...formData, 
                        total_marks: numValue,
                        obtained_marks: Math.min(formData.obtained_marks, numValue)
                      });
                    }
                  }
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="obtained_marks">Obtained Marks *</Label>
              <Input
                id="obtained_marks"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.obtained_marks === 0 ? '' : String(formData.obtained_marks)}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (value === '') {
                    setFormData({ ...formData, obtained_marks: 0 });
                    return;
                  }
                  if (/^\d+$/.test(value)) {
                    const numValue = parseInt(value, 10);
                    if (!isNaN(numValue)) {
                      setFormData({ 
                        ...formData, 
                        obtained_marks: Math.min(numValue, formData.total_marks)
                      });
                    }
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
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={formData.weightage === 0 ? '' : String(formData.weightage)}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (value === '') {
                    setFormData({ ...formData, weightage: 0 });
                    return;
                  }
                  if (/^\d*\.?\d*$/.test(value)) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      setFormData({ 
                        ...formData, 
                        weightage: Math.min(100, Math.max(0, numValue))
                      });
                    }
                  }
                }}
                required
              />
              <div className="text-sm text-muted-foreground">
                This determines how much this exam contributes to the overall subject grade (0-100%)
              </div>
            </div>
          </div>

          {/* Performance Preview */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="font-medium">Performance Preview</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Raw Percentage:</span>
                <Badge className={`${getPercentageColor(getPercentage())}`}>
                  {getPercentage()}% - {getPerformanceLabel(getPercentage())}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Weighted Score:</span>
                <Badge className={`${getPercentageColor(getWeightedPercentage())}`}>
                  {getWeightedPercentage()}%
                </Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Weighted Score = Raw Percentage × Weightage ÷ 100
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

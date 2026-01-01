import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, FileText, Target } from 'lucide-react';
import { useMarks, useCreateMarks, useUpdateMarks, useDeleteMarks, useSemesters } from '@/hooks/useAcademic';
import type { MarksRecord } from '@/services/academicService';

// Default exam types - user can create custom ones
const DEFAULT_EXAM_TYPES = ['Quiz', 'Mid Term', 'End Term', 'Assignment', 'Lab Exam', 'Viva', 'Project', 'Presentation', 'Practical', 'Other'];

interface MarksEditorProps {
  semesterId?: string;
}

export function MarksEditor({ semesterId }: MarksEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MarksRecord | null>(null);
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

  const { data: marksRecords = [], isLoading } = useMarks();
  const { data: semesters = [] } = useSemesters();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();
  const deleteMarks = useDeleteMarks();

  // Load custom exam types from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('customExamTypes');
    if (saved) {
      setCustomExamTypes(JSON.parse(saved));
    }
  }, []);

  // Save custom exam types to localStorage
  const saveCustomExamTypes = (types: string[]) => {
    setCustomExamTypes(types);
    localStorage.setItem('customExamTypes', JSON.stringify(types));
  };

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

  const filteredRecords = semesterId 
    ? marksRecords.filter((record: { semester_id: string }) => record.semester_id === semesterId)
    : marksRecords;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert null values to appropriate defaults
    const submitData = {
      ...formData,
      total_marks: formData.total_marks || 0,
      obtained_marks: formData.obtained_marks || 0,
      weightage: formData.weightage || 100
    };
    
    try {
      if (editingRecord) {
        await updateMarks.mutateAsync({
          id: editingRecord.id,
          updates: {
            ...submitData,
            weightage: Number(submitData.weightage)
          }
        });
      } else {
        await createMarks.mutateAsync({
          ...submitData,
          weightage: Number(submitData.weightage)
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error is handled by the mutation's onError callback which shows a toast
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
      total_marks: 100,
      obtained_marks: 0,
      weightage: 100,
      semester_id: semesterId || '',
      source_json_import: false
    });
  };

  const getSemesterNumber = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId);
    return semester?.number || 'Unknown';
  };

  const getPreviewPercentage = () => {
    const total = formData.total_marks || 0;
    const obtained = formData.obtained_marks || 0;
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100 * 100) / 100;
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
                <div className="space-y-2">
                  <Select 
                    value={formData.exam_type} 
                    onValueChange={(value) => {
                      if (value === '__create_new__') {
                        setShowAddExamType(true);
                      } else {
                        setFormData({ ...formData, exam_type: value });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or create exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...DEFAULT_EXAM_TYPES, ...customExamTypes].map((type) => (
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
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    type="number"
                    min="1"
                    value={formData.total_marks || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseInt(e.target.value);
                      setFormData({ 
                        ...formData, 
                        total_marks: value
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
                  <Label htmlFor="obtained_marks">Obtained Marks</Label>
                  <Input
                    id="obtained_marks"
                    type="number"
                    min="0"
                    max={formData.total_marks || undefined}
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
                <Label htmlFor="weightage">Weightage (%)</Label>
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
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Performance Preview</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Raw Score:</span>
                      <div className="font-medium">
                        {formData.obtained_marks} / {formData.total_marks} 
                        ({getPreviewPercentage()}%)
                      </div>
                      <Badge className={getPercentageColor(getPreviewPercentage())}>
                        {getPerformanceLabel(getPreviewPercentage())}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weighted Score:</span>
                      <div className="font-medium">
                        {Math.round(getPreviewPercentage() * formData.weightage / 100 * 100) / 100}%
                      </div>
                      <Badge className={getPercentageColor(Math.round(getPreviewPercentage() * formData.weightage / 100 * 100) / 100)}>
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
            filteredRecords.reduce((groups: Record<string, MarksRecord[]>, record: MarksRecord) => {
              const key = record.subject_name;
              if (!groups[key]) groups[key] = [];
              groups[key].push(record);
              return groups;
            }, {})
          ).map(([subjectName, records]: [string, MarksRecord[]]) => (
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
                {records.map((record: MarksRecord) => (
                  <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-md gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="min-w-fit">
                          {record.exam_type}
                        </Badge>
                        <span className="text-sm font-medium">
                          {record.obtained_marks} / {record.total_marks}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-academic-primary">
                          {record.percentage?.toFixed(1)}%
                        </span>
                        <Badge className={getPercentageColor(record.percentage || 0)}>
                          {getPerformanceLabel(record.percentage || 0)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
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

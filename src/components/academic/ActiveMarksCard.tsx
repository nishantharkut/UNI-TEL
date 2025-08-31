
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calculator, Target } from 'lucide-react';
import { useCreateMarks, useUpdateMarks, useDeleteMarks, useSemesters } from '@/hooks/useAcademic';
import type { MarksRecord } from '@/services/academicService';

const EXAM_TYPES = [
  { name: 'Mid Term', defaultWeight: 30 },
  { name: 'End Term', defaultWeight: 50 },
  { name: 'Quiz', defaultWeight: 5 },
  { name: 'Assignment', defaultWeight: 10 },
  { name: 'Lab Exam', defaultWeight: 15 },
  { name: 'Viva', defaultWeight: 10 },
  { name: 'Project', defaultWeight: 20 }
];

interface MarksRecordWithWeight extends MarksRecord {
  weightage?: number;
}

interface ActiveMarksCardProps {
  records: MarksRecord[];
}

export function ActiveMarksCard({ records }: ActiveMarksCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MarksRecordWithWeight | null>(null);
  const [newRecord, setNewRecord] = useState({
    subject_name: '',
    exam_type: '',
    total_marks: 100,
    obtained_marks: 0,
    weightage: 50,
    semester_id: ''
  });

  const { data: semesters = [] } = useSemesters();
  const createMarks = useCreateMarks();
  const updateMarks = useUpdateMarks();
  const deleteMarks = useDeleteMarks();

  const handleAddRecord = async () => {
    if (!newRecord.subject_name.trim() || !newRecord.exam_type || !newRecord.semester_id) return;

    await createMarks.mutateAsync({
      subject_name: newRecord.subject_name.trim(),
      exam_type: newRecord.exam_type,
      total_marks: newRecord.total_marks,
      obtained_marks: newRecord.obtained_marks,
      semester_id: newRecord.semester_id,
      source_json_import: false
    });

    setNewRecord({
      subject_name: '',
      exam_type: '',
      total_marks: 100,
      obtained_marks: 0,
      weightage: 50,
      semester_id: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = async (recordId: string, updates: Partial<MarksRecord>) => {
    await updateMarks.mutateAsync({ id: recordId, updates });
    setEditingRecord(null);
  };

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this marks record?')) {
      await deleteMarks.mutateAsync(recordId);
    }
  };

  const getSemesterName = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId);
    return semester ? `Sem ${semester.number}` : 'Unknown';
  };

  const getPerformanceColor = (percentage: number) => {
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

  // Group records by subject
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.subject_name]) {
      acc[record.subject_name] = [];
    }
    acc[record.subject_name].push(record);
    return acc;
  }, {} as Record<string, MarksRecord[]>);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Marks & Weightage Tracker</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Marks
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Marks Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={newRecord.subject_name}
                  onChange={(e) => setNewRecord({ ...newRecord, subject_name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <Label>Semester</Label>
                <Select value={newRecord.semester_id} onValueChange={(value) => setNewRecord({ ...newRecord, semester_id: value })}>
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
              <div>
                <Label>Exam Type</Label>
                <Select 
                  value={newRecord.exam_type} 
                  onValueChange={(value) => {
                    const examType = EXAM_TYPES.find(t => t.name === value);
                    setNewRecord({ 
                      ...newRecord, 
                      exam_type: value,
                      weightage: examType?.defaultWeight || 50
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type.name} value={type.name}>
                        {type.name} (Default: {type.defaultWeight}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    value={newRecord.total_marks}
                    onChange={(e) => setNewRecord({ ...newRecord, total_marks: parseInt(e.target.value) || 100 })}
                  />
                </div>
                <div>
                  <Label>Obtained Marks</Label>
                  <Input
                    type="number"
                    value={newRecord.obtained_marks}
                    onChange={(e) => setNewRecord({ ...newRecord, obtained_marks: Math.min(parseInt(e.target.value) || 0, newRecord.total_marks) })}
                  />
                </div>
              </div>
              <div>
                <Label>Weightage (%)</Label>
                <Input
                  type="number"
                  value={newRecord.weightage}
                  onChange={(e) => setNewRecord({ ...newRecord, weightage: Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100) })}
                  placeholder="e.g., 30"
                />
              </div>
              {newRecord.total_marks > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Score: {newRecord.obtained_marks}/{newRecord.total_marks}</span>
                    <span className="text-sm font-medium">{((newRecord.obtained_marks / newRecord.total_marks) * 100).toFixed(1)}%</span>
                  </div>
                  <Badge className={getPerformanceColor((newRecord.obtained_marks / newRecord.total_marks) * 100)}>
                    {getPerformanceLabel((newRecord.obtained_marks / newRecord.total_marks) * 100)}
                  </Badge>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleAddRecord} className="flex-1">Add</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedRecords).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No marks records yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedRecords).map(([subjectName, subjectRecords]) => {
            // Calculate weighted average
            const totalWeightedScore = subjectRecords.reduce((sum, record) => {
              const percentage = (record.obtained_marks / record.total_marks) * 100;
              const weightage = 100 / subjectRecords.length; // Equal weightage if not specified
              return sum + (percentage * weightage / 100);
            }, 0);

            const overallPercentage = totalWeightedScore;
            const { color } = { color: getPerformanceColor(overallPercentage) };

            return (
              <Card key={subjectName}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg">{subjectName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={color}>
                          Overall: {overallPercentage.toFixed(1)}%
                        </Badge>
                        <Badge variant="outline">
                          {subjectRecords.length} exam{subjectRecords.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subjectRecords.map((record) => {
                      const percentage = (record.obtained_marks / record.total_marks) * 100;
                      return (
                        <div key={record.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium">{record.exam_type}</span>
                              <Badge variant="outline">{getSemesterName(record.semester_id)}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.obtained_marks}/{record.total_marks} marks ({percentage.toFixed(1)}%)
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPerformanceColor(percentage)}>
                              {getPerformanceLabel(percentage)}
                            </Badge>
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
                      );
                    })}
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
              <DialogTitle>Edit Marks Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={editingRecord.subject_name}
                  onChange={(e) => setEditingRecord({ ...editingRecord, subject_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Exam Type</Label>
                <Input
                  value={editingRecord.exam_type}
                  onChange={(e) => setEditingRecord({ ...editingRecord, exam_type: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    value={editingRecord.total_marks}
                    onChange={(e) => setEditingRecord({ ...editingRecord, total_marks: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Obtained Marks</Label>
                  <Input
                    type="number"
                    value={editingRecord.obtained_marks}
                    onChange={(e) => setEditingRecord({ ...editingRecord, obtained_marks: Math.min(parseInt(e.target.value) || 0, editingRecord.total_marks) })}
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

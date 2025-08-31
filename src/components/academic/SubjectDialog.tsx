
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSubject, useUpdateSubject } from '@/hooks/useAcademic';
import { BookOpen, GraduationCap, Save, Plus } from 'lucide-react';
import { gradeToPoints } from '@/utils/gradeCalculations';

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId: string;
  editingSubject?: any;
}

const GRADES = ['A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'E', 'F', 'I'];

export function SubjectDialog({ open, onOpenChange, semesterId, editingSubject }: SubjectDialogProps) {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [grade, setGrade] = useState('');
  
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  // Reset form when dialog opens/closes or editing subject changes
  useEffect(() => {
    if (open) {
      if (editingSubject) {
        console.log('Setting form values for editing:', editingSubject);
        setName(editingSubject.name || '');
        setCredits(editingSubject.credits || 3);
        setGrade(editingSubject.grade || 'no-grade');
      } else {
        console.log('Resetting form for new subject');
        setName('');
        setCredits(3);
        setGrade('no-grade');
      }
    }
  }, [editingSubject, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      console.error('Subject name is required');
      return;
    }

    try {
      const subjectData = {
        name: name.trim(),
        credits,
        grade: grade === 'no-grade' ? null : grade,
        semester_id: semesterId,
        source_json_import: false
      };

      console.log('Submitting subject data:', subjectData);

      if (editingSubject) {
        console.log('Updating subject with ID:', editingSubject.id);
        await updateSubject.mutateAsync({
          id: editingSubject.id,
          updates: subjectData
        });
      } else {
        console.log('Creating new subject');
        await createSubject.mutateAsync(subjectData);
      }
      
      // Close dialog and reset form
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const gradePoints = grade && grade !== 'no-grade' ? gradeToPoints(grade) : 0;
  const totalPoints = gradePoints * credits;

  const isLoading = createSubject.isPending || updateSubject.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 rounded-lg bg-primary/10">
              {editingSubject ? (
                <GraduationCap className="w-6 h-6 text-primary" />
              ) : (
                <BookOpen className="w-6 h-6 text-primary" />
              )}
            </div>
            <span className="font-bold">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Subject Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-base"
              placeholder="e.g., Engineering Mathematics"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits" className="text-sm font-semibold text-foreground">
                Credits *
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value) || 1)}
                required
                className="h-12 text-base"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm font-semibold text-foreground">
                Grade
              </Label>
              <Select 
                value={grade} 
                onValueChange={setGrade}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-60">
                  <SelectItem value="no-grade" className="hover:bg-accent">
                    <span className="text-muted-foreground">No Grade</span>
                  </SelectItem>
                  {GRADES.map((gradeOption) => (
                    <SelectItem key={gradeOption} value={gradeOption} className="hover:bg-accent">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-base">{gradeOption}</span>
                        <span className="text-muted-foreground ml-4 text-sm">
                          {gradeToPoints(gradeOption).toFixed(1)} pts
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {grade && grade !== 'no-grade' && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-muted-foreground/20">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Grade Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-background/50 rounded-md p-3">
                  <span className="text-muted-foreground block mb-1">Grade Points</span>
                  <span className="text-lg font-bold text-primary">{gradePoints.toFixed(1)}</span>
                </div>
                <div className="bg-background/50 rounded-md p-3">
                  <span className="text-muted-foreground block mb-1">Total Points</span>
                  <span className="text-lg font-bold text-primary">{totalPoints.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="h-12 px-6 font-medium"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <>
                  {editingSubject ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {editingSubject ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Subject
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Subject
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

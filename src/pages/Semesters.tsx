
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useSemesters, useCreateSemester } from '@/hooks/useAcademic';
import { SemesterCard } from '@/components/academic/SemesterCard';
import { ImportExport } from '@/components/academic/ImportExport';
import { Plus, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export default function Semesters() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [semesterNumber, setSemesterNumber] = useState(1);
  
  const { data: semesters = [], isLoading } = useSemesters();
  const createSemester = useCreateSemester();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSemester.mutateAsync({
        number: semesterNumber,
        total_credits: 0,
        source_json_import: false
      });
      setIsDialogOpen(false);
      setSemesterNumber(1);
    } catch (error) {
      console.error('Error creating semester:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary/20 border-t-primary mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-3 border-transparent border-t-primary/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-lg font-medium text-muted-foreground">Loading your semesters...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Semesters</h1>
                <p className="text-base text-muted-foreground mt-1">Organize your academic journey by semesters</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <ImportExport />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 lg:flex-none bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6">
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Add Semester</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-bold">Add New Semester</span>
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <Label htmlFor="number" className="text-sm font-semibold text-foreground">
                      Semester Number
                    </Label>
                    <Input
                      id="number"
                      type="number"
                      min="1"
                      max="12"
                      value={semesterNumber}
                      onChange={(e) => setSemesterNumber(parseInt(e.target.value))}
                      required
                      className="h-12 text-base rounded-xl border-2 focus:border-primary transition-colors"
                      placeholder="Enter semester number"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsDialogOpen(false)}
                      className="font-medium h-12 px-6 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold h-12 px-6 rounded-xl shadow-lg"
                      disabled={createSemester.isPending}
                    >
                      {createSemester.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/20 border-t-primary-foreground mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Semesters List */}
        {semesters.length > 0 ? (
          <div className="space-y-6 lg:space-y-8">
            {semesters
              .sort((a, b) => b.number - a.number) // Most recent first
              .map((semester) => (
                <SemesterCard key={semester.id} semester={semester} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 lg:py-24">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 w-24 h-24 mx-auto flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <BookOpen className="w-10 h-10 text-muted-foreground/60" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary/60" />
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">Start Your Academic Journey</h3>
              <p className="text-muted-foreground mb-8 text-sm lg:text-base leading-relaxed">
                Create your first semester to begin organizing subjects, tracking attendance, and monitoring your academic progress.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Semester
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

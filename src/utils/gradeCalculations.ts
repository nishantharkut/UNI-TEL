
export const gradeToPoints = (grade: string): number => {
  switch (grade) {
    case 'A': return 10.0;
    case 'A-': return 9.0;
    case 'B': return 8.0;
    case 'B-': return 7.0;
    case 'C': return 6.0;
    case 'C-': return 5.0;
    case 'D': return 4.0;
    case 'E': case 'F': case 'I': return 0.0;
    default: return 0.0;
  }
};

export const validateGrade = (grade: string): boolean => {
  return ['A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'E', 'F', 'I'].includes(grade);
};

export const computeSGPA = (subjects: Array<{ credits: number; grade?: string }>): number => {
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  if (totalCredits === 0) return 0;
  
  const weightedPoints = subjects.reduce((sum, subject) => {
    const points = subject.grade ? gradeToPoints(subject.grade) : 0;
    return sum + (subject.credits * points);
  }, 0);
  
  return Math.round((weightedPoints / totalCredits) * 100) / 100;
};

export const computeCGPA = (semesters: Array<{ sgpa?: number; total_credits: number }>): number => {
  const validSemesters = semesters.filter(s => s.sgpa !== null && s.sgpa !== undefined && s.total_credits > 0);
  const totalCredits = validSemesters.reduce((sum, semester) => sum + semester.total_credits, 0);
  
  if (totalCredits === 0) return 0;
  
  const weightedSgpa = validSemesters.reduce((sum, semester) => {
    return sum + (semester.sgpa! * semester.total_credits);
  }, 0);
  
  return Math.round((weightedSgpa / totalCredits) * 100) / 100;
};

export const getGradeColor = (grade?: string): string => {
  if (!grade) return 'secondary';
  
  switch (grade) {
    case 'A':
    case 'A-':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'B':
    case 'B-':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'C':
    case 'C-':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

export const getAttendanceStatus = (percentage: number): { status: string; color: string } => {
  if (percentage >= 90) return { status: 'Excellent', color: 'bg-green-100 text-green-800' };
  if (percentage >= 80) return { status: 'Good', color: 'bg-blue-100 text-blue-800' };
  if (percentage >= 75) return { status: 'Average', color: 'bg-yellow-100 text-yellow-800' };
  return { status: 'Poor', color: 'bg-red-100 text-red-800' };
};

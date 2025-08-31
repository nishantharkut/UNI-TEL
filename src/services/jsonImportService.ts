
import { supabase } from '@/integrations/supabase/client';

export interface ImportData {
  semesters?: Array<{
    number: number;
    subjects?: Array<{
      name: string;
      credits: number;
      grade?: string;
    }>;
    attendance?: Array<{
      subject_name: string;
      total_classes: number;
      attended_classes: number;
      note?: string;
    }>;
    marks?: Array<{
      subject_name: string;
      exam_type: string;
      total_marks: number;
      obtained_marks: number;
    }>;
  }>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  imported_counts?: {
    semesters: number;
    subjects: number;
    attendance: number;
    marks: number;
  };
  errors?: string[];
}

export const jsonImportService = {
  async importData(data: ImportData): Promise<ImportResult> {
    try {
      const { data: result, error } = await supabase.functions.invoke('import-academic-data', {
        body: { importData: data }
      });

      if (error) {
        throw error;
      }

      return result as ImportResult;
    } catch (error) {
      console.error('Import failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      };
    }
  },

  async exportData(): Promise<ImportData | null> {
    try {
      const { data: semesters } = await supabase
        .from('semesters')
        .select(`
          number,
          subjects:subjects!inner(name, credits, grade),
          attendance:attendance_records(subject_name, total_classes, attended_classes, note),
          marks:marks_records(subject_name, exam_type, total_marks, obtained_marks)
        `)
        .order('number');

      if (!semesters) return null;

      return {
        semesters: semesters.map(semester => ({
          number: semester.number,
          subjects: semester.subjects || [],
          attendance: semester.attendance || [],
          marks: semester.marks || []
        }))
      };
    } catch (error) {
      console.error('Export failed:', error);
      return null;
    }
  }
};

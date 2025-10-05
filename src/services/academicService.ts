
import { supabase } from '@/integrations/supabase/client';

export interface Semester {
  id: string;
  user_id: string;
  number: number;
  sgpa?: number;
  total_credits: number;
  source_json_import: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  semester_id: string;
  name: string;
  credits: number;
  grade?: string;
  grade_points?: number;
  source_json_import: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  semester_id: string;
  subject_name: string;
  total_classes: number;
  attended_classes: number;
  percentage?: number;
  note?: string;
  source_json_import: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarksRecord {
  id: string;
  user_id: string;
  semester_id: string;
  subject_name: string;
  exam_type: string;
  total_marks: number;
  obtained_marks: number;
  percentage?: number;
  weightage?: number;
  weighted_percentage?: number;
  source_json_import: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicSummary {
  user_id: string;
  total_semesters: number;
  total_subjects: number;
  total_credits: number;
  average_sgpa?: number;
  cgpa?: number;
  backlogs: number;
}

// Semester services
export const semesterService = {
  async getAll() {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('number');
    if (error) throw error;
    return data as Semester[];
  },

  async create(semester: Omit<Semester, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('semesters')
      .insert({ 
        ...semester, 
        user_id: user.id,
        source_json_import: semester.source_json_import ?? false,
        total_credits: semester.total_credits ?? 0
      })
      .select()
      .single();
    if (error) throw error;
    return data as Semester;
  },

  async update(id: string, updates: Partial<Semester>) {
    const { data, error } = await supabase
      .from('semesters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Semester;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('semesters')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Subject services
export const subjectService = {
  async getAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        semester:semesters!inner(number)
      `)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getBySemester(semesterId: string) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('semester_id', semesterId)
      .order('name');
    if (error) throw error;
    return data as Subject[];
  },

  async create(subject: Omit<Subject, 'id' | 'user_id' | 'grade_points' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subjects')
      .insert({ 
        ...subject, 
        user_id: user.id,
        source_json_import: subject.source_json_import ?? false
      })
      .select()
      .single();
    if (error) throw error;
    return data as Subject;
  },

  async update(id: string, updates: Partial<Subject>) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Subject;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Attendance services
export const attendanceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        semester:semesters!inner(number)
      `)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getBySemester(semesterId: string) {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('semester_id', semesterId)
      .order('subject_name');
    if (error) throw error;
    return data as AttendanceRecord[];
  },

  async create(record: Omit<AttendanceRecord, 'id' | 'user_id' | 'percentage' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('attendance_records')
      .insert({ 
        ...record, 
        user_id: user.id,
        source_json_import: record.source_json_import ?? false
      })
      .select()
      .single();
    if (error) throw error;
    return data as AttendanceRecord;
  },

  async update(id: string, updates: Partial<AttendanceRecord>) {
    const { data, error } = await supabase
      .from('attendance_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as AttendanceRecord;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('attendance_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Marks services
export const marksService = {
  async getAll() {
    const { data, error } = await supabase
      .from('marks_records')
      .select(`
        *,
        semester:semesters!inner(number)
      `)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getBySemester(semesterId: string) {
    const { data, error } = await supabase
      .from('marks_records')
      .select('*')
      .eq('semester_id', semesterId)
      .order('subject_name')
      .order('exam_type');
    if (error) throw error;
    return data as MarksRecord[];
  },

  async create(record: Omit<MarksRecord, 'id' | 'user_id' | 'percentage' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('marks_records')
      .insert({ 
        ...record, 
        user_id: user.id,
        source_json_import: record.source_json_import ?? false
      })
      .select()
      .single();
    if (error) throw error;
    return data as MarksRecord;
  },

  async update(id: string, updates: Partial<MarksRecord>) {
    const { data, error } = await supabase
      .from('marks_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as MarksRecord;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('marks_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Academic summary
export const academicSummaryService = {
  async get() {
    const { data, error } = await supabase
      .rpc('get_user_academic_summary');
    if (error) throw error;
    return data?.[0] as AcademicSummary | null;
  }
};

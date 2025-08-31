
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportData {
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

interface ImportResult {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { importData }: { importData: ImportData } = await req.json()

    const result: ImportResult = {
      success: true,
      message: '',
      imported_counts: {
        semesters: 0,
        subjects: 0,
        attendance: 0,
        marks: 0
      },
      errors: []
    }

    if (!importData.semesters || importData.semesters.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No semesters data provided'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process each semester
    for (const semesterData of importData.semesters) {
      try {
        // Create/update semester
        const { data: semester, error: semesterError } = await supabaseClient
          .from('semesters')
          .upsert({
            user_id: user.id,
            number: semesterData.number,
            total_credits: 0,
            source_json_import: true
          }, {
            onConflict: 'user_id,number'
          })
          .select()
          .single()

        if (semesterError) {
          result.errors?.push(`Semester ${semesterData.number}: ${semesterError.message}`)
          continue
        }

        result.imported_counts!.semesters++

        // Process subjects
        if (semesterData.subjects && semesterData.subjects.length > 0) {
          for (const subjectData of semesterData.subjects) {
            try {
              const { error: subjectError } = await supabaseClient
                .from('subjects')
                .upsert({
                  user_id: user.id,
                  semester_id: semester.id,
                  name: subjectData.name,
                  credits: subjectData.credits,
                  grade: subjectData.grade,
                  source_json_import: true
                }, {
                  onConflict: 'user_id,semester_id,name'
                })

              if (subjectError) {
                result.errors?.push(`Subject ${subjectData.name}: ${subjectError.message}`)
              } else {
                result.imported_counts!.subjects++
              }
            } catch (error) {
              result.errors?.push(`Subject ${subjectData.name}: ${error.message}`)
            }
          }
        }

        // Process attendance
        if (semesterData.attendance && semesterData.attendance.length > 0) {
          for (const attendanceData of semesterData.attendance) {
            try {
              const { error: attendanceError } = await supabaseClient
                .from('attendance_records')
                .upsert({
                  user_id: user.id,
                  semester_id: semester.id,
                  subject_name: attendanceData.subject_name,
                  total_classes: attendanceData.total_classes,
                  attended_classes: attendanceData.attended_classes,
                  note: attendanceData.note,
                  source_json_import: true
                }, {
                  onConflict: 'user_id,semester_id,subject_name'
                })

              if (attendanceError) {
                result.errors?.push(`Attendance ${attendanceData.subject_name}: ${attendanceError.message}`)
              } else {
                result.imported_counts!.attendance++
              }
            } catch (error) {
              result.errors?.push(`Attendance ${attendanceData.subject_name}: ${error.message}`)
            }
          }
        }

        // Process marks
        if (semesterData.marks && semesterData.marks.length > 0) {
          for (const marksData of semesterData.marks) {
            try {
              const { error: marksError } = await supabaseClient
                .from('marks_records')
                .insert({
                  user_id: user.id,
                  semester_id: semester.id,
                  subject_name: marksData.subject_name,
                  exam_type: marksData.exam_type,
                  total_marks: marksData.total_marks,
                  obtained_marks: marksData.obtained_marks,
                  source_json_import: true
                })

              if (marksError) {
                result.errors?.push(`Marks ${marksData.subject_name} ${marksData.exam_type}: ${marksError.message}`)
              } else {
                result.imported_counts!.marks++
              }
            } catch (error) {
              result.errors?.push(`Marks ${marksData.subject_name} ${marksData.exam_type}: ${error.message}`)
            }
          }
        }
      } catch (error) {
        result.errors?.push(`Semester ${semesterData.number}: ${error.message}`)
      }
    }

    const totalImported = (result.imported_counts?.semesters || 0) + 
                         (result.imported_counts?.subjects || 0) + 
                         (result.imported_counts?.attendance || 0) + 
                         (result.imported_counts?.marks || 0)

    if (totalImported === 0) {
      result.success = false
      result.message = 'No data was imported successfully'
    } else {
      result.message = `Successfully imported ${totalImported} records`
      if (result.errors && result.errors.length > 0) {
        result.message += ` with ${result.errors.length} errors`
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Import function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        errors: [error.message]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

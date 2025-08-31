
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Calendar, BookOpen } from 'lucide-react';
import { useSemesters, useSubjects, useAttendance, useMarks, useAcademicSummary } from '@/hooks/useAcademic';
import { computeCGPA, getGradeColor, getAttendanceStatus } from '@/utils/gradeCalculations';

export default function Analytics() {
  const { data: semesters = [] } = useSemesters();
  const { data: subjects = [] } = useSubjects();
  const { data: attendance = [] } = useAttendance();
  const { data: marks = [] } = useMarks();
  const { data: summary } = useAcademicSummary();

  // CGPA Trend Data
  const cgpaTrendData = semesters
    .filter(sem => sem.sgpa !== null)
    .map(semester => ({
      semester: `Sem ${semester.number}`,
      sgpa: semester.sgpa || 0,
      cgpa: computeCGPA(semesters.slice(0, semesters.findIndex(s => s.id === semester.id) + 1))
    }))
    .sort((a, b) => parseInt(a.semester.split(' ')[1]) - parseInt(b.semester.split(' ')[1]));

  // Grade Distribution
  const gradeDistribution = subjects
    .filter(sub => sub.grade)
    .reduce((acc, sub) => {
      const grade = sub.grade!;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: Math.round((count / subjects.filter(s => s.grade).length) * 100)
  }));

  // Attendance Analysis
  const attendanceAnalysis = attendance.map(record => ({
    subject: record.subject_name,
    percentage: Math.round((record.attended_classes / record.total_classes) * 100),
    status: getAttendanceStatus(Math.round((record.attended_classes / record.total_classes) * 100)).status
  }));

  // Performance by Semester
  const semesterPerformance = semesters.map(semester => {
    const semesterSubjects = subjects.filter(sub => sub.semester_id === semester.id);
    const semesterAttendance = attendance.filter(att => att.semester_id === semester.id);
    const avgAttendance = semesterAttendance.length > 0 
      ? Math.round(semesterAttendance.reduce((sum, att) => sum + (att.attended_classes / att.total_classes * 100), 0) / semesterAttendance.length)
      : 0;

    return {
      semester: `Sem ${semester.number}`,
      sgpa: semester.sgpa || 0,
      subjects: semesterSubjects.length,
      credits: semester.total_credits,
      attendance: avgAttendance
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive academic performance insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current CGPA</p>
                <p className="text-2xl font-bold">{summary?.cgpa?.toFixed(2) || 'N/A'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">{summary?.total_credits || 0}</p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Backlogs</p>
                <p className="text-2xl font-bold">{summary?.backlogs || 0}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">
                  {attendanceAnalysis.length > 0 
                    ? Math.round(attendanceAnalysis.reduce((sum, att) => sum + att.percentage, 0) / attendanceAnalysis.length)
                    : 0}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CGPA Trend */}
        <Card>
          <CardHeader>
            <CardTitle>CGPA Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {cgpaTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cgpaTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sgpa" stroke="#3b82f6" strokeWidth={2} name="SGPA" />
                  <Line type="monotone" dataKey="cgpa" stroke="#10b981" strokeWidth={2} name="CGPA" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No data available for CGPA trend
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {gradeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, percentage }) => `${grade} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No grade data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Semester Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Semester Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {semesterPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={semesterPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sgpa" fill="#3b82f6" name="SGPA" />
                  <Bar dataKey="attendance" fill="#10b981" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No semester data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceAnalysis.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{record.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{record.percentage}%</span>
                    <Badge className={getAttendanceStatus(record.percentage).color}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {attendanceAnalysis.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No attendance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marks.slice(0, 5).map((mark, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{mark.subject_name}</p>
                    <p className="text-sm text-muted-foreground">{mark.exam_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{mark.obtained_marks}/{mark.total_marks}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((mark.obtained_marks / mark.total_marks) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
              {marks.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No marks data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects.filter(sub => sub.grade).slice(0, 5).map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.credits} credits</p>
                  </div>
                  <Badge className={getGradeColor(subject.grade)}>
                    {subject.grade}
                  </Badge>
                </div>
              ))}
              {subjects.filter(sub => sub.grade).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No graded subjects available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

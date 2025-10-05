
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Star,
  CheckCircle,
  AlertCircle,
  Sparkles,
  GraduationCap
} from 'lucide-react';
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

  // Updated color scheme to match the new theme
  const COLORS = ['hsl(var(--academic-primary))', 'hsl(var(--academic-secondary))', 'hsl(var(--academic-accent))', 'hsl(var(--academic-warning))', 'hsl(var(--academic-danger))', 'hsl(var(--academic-primary))'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl space-y-6 sm:space-y-8">
        
        {/* Hero Section - Analytics */}
        <div className="relative overflow-hidden rounded-3xl color-secondary p-6 sm:p-8 lg:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                      Analytics Dashboard
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base">
                      Comprehensive academic performance insights
                    </p>
                  </div>
                </div>
                
                {summary?.cgpa && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/20">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80">Current Performance</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{summary.cgpa.toFixed(2)} CGPA</p>
                      </div>
                    </div>
                    <Badge className="color-accent border-0 px-4 py-2 text-sm font-semibold">
                      <Activity className="w-4 h-4 mr-2" />
                      Performance Analytics
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* CGPA Card */}
          <Card className="group relative overflow-hidden border-0 color-primary-light hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl color-primary-light group-hover:bg-academic-primary/20 transition-colors duration-300">
                  <TrendingUp className="h-6 w-6 text-academic-primary" />
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-academic-primary">
                    {summary?.cgpa?.toFixed(2) || 'N/A'}
                  </div>
                  <p className="text-sm font-medium text-academic-primary/80">Current CGPA</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-primary/70">Performance</span>
                  <span className="font-semibold text-academic-primary">
                    {summary?.cgpa ? Math.min((summary.cgpa / 10) * 100, 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={summary?.cgpa ? Math.min((summary.cgpa / 10) * 100, 100) : 0} 
                  className="h-2 bg-academic-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="group relative overflow-hidden border-0 color-secondary-light hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl color-secondary-light group-hover:bg-academic-secondary/20 transition-colors duration-300">
                  <Award className="h-6 w-6 text-academic-secondary" />
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-academic-secondary">
                    {summary?.total_credits || 0}
                  </div>
                  <p className="text-sm font-medium text-academic-secondary/80">Total Credits</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-secondary/70">Progress</span>
                  <span className="font-semibold text-academic-secondary">
                    {summary?.total_credits ? Math.min((summary.total_credits / 160) * 100, 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={summary?.total_credits ? Math.min((summary.total_credits / 160) * 100, 100) : 0} 
                  className="h-2 bg-academic-secondary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Backlogs Card */}
          <Card className="group relative overflow-hidden border-0 color-danger-light hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-danger/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl color-danger-light group-hover:bg-academic-danger/20 transition-colors duration-300">
                  <TrendingDown className="h-6 w-6 text-academic-danger" />
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-academic-danger">
                    {summary?.backlogs || 0}
                  </div>
                  <p className="text-sm font-medium text-academic-danger/80">Backlogs</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-danger/70">Status</span>
                  <span className="font-semibold text-academic-danger">
                    {summary?.backlogs === 0 ? 'Clear' : 'Pending'}
                  </span>
                </div>
                <Progress 
                  value={summary?.backlogs === 0 ? 100 : 0} 
                  className="h-2 bg-academic-danger/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="group relative overflow-hidden border-0 color-accent-light hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl color-accent-light group-hover:bg-academic-accent/40 transition-colors duration-300">
                  <Calendar className="h-6 w-6 text-academic-secondary" />
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-academic-secondary">
                    {attendanceAnalysis.length > 0 
                      ? Math.round(attendanceAnalysis.reduce((sum, att) => sum + att.percentage, 0) / attendanceAnalysis.length)
                      : 0}%
                  </div>
                  <p className="text-sm font-medium text-academic-secondary/80">Avg Attendance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-secondary/70">Attendance</span>
                  <span className="font-semibold text-academic-secondary">
                    {attendanceAnalysis.length > 0 
                      ? Math.round(attendanceAnalysis.reduce((sum, att) => sum + att.percentage, 0) / attendanceAnalysis.length)
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={attendanceAnalysis.length > 0 
                    ? Math.round(attendanceAnalysis.reduce((sum, att) => sum + att.percentage, 0) / attendanceAnalysis.length)
                    : 0} 
                  className="h-2 bg-academic-accent/30"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* CGPA Trend */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl color-primary-light">
                  <TrendingUp className="w-5 h-5 text-academic-primary" />
                </div>
                CGPA Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cgpaTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cgpaTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sgpa" 
                      stroke="hsl(var(--academic-primary))" 
                      strokeWidth={3} 
                      name="SGPA"
                      dot={{ fill: 'hsl(var(--academic-primary))', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cgpa" 
                      stroke="hsl(var(--academic-secondary))" 
                      strokeWidth={3} 
                      name="CGPA"
                      dot={{ fill: 'hsl(var(--academic-secondary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 rounded-2xl bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-muted-foreground">No data available for CGPA trend</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl color-accent-light">
                  <PieChartIcon className="w-5 h-5 text-academic-secondary" />
                </div>
                Grade Distribution
              </CardTitle>
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
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 rounded-2xl bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <PieChartIcon className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-muted-foreground">No grade data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Semester Performance */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl color-warning-light">
                  <BarChart3 className="w-5 h-5 text-academic-secondary" />
                </div>
                Semester Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {semesterPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={semesterPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="sgpa" 
                      fill="hsl(var(--academic-primary))" 
                      name="SGPA"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="attendance" 
                      fill="hsl(var(--academic-secondary))" 
                      name="Attendance %"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 rounded-2xl bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-muted-foreground">No semester data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl color-primary-light">
                  <Calendar className="w-5 h-5 text-academic-primary" />
                </div>
                Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceAnalysis.slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">{record.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{record.percentage}%</span>
                      <Badge className={getAttendanceStatus(record.percentage).color}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {attendanceAnalysis.length === 0 && (
                  <div className="text-center py-8">
                    <div className="p-4 rounded-2xl bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-muted-foreground">No attendance data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Recent Marks */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl color-accent-light">
                  <BookOpen className="w-5 h-5 text-academic-secondary" />
                </div>
                Recent Marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marks.slice(0, 5).map((mark, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{mark.subject_name}</p>
                      <p className="text-sm text-muted-foreground">{mark.exam_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{mark.obtained_marks}/{mark.total_marks}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((mark.obtained_marks / mark.total_marks) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
                {marks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="p-4 rounded-2xl bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-muted-foreground">No marks data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subject Grades */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl color-warning-light">
                  <Star className="w-5 h-5 text-academic-secondary" />
                </div>
                Subject Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subjects.filter(sub => sub.grade).slice(0, 5).map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.credits} credits</p>
                    </div>
                    <Badge className={getGradeColor(subject.grade)}>
                      {subject.grade}
                    </Badge>
                  </div>
                ))}
                {subjects.filter(sub => sub.grade).length === 0 && (
                  <div className="text-center py-8">
                    <div className="p-4 rounded-2xl bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Star className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-muted-foreground">No graded subjects available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

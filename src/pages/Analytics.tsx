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
  GraduationCap,
  Download
} from 'lucide-react';
import { useSemesters, useSubjects, useAttendance, useMarks, useAcademicSummary } from '@/hooks/useAcademic';
import { computeCGPA, getGradeColor, getAttendanceStatus } from '@/utils/gradeCalculations';
import { AdvancedPerformanceTrends } from '@/components/academic/AdvancedPerformanceTrends';
import { GradeDistributionHistogram } from '@/components/academic/GradeDistributionHistogram';
import { ExportButton } from '@/components/academic/ExportButton';

export default function Analytics() {
  const { data: semesters = [] } = useSemesters();
  const { data: subjects = [] } = useSubjects();
  const { data: attendance = [] } = useAttendance();
  const { data: marks = [] } = useMarks();
  const { data: summary } = useAcademicSummary();

  // CGPA Trend Data - Calculate CGPA from all subjects up to each semester
  const cgpaTrendData = semesters
    .filter(sem => sem.sgpa !== null)
    .map(semester => {
      const semestersUpToNow = semesters.slice(0, semesters.findIndex(s => s.id === semester.id) + 1);
      const semesterIds = semestersUpToNow.map(s => s.id);
      const subjectsUpToNow = subjects.filter(sub => semesterIds.includes(sub.semester_id));
      
      return {
        semester: `Sem ${semester.number}`,
        sgpa: semester.sgpa || 0,
        cgpa: computeCGPA(subjectsUpToNow)
      };
    })
    .sort((a, b) => parseInt(a.semester.split(' ')[1]) - parseInt(b.semester.split(' ')[1]));

  // Grade Distribution for Pie Chart
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

  // Attendance Analysis - Fixed calculation
  const attendanceAnalysis = attendance
    .filter(att => att.total_classes > 0) // Only include valid attendance records
    .map(record => {
      const percentage = Math.round((record.attended_classes / record.total_classes) * 100);
      return {
        subject: record.subject_name,
        percentage,
        status: getAttendanceStatus(percentage).status,
        attended: record.attended_classes,
        total: record.total_classes
      };
    })
    .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending

  // Calculate average attendance properly
  const avgAttendance = attendanceAnalysis.length > 0
    ? Math.round(attendanceAnalysis.reduce((sum, att) => sum + att.percentage, 0) / attendanceAnalysis.length)
    : 0;

  // Performance by Semester - Fixed to show meaningful data
  const semesterPerformance = semesters
    .filter(sem => sem.sgpa !== null)
    .map(semester => {
      const semesterSubjects = subjects.filter(sub => sub.semester_id === semester.id);
      const semesterAttendance = attendance.filter(att => att.semester_id === semester.id && att.total_classes > 0);
      
      const avgAttendance = semesterAttendance.length > 0 
        ? Math.round(semesterAttendance.reduce((sum, att) => {
            const pct = att.total_classes > 0 ? (att.attended_classes / att.total_classes) * 100 : 0;
            return sum + pct;
          }, 0) / semesterAttendance.length)
        : 0;

      return {
        semester: `Sem ${semester.number}`,
        sgpa: semester.sgpa || 0,
        subjects: semesterSubjects.length,
        credits: semester.total_credits || 0,
        attendance: avgAttendance
      };
    })
    .sort((a, b) => parseInt(a.semester.split(' ')[1]) - parseInt(b.semester.split(' ')[1]));

  // Marks Performance Analysis
  const marksWithPercentage = marks
    .filter(m => m.total_marks > 0)
    .map(mark => {
      const percentage = Math.round((mark.obtained_marks / mark.total_marks) * 100);
      return {
        ...mark,
        percentage
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  const avgMarksPercentage = marksWithPercentage.length > 0
    ? Math.round(marksWithPercentage.reduce((sum, m) => sum + m.percentage, 0) / marksWithPercentage.length)
    : 0;

  // Color scheme
  const COLORS = [
    'hsl(var(--academic-primary))', 
    'hsl(var(--academic-secondary))', 
    'hsl(var(--academic-accent))', 
    'hsl(var(--academic-warning))', 
    'hsl(var(--academic-danger))',
    '#8b5cf6',
    '#06b6d4'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl color-secondary p-4 sm:p-6 lg:p-8 xl:p-12 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white">
                      Analytics Dashboard
                    </h1>
                    <p className="text-white/80 text-xs sm:text-sm lg:text-base">
                      Comprehensive academic performance insights
                    </p>
                  </div>
                </div>
                
                {summary?.cgpa && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 rounded-xl bg-white/20">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-white/80">Current Performance</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{summary.cgpa.toFixed(2)} CGPA</p>
                      </div>
                    </div>
                    <Badge className="color-accent border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Performance Analytics
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <ExportButton />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* CGPA Card */}
          <Card className="group relative overflow-hidden border-0 color-primary-light hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl color-primary-light group-hover:bg-academic-primary/20 transition-colors duration-300">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-academic-primary" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-primary">
                    {summary?.cgpa?.toFixed(2) || 'N/A'}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-academic-primary/80">Current CGPA</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-academic-primary/70">Performance</span>
                  <span className="font-semibold text-academic-primary">
                    {summary?.cgpa ? Math.round(Math.min((summary.cgpa / 10) * 100, 100)) : 0}%
                  </span>
                </div>
                <Progress 
                  value={summary?.cgpa ? Math.round(Math.min((summary.cgpa / 10) * 100, 100)) : 0} 
                  className="h-1.5 sm:h-2 bg-academic-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="group relative overflow-hidden border-0 color-secondary-light hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl color-secondary-light group-hover:bg-academic-secondary/20 transition-colors duration-300">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-academic-secondary" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-secondary">
                    {summary?.total_credits || 0}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-academic-secondary/80">Total Credits</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-academic-secondary/70">Progress</span>
                  <span className="font-semibold text-academic-secondary">
                    {summary?.total_credits ? Math.min((summary.total_credits / 160) * 100, 100).toFixed(0) : 0}%
                  </span>
                </div>
                <Progress 
                  value={summary?.total_credits ? Math.min((summary.total_credits / 160) * 100, 100) : 0} 
                  className="h-1.5 sm:h-2 bg-academic-secondary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Backlogs Card */}
          <Card className="group relative overflow-hidden border-0 color-danger-light hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-danger/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl color-danger-light group-hover:bg-academic-danger/20 transition-colors duration-300">
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-academic-danger" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-danger">
                    {summary?.backlogs || 0}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-academic-danger/80">Backlogs</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-academic-danger/70">Status</span>
                  <span className="font-semibold text-academic-danger">
                    {summary?.backlogs === 0 ? 'Clear' : 'Pending'}
                  </span>
                </div>
                <Progress 
                  value={summary?.backlogs === 0 ? 100 : 0} 
                  className="h-1.5 sm:h-2 bg-academic-danger/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="group relative overflow-hidden border-0 color-accent-light hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-academic-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl color-accent-light group-hover:bg-academic-accent/40 transition-colors duration-300">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-academic-secondary" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-secondary">
                    {avgAttendance}%
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-academic-secondary/80">Avg Attendance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-academic-secondary/70">Attendance</span>
                  <span className="font-semibold text-academic-secondary">
                    {avgAttendance}%
                  </span>
                </div>
                <Progress 
                  value={avgAttendance} 
                  className="h-1.5 sm:h-2 bg-academic-accent/30"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Performance Trends - Full Width */}
        <AdvancedPerformanceTrends showPrediction={true} />

        {/* Main Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* CGPA & SGPA Trend */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="p-2 rounded-xl color-primary-light">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-academic-primary" />
                </div>
                CGPA & SGPA Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cgpaTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <LineChart data={cgpaTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis 
                      dataKey="semester" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      className="text-xs sm:text-sm"
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="sgpa" 
                      stroke="hsl(var(--academic-primary))" 
                      strokeWidth={2}
                      name="SGPA"
                      dot={{ fill: 'hsl(var(--academic-primary))', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cgpa" 
                      stroke="hsl(var(--academic-secondary))" 
                      strokeWidth={2}
                      name="CGPA"
                      dot={{ fill: 'hsl(var(--academic-secondary))', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">No data available for CGPA trend</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grade Distribution Histogram */}
          <GradeDistributionHistogram />
        </div>

        {/* Secondary Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Semester Performance - SGPA Only */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="p-2 rounded-xl color-warning-light">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-academic-secondary" />
                </div>
                Semester Performance (SGPA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {semesterPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <BarChart data={semesterPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis 
                      dataKey="semester" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar 
                      dataKey="sgpa" 
                      fill="hsl(var(--academic-primary))" 
                      name="SGPA"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">No semester data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grade Distribution Pie Chart */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="p-2 rounded-xl color-accent-light">
                  <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-academic-secondary" />
                </div>
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gradeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <PieChart>
                    <Pie
                      data={gradeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, percentage }) => `${grade} (${percentage}%)`}
                      outerRadius={70}
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
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <PieChartIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">No grade data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Tables Section - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Attendance Overview */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="p-2 rounded-xl color-primary-light">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-academic-primary" />
                </div>
                Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {attendanceAnalysis.slice(0, 6).map((record, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-xs sm:text-sm font-medium truncate">{record.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold">{record.percentage}%</span>
                      <Badge className={getAttendanceStatus(record.percentage).color} variant="outline">
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {attendanceAnalysis.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">No attendance data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Marks */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="p-2 rounded-xl color-accent-light">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-academic-secondary" />
                </div>
                Recent Marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {marksWithPercentage.slice(0, 6).map((mark, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 sm:p-4 bg-muted/30 rounded-lg sm:rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm text-foreground truncate">{mark.subject_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{mark.exam_type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm sm:text-lg">{mark.obtained_marks}/{mark.total_marks}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {mark.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
                {marksWithPercentage.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">No marks data available</p>
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

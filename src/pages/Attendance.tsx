
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, TrendingUp, UserX } from 'lucide-react';
import { useAttendance, useSemesters } from '@/hooks/useAcademic';
import { ActiveAttendanceCard } from '@/components/academic/ActiveAttendanceCard';

export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');

  const { data: attendance = [], isLoading } = useAttendance();
  const { data: semesters = [] } = useSemesters();

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || record.semester_id === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  // Calculate stats
  const totalRecords = attendance.length;
  const averageAttendance = attendance.length > 0 
    ? Math.round(attendance.reduce((sum, record) => 
        sum + (record.total_classes > 0 ? (record.attended_classes / record.total_classes * 100) : 0), 0
      ) / attendance.length)
    : 0;
  const criticalSubjects = attendance.filter(record => 
    record.total_classes > 0 && (record.attended_classes / record.total_classes * 100) < 75
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold">Attendance Tracker</h1>
        <p className="text-muted-foreground mt-1">Mark attendance and track your progress</p>
      </div>

      {/* Stats Cards - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
                <p className="text-xl sm:text-2xl font-bold">{totalRecords}</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                <p className="text-xl sm:text-2xl font-bold">{averageAttendance}%</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Subjects</p>
                <p className="text-xl sm:text-2xl font-bold">{criticalSubjects}</p>
              </div>
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Mobile Optimized */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    Semester {semester.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Attendance Tracking */}
      <ActiveAttendanceCard records={filteredAttendance} />
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Award,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAcademicSummary } from '@/hooks/useAcademicSummary';
import { DashboardStats } from '@/components/academic/DashboardStats';
import { QuickActions } from '@/components/academic/QuickActions';
import { PerformanceTrends } from '@/components/academic/PerformanceTrends';
import { Link } from 'react-router-dom';

export default function Index() {
  const { data: summary, isLoading } = useAcademicSummary();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Academic Dashboard</h1>
          <p className="text-muted-foreground">
            Track your academic progress and manage your studies effectively
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/semesters">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Quick Start
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Semesters
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {summary?.total_semesters || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Academic periods
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subjects
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {summary?.total_subjects || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Courses enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall CGPA
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {summary?.cgpa || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Cumulative grade point
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Credits
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-100">
              <Award className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {summary?.total_credits || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Credit hours earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/semesters" className="block">
                <Button variant="outline" className="w-full justify-between h-12">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Manage Semesters</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/attendance" className="block">
                <Button variant="outline" className="w-full justify-between h-12">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    <span>Track Attendance</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/marks" className="block">
                <Button variant="outline" className="w-full justify-between h-12">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>Manage Marks</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/analytics" className="block">
                <Button variant="outline" className="w-full justify-between h-12">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>View Analytics</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary?.total_semesters > 0 ? (
                <PerformanceTrends />
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Start by adding your first semester and subjects to see your performance trends.
                  </p>
                  <Link to="/semesters">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      {summary?.total_semesters > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Activity tracking coming soon...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

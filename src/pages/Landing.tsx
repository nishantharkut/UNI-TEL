import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Clock, 
  Target, 
  Shield, 
  Smartphone,
  Users,
  Award,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Mail,
  Phone,
  Play,
  Download,
  Zap,
  Heart,
  Eye,
  Brain,
  Rocket,
  Sparkles,
  Quote,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  X,
  Plus,
  Minus,
  User
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<{ full_name?: string; email?: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Load user profile if logged in
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setUserProfile({
              full_name: data.full_name || user.user_metadata?.full_name || 'User',
              email: data.email || user.email
            });
          } else {
            setUserProfile({
              full_name: user.user_metadata?.full_name || 'User',
              email: user.email
            });
          }
        } catch (error) {
          setUserProfile({
            full_name: user.user_metadata?.full_name || 'User',
            email: user.email
          });
        }
      }
    };
    
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Advanced intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          
          // Stagger animations for child elements
          const children = entry.target.querySelectorAll('.animate-stagger');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-slide-up');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Parallax scroll effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const floatingElements = document.querySelectorAll('.floating');
      floatingElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '0.1');
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;
        (element as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    // Observe all sections
    const sections = document.querySelectorAll('.landing-section');
    sections.forEach((section) => observer.observe(section));

    // Add scroll and mouse event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="academic-container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 hover-scale">
              <img 
                src="/logo.png" 
                alt="UNI-TEL Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain hover-rotate"
              />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground gradient-text">UNI-TEL</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {user && (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {authLoading ? (
                <div className="w-8 h-8 border-2 border-academic-primary/20 border-t-academic-primary rounded-full animate-spin" />
              ) : user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted/50">
                    <div className="h-6 w-6 rounded-full bg-academic-primary/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-academic-primary">
                        {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground max-w-[100px] truncate">
                      {userProfile?.full_name || 'User'}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="academic-button primary sm hover-scale magnetic text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    <span className="hidden sm:inline">Go to Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="academic-button secondary sm hover-lift text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="academic-button secondary sm hover-lift text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="academic-button primary sm hover-scale magnetic text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-academic-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-academic-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-academic-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        </div>

        {/* Hero Section - Completely Redesigned */}
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-academic-primary/5" />
          <div className="academic-container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-8 lg:space-y-10 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-academic-primary/10 to-academic-secondary/10 border border-academic-primary/20 backdrop-blur-sm animate-fade-in">
                  <Sparkles className="h-4 w-4 text-academic-primary animate-pulse" />
                  <span className="text-sm font-semibold text-academic-primary">Trusted by 10,000+ students worldwide</span>
                </div>
                
                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                    <span className="block text-foreground">Transform Your</span>
                    <span className="block bg-gradient-to-r from-academic-primary via-academic-secondary to-academic-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      Academic Journey
                    </span>
                    <span className="block text-foreground">with Smart Analytics</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    The all-in-one platform that helps students track grades, monitor attendance, and achieve academic excellence. 
                    <span className="block mt-2 font-semibold text-foreground">Join thousands of students already succeeding.</span>
                  </p>
                </div>
                
                {/* Key Benefits Pills */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {[
                    { icon: CheckCircle, text: 'Free Forever', bgClass: 'bg-academic-success/10', borderClass: 'border-academic-success/20', iconClass: 'text-academic-success' },
                    { icon: Shield, text: 'No Credit Card', bgClass: 'bg-academic-primary/10', borderClass: 'border-academic-primary/20', iconClass: 'text-academic-primary' },
                    { icon: Zap, text: '5-Min Setup', bgClass: 'bg-academic-warning/10', borderClass: 'border-academic-warning/20', iconClass: 'text-academic-warning' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full ${item.bgClass} border ${item.borderClass} backdrop-blur-sm hover:scale-105 transition-transform`}
                    >
                      <item.icon className={`h-4 w-4 ${item.iconClass}`} />
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => navigate('/auth')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-academic-primary to-academic-secondary text-white font-semibold rounded-xl shadow-2xl hover:shadow-academic-primary/50 transition-all hover:scale-105 flex items-center justify-center space-x-2 overflow-hidden"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-academic-secondary to-academic-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('demo')}
                    className="px-8 py-4 bg-background/80 backdrop-blur-sm border-2 border-border text-foreground font-semibold rounded-xl hover:bg-muted/50 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Watch Demo</span>
                  </button>
                </div>

                {/* Trust Indicators - Enhanced */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t border-border/50 justify-center lg:justify-start">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className="h-10 w-10 rounded-full bg-gradient-to-br from-academic-primary/40 to-academic-secondary/40 border-2 border-background shadow-lg" 
                          style={{ animationDelay: `${i * 0.1}s` }} 
                        />
                      ))}
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">10,000+</div>
                      <div className="text-xs text-muted-foreground">Active Students</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-5 w-5 fill-academic-warning text-academic-warning" />
                      ))}
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">4.9/5</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-academic-success" />
                    <div>
                      <div className="text-base font-bold text-foreground">95%</div>
                      <div className="text-xs text-muted-foreground">See Improvement</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Visual - Enhanced */}
              <div className="relative lg:min-h-[600px] flex items-center justify-center">
                {/* Floating Background Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-96 h-96 bg-academic-primary/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute w-80 h-80 bg-academic-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Main Dashboard Preview */}
                <div className="relative w-full max-w-lg floating" data-speed="0.15">
                  <div className="relative rounded-3xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border-2 border-border/50 shadow-2xl p-6 lg:p-8 hover:shadow-academic-primary/20 transition-all hover:scale-[1.02]">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-academic-primary to-academic-secondary flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Academic Dashboard</div>
                          <div className="text-xs text-muted-foreground">Current Semester</div>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-academic-success animate-pulse" />
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-academic-primary/10 to-academic-primary/5 border border-academic-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">CGPA</span>
                          <TrendingUp className="h-4 w-4 text-academic-success" />
                        </div>
                        <div className="text-3xl font-bold text-academic-primary">3.85</div>
                        <div className="text-xs text-academic-success font-medium">+0.15 ↑</div>
                      </div>
                      <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-academic-warning/10 to-academic-warning/5 border border-academic-warning/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Attendance</span>
                          <CheckCircle className="h-4 w-4 text-academic-success" />
                        </div>
                        <div className="text-3xl font-bold text-academic-warning">92%</div>
                        <div className="text-xs text-muted-foreground">Above required</div>
                      </div>
                      <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-academic-success/10 to-academic-success/5 border border-academic-success/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Subjects</span>
                          <BookOpen className="h-4 w-4 text-academic-success" />
                        </div>
                        <div className="text-3xl font-bold text-academic-success">6</div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                      <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-academic-danger/10 to-academic-danger/5 border border-academic-danger/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Goals</span>
                          <Target className="h-4 w-4 text-academic-danger" />
                        </div>
                        <div className="text-3xl font-bold text-academic-danger">3</div>
                        <div className="text-xs text-muted-foreground">In progress</div>
                      </div>
                    </div>
                    
                    {/* Progress Chart Preview */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-foreground">Performance Trend</span>
                        <span className="text-xs text-muted-foreground">Last 6 months</span>
                      </div>
                      <div className="flex items-end justify-between h-20 space-x-2">
                        {[65, 72, 68, 80, 75, 85].map((height, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full rounded-t bg-gradient-to-t from-academic-primary to-academic-secondary opacity-80 hover:opacity-100 transition-opacity"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-muted-foreground mt-1">{['J', 'F', 'M', 'A', 'M', 'J'][idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 animate-bounce-slow">
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-background shadow-xl border border-border backdrop-blur-sm">
                      <div className="h-2 w-2 rounded-full bg-academic-success animate-pulse" />
                      <span className="text-xs font-semibold text-foreground">Live Demo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo/Video Section - Enhanced */}
        <section id="demo" className="relative py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
          <div className="academic-container relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-6 mb-12">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-academic-primary/10 border border-academic-primary/20 mb-4">
                  <Play className="h-4 w-4 text-academic-primary" />
                  <span className="text-sm font-semibold text-academic-primary">Product Demo</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                  See UNI-TEL in{' '}
                  <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">Action</span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Watch how students use UNI-TEL to track their progress and achieve better grades in just 2 minutes.
                </p>
              </div>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-academic-primary/20 via-academic-secondary/10 to-academic-primary/20 border-2 border-border/50 shadow-2xl hover:shadow-academic-primary/20 transition-all group">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-academic-primary/10 to-academic-secondary/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="group/play flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-academic-primary to-academic-secondary text-white hover:from-academic-primary/90 hover:to-academic-secondary/90 transition-all hover:scale-110 shadow-2xl hover:shadow-academic-primary/50">
                      <Play className="h-10 w-10 ml-1 group-hover/play:scale-110 transition-transform" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-medium text-white">HD Quality</span>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-medium text-white">2:30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced with Alternating Layout */}
        <section id="features" className="relative py-20 sm:py-24 lg:py-32">
          <div className="academic-container">
            <div className="text-center space-y-6 mb-16 lg:mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-academic-primary/10 border border-academic-primary/20 mb-4">
                <Sparkles className="h-4 w-4 text-academic-primary" />
                <span className="text-sm font-semibold text-academic-primary">Powerful Features</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                Everything You Need for{' '}
                <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">Academic Success</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools designed specifically for students to track, analyze, and improve their academic performance.
              </p>
            </div>

            {/* Feature 1 - Alternating Layout */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center mb-20 lg:mb-28">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-academic-primary/10 border border-academic-primary/20 w-fit">
                  <BarChart3 className="h-4 w-4 text-academic-primary" />
                  <span className="text-xs font-semibold text-academic-primary">Feature 01</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                    Grade Tracking{' '}
                    <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">Made Simple</span>
                  </h3>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    Monitor your marks across all subjects, calculate CGPA automatically, and track semester performance with beautiful visualizations.
                  </p>
                </div>
                <ul className="space-y-3">
                  {['Real-time CGPA calculation', 'Subject-wise performance tracking', 'Semester comparison charts', 'Grade prediction insights'].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-academic-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-academic-success" />
                      </div>
                      <span className="text-base text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 relative floating" data-speed="0.1">
                <div className="relative rounded-3xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border-2 border-border/50 shadow-2xl p-6 lg:p-8 hover:shadow-academic-primary/20 transition-all hover:scale-[1.02]">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-academic-primary/5 to-academic-secondary/5 rounded-3xl -z-10" />
                  
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-academic-primary/10 to-academic-primary/5 border border-academic-primary/20">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Semester 1</span>
                        <span className="text-2xl font-bold text-academic-primary">3.85 CGPA</span>
                      </div>
                      <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-academic-primary to-academic-secondary rounded-full transition-all" style={{ width: '77%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {['Math', 'Physics', 'Chemistry', 'English'].map((subject, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                          <div className="text-xs font-medium text-muted-foreground mb-2">{subject}</div>
                          <div className="text-2xl font-bold text-foreground">{85 + idx * 2}%</div>
                          <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-academic-primary rounded-full" style={{ width: `${85 + idx * 2}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Alternating Layout */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center mb-20 lg:mb-28">
              <div className="relative floating" data-speed="0.1">
                <div className="relative rounded-3xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border-2 border-border/50 shadow-2xl p-6 lg:p-8 hover:shadow-academic-warning/20 transition-all hover:scale-[1.02]">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-academic-warning/5 to-academic-danger/5 rounded-3xl -z-10" />
                  
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-academic-warning/10 to-academic-warning/5 border border-academic-warning/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Attendance Status</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-academic-warning">92%</span>
                          <CheckCircle className="h-5 w-5 text-academic-success" />
                        </div>
                      </div>
                      {['Math', 'Physics', 'Chemistry', 'English'].map((subject, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-foreground">{subject}</span>
                            <span className={`font-semibold ${idx === 2 ? 'text-academic-danger' : 'text-academic-success'}`}>
                              {85 + idx * 3}%
                            </span>
                          </div>
                          <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${idx === 2 ? 'from-academic-danger to-academic-danger/80' : 'from-academic-success to-academic-success/80'}`} 
                              style={{ width: `${85 + idx * 3}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-academic-warning/10 border border-academic-warning/20 w-fit">
                  <Clock className="h-4 w-4 text-academic-warning" />
                  <span className="text-xs font-semibold text-academic-warning">Feature 02</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                    Never Miss a{' '}
                    <span className="bg-gradient-to-r from-academic-warning to-academic-danger bg-clip-text text-transparent">Class</span>
                  </h3>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    Keep track of your attendance across all subjects with smart warnings and automatic calculations.
                  </p>
                </div>
                <ul className="space-y-3">
                  {['Automatic attendance tracking', 'Low attendance warnings', 'Required percentage monitoring', 'Subject-wise breakdown'].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-academic-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-academic-success" />
                      </div>
                      <span className="text-base text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Other Features Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { icon: TrendingUp, title: 'Performance Analytics', desc: 'Get detailed insights into your academic performance with visual charts, trend analysis, and personalized recommendations.', bgColor: 'bg-academic-success/10', borderColor: 'border-academic-success/20', iconColor: 'text-academic-success' },
                { icon: BookOpen, title: 'Semester Management', desc: 'Organize your academic data by semesters, compare performance across terms, and plan your academic goals effectively.', bgColor: 'bg-academic-secondary/10', borderColor: 'border-academic-secondary/20', iconColor: 'text-academic-secondary' },
                { icon: Target, title: 'Goal Tracking', desc: 'Set academic goals, track your progress towards target CGPA, and receive motivational insights to stay on track.', bgColor: 'bg-academic-danger/10', borderColor: 'border-academic-danger/20', iconColor: 'text-academic-danger' },
                { icon: Shield, title: 'Smart Notifications', desc: 'Stay informed with intelligent notifications about low attendance, upcoming exams, and important academic deadlines.', bgColor: 'bg-academic-accent/10', borderColor: 'border-academic-accent/20', iconColor: 'text-academic-accent' }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-academic-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-academic-primary/10 space-y-4"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} border ${feature.borderColor} group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced */}
        <section className="relative py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="academic-container relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {[
                { value: '10,000+', label: 'Active Students', icon: Users, bgClass: 'bg-academic-primary/10', borderClass: 'border-academic-primary/20', iconClass: 'text-academic-primary', valueClass: 'text-academic-primary' },
                { value: '95%', label: 'Improved Performance', icon: TrendingUp, bgClass: 'bg-academic-success/10', borderClass: 'border-academic-success/20', iconClass: 'text-academic-success', valueClass: 'text-academic-success' },
                { value: '500+', label: 'Universities', icon: Globe, bgClass: 'bg-academic-secondary/10', borderClass: 'border-academic-secondary/20', iconClass: 'text-academic-secondary', valueClass: 'text-academic-secondary' },
                { value: '4.9/5', label: 'Student Rating', icon: Star, bgClass: 'bg-academic-warning/10', borderClass: 'border-academic-warning/20', iconClass: 'text-academic-warning', valueClass: 'text-academic-warning' }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="group text-center p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-academic-primary/30 transition-all hover:scale-105 hover:shadow-xl space-y-3"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgClass} border ${stat.borderClass} mb-2 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
                  </div>
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.valueClass}`}>{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Enhanced */}
        <section className="relative py-20 sm:py-24 lg:py-32">
          <div className="academic-container">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-academic-primary/10 border border-academic-primary/20 mb-4">
                <Quote className="h-4 w-4 text-academic-primary" />
                <span className="text-sm font-semibold text-academic-primary">Testimonials</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                What Students Are{' '}
                <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">Saying</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Don't just take our word for it. Here's what real students have to say about their experience with UNI-TEL.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { 
                  name: 'Sarah Mitchell', 
                  role: 'Computer Science, MIT', 
                  initials: 'SM', 
                  quote: 'UNI-TEL completely transformed how I track my academic progress. My CGPA improved by 0.3 points in just one semester!',
                  color: 'academic-primary',
                  bgColor: 'bg-academic-primary/10',
                  textColor: 'text-academic-primary'
                },
                { 
                  name: 'Alex Johnson', 
                  role: 'Business Administration, Stanford', 
                  initials: 'AJ', 
                  quote: 'The attendance tracking feature saved me from missing important classes. The notifications are a game-changer!',
                  color: 'academic-warning',
                  bgColor: 'bg-academic-warning/10',
                  textColor: 'text-academic-warning'
                },
                { 
                  name: 'Maria Rodriguez', 
                  role: 'Engineering, UC Berkeley', 
                  initials: 'MR', 
                  quote: 'The analytics helped me identify my weak subjects early. I was able to focus my study time more effectively.',
                  color: 'academic-success',
                  bgColor: 'bg-academic-success/10',
                  textColor: 'text-academic-success'
                }
              ].map((testimonial, idx) => (
                <div 
                  key={idx} 
                  className="group relative p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-academic-primary/30 transition-all hover:scale-105 hover:shadow-xl space-y-5"
                >
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-academic-warning text-academic-warning" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-academic-primary/10" />
                  <p className="text-base text-foreground leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
                    <div className={`h-12 w-12 rounded-full ${testimonial.bgColor} border ${testimonial.color === 'academic-primary' ? 'border-academic-primary/20' : testimonial.color === 'academic-warning' ? 'border-academic-warning/20' : 'border-academic-success/20'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className={`text-sm font-bold ${testimonial.textColor}`}>{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Enhanced */}
        <section className="relative py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
          <div className="academic-container relative z-10">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-academic-primary/10 border border-academic-primary/20 mb-4">
                <Rocket className="h-4 w-4 text-academic-primary" />
                <span className="text-sm font-semibold text-academic-primary">Getting Started</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                How It{' '}
                <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Get started with UNI-TEL in just a few simple steps and transform your academic journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-academic-primary/20 via-academic-secondary/20 to-academic-primary/20" />
              
              {[
                { 
                  step: '1', 
                  title: 'Sign Up & Setup', 
                  desc: 'Create your account and set up your academic profile. Import your existing data or start fresh.',
                  color: 'academic-primary',
                  icon: User
                },
                { 
                  step: '2', 
                  title: 'Track & Monitor', 
                  desc: 'Add your subjects, track grades, and monitor attendance. Set goals and get personalized insights.',
                  color: 'academic-warning',
                  icon: BarChart3
                },
                { 
                  step: '3', 
                  title: 'Achieve Success', 
                  desc: 'Watch your academic performance improve with data-driven insights and smart recommendations.',
                  color: 'academic-success',
                  icon: Award
                }
              ].map((step, idx) => {
                const colorClasses = {
                  'academic-primary': { bg: 'bg-academic-primary/20', from: 'from-academic-primary/20', to: 'to-academic-primary/10', border: 'border-academic-primary/30', icon: 'text-academic-primary', badge: 'bg-academic-primary' },
                  'academic-warning': { bg: 'bg-academic-warning/20', from: 'from-academic-warning/20', to: 'to-academic-warning/10', border: 'border-academic-warning/30', icon: 'text-academic-warning', badge: 'bg-academic-warning' },
                  'academic-success': { bg: 'bg-academic-success/20', from: 'from-academic-success/20', to: 'to-academic-success/10', border: 'border-academic-success/30', icon: 'text-academic-success', badge: 'bg-academic-success' }
                };
                const classes = colorClasses[step.color as keyof typeof colorClasses];
                return (
                <div key={idx} className="relative text-center space-y-6 group">
                  <div className="relative inline-flex">
                    <div className={`absolute inset-0 ${classes.bg} rounded-full blur-xl group-hover:blur-2xl transition-all`} />
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${classes.from} ${classes.to} border-2 ${classes.border} mx-auto group-hover:scale-110 transition-transform`}>
                      <step.icon className={`h-10 w-10 ${classes.icon}`} />
                    </div>
                    <div className={`absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full ${classes.badge} text-white font-bold text-sm shadow-lg`}>
                      {step.step}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section - Enhanced */}
        <section className="relative py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="academic-container relative z-10">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-academic-primary/10 border border-academic-primary/20 mb-4">
                <HelpCircle className="h-4 w-4 text-academic-primary" />
                <span className="text-sm font-semibold text-academic-primary">FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                Frequently Asked{' '}
                <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to know about UNI-TEL. Can't find the answer? Contact our support team.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {[
                {
                  q: 'Is UNI-TEL really free?',
                  a: 'Yes! UNI-TEL offers a free forever plan with all core features. You can track grades, monitor attendance, and analyze performance without any cost. No credit card required.'
                },
                {
                  q: 'How long does it take to set up?',
                  a: 'Setting up UNI-TEL takes less than 5 minutes. Simply create an account, add your subjects, and start tracking. You can import existing data or start fresh.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'Absolutely. We use industry-standard encryption to protect your data. Your academic information is private and secure. We never share your data with third parties.'
                },
                {
                  q: 'Can I use UNI-TEL on mobile?',
                  a: 'Yes! UNI-TEL is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. Access your academic data anywhere, anytime.'
                },
                {
                  q: 'What if I need help?',
                  a: 'We offer comprehensive help documentation and email support. Our team typically responds within 24 hours. Premium users get priority support.'
                },
                {
                  q: 'Can I export my data?',
                  a: 'Yes, you can export all your data at any time in various formats (CSV, PDF). Your data belongs to you, and you have full control over it.'
                }
              ].map((faq, idx) => (
                <div 
                  key={idx} 
                  className="group relative rounded-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-academic-primary/30 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 lg:p-8 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-bold text-lg lg:text-xl pr-4 text-foreground">{faq.q}</span>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all ${openFaq === idx ? 'bg-academic-primary/10 text-academic-primary rotate-180' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}`}>
                      {openFaq === idx ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8 text-muted-foreground text-base lg:text-lg leading-relaxed border-t border-border/50 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-academic-primary via-academic-secondary to-academic-primary bg-[length:200%_auto] animate-gradient" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          </div>
          
          <div className="academic-container text-center space-y-10 relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Rocket className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">Join 10,000+ students already succeeding</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Start Your Free Trial{' '}
                <span className="block">Today</span>
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                No credit card required. Set up in 5 minutes. See results in your first semester.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/auth')}
                className="group relative px-10 py-5 bg-white text-academic-primary font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 flex items-center justify-center space-x-3 overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-academic-primary/10 to-academic-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Play className="h-6 w-6" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Additional CTA Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/20">
              {[
                { icon: Zap, title: 'Quick Setup', desc: 'Get started in under 5 minutes' },
                { icon: Shield, title: 'Secure & Private', desc: 'Your data is always protected' },
                { icon: Heart, title: 'Student-First', desc: 'Built by students, for students' }
              ].map((feature, idx) => (
                <div key={idx} className="text-center space-y-3 group">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mx-auto group-hover:bg-white/20 group-hover:scale-110 transition-all">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-white">{feature.title}</h4>
                  <p className="text-sm text-white/80">{feature.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Trust Badge */}
            <div className="mt-12 pt-10 border-t border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-6 text-base text-white/90">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Free forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">No credit card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>



      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
        <div className="academic-container">
          <div className="py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/logo.png" 
                    alt="UNI-TEL Logo" 
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-xl font-bold">UNI-TEL</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Empowering students worldwide with smart academic management tools.
                </p>
        </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Product</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Get Started
                  </button>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Support</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
        </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Connect</h4>
                <div className="flex space-x-4">
                  <a href="https://twitter.com/unitel" className="text-muted-foreground hover:text-foreground transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com/company/unitel" className="text-muted-foreground hover:text-foreground transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://github.com/unitel" className="text-muted-foreground hover:text-foreground transition-colors">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/40">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-muted-foreground">
                  © 2024 UNI-TEL. All rights reserved. Empowering students worldwide.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
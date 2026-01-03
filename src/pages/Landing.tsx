import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Minus
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
              <nav className="hidden md:flex items-center space-x-8">
              </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="landing-section academic-section bg-gradient-to-br from-background via-background to-academic-primary/5 particles-bg">
          <div className="academic-container">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-primary/10 border border-academic-primary/20 animate-fade-in">
                    <Sparkles className="h-3 w-3 text-academic-primary" />
                    <span className="text-xs sm:text-sm font-medium text-academic-primary">Trusted by 10,000+ students</span>
                  </div>
                  
                  <h1 className="academic-heading display text-balance text-reveal text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                    Take Control of Your{' '}
                    <span className="gradient-text">Academic Success</span>
                  </h1>
                  <p className="academic-subheading text-balance max-w-2xl animate-fade-in stagger-1 text-base sm:text-lg lg:text-xl">
                    The all-in-one platform that helps students track grades, monitor attendance, and improve performance. 
                    <strong className="text-foreground"> Join thousands achieving better results.</strong>
                  </p>
                  
                  {/* Key Benefits */}
                  <div className="flex flex-wrap gap-3 pt-2 animate-fade-in stagger-1">
                    {[
                      { icon: CheckCircle, text: 'Free Forever' },
                      { icon: CheckCircle, text: 'No Credit Card' },
                      { icon: CheckCircle, text: '5-Min Setup' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <item.icon className="h-4 w-4 text-academic-success" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in stagger-2">
                  <button 
                    onClick={() => navigate('/auth')}
                    className="academic-button primary lg button-glow hover-scale magnetic w-full sm:w-auto group"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('demo')}
                    className="academic-button secondary lg hover-lift w-full sm:w-auto flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Demo
                  </button>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-4 animate-fade-in stagger-3 border-t border-border/40">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-8 w-8 rounded-full bg-gradient-to-br from-academic-primary/30 to-academic-secondary/30 border-2 border-background animate-float-slow`} style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">10,000+</div>
                      <div className="text-xs text-muted-foreground">Active Students</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-4 w-4 fill-academic-warning text-academic-warning`} />
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">4.9/5</div>
                      <div className="text-xs text-muted-foreground">Average Rating</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-academic-success" />
                    <div>
                      <div className="text-sm font-semibold">95%</div>
                      <div className="text-xs text-muted-foreground">See Improvement</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative floating" data-speed="0.1">
                <div className="relative rounded-2xl bg-gradient-to-br from-academic-primary/10 to-academic-secondary/10 p-4 sm:p-6 lg:p-8 hover-lift">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="academic-card space-y-2 sm:space-y-3 hover-scale animate-slide-left stagger-1">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-academic-success animate-pulse-glow" />
                        <span className="text-xs sm:text-sm font-medium">Current CGPA</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-academic-primary">3.85</div>
                      <div className="text-xs text-muted-foreground">+0.15 this semester</div>
                    </div>
                    <div className="academic-card space-y-2 sm:space-y-3 hover-scale animate-slide-right stagger-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-academic-warning animate-pulse-glow" />
                        <span className="text-xs sm:text-sm font-medium">Attendance</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-academic-warning">92%</div>
                      <div className="text-xs text-muted-foreground">Above 85% required</div>
                    </div>
                    <div className="academic-card space-y-2 sm:space-y-3 hover-scale animate-slide-left stagger-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-academic-primary animate-pulse-glow" />
                        <span className="text-xs sm:text-sm font-medium">Subjects</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-academic-primary">6</div>
                      <div className="text-xs text-muted-foreground">Active this semester</div>
                    </div>
                    <div className="academic-card space-y-2 sm:space-y-3 hover-scale animate-slide-right stagger-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-academic-danger animate-pulse-glow" />
                        <span className="text-xs sm:text-sm font-medium">Goals</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-academic-danger">3</div>
                      <div className="text-xs text-muted-foreground">Targets set</div>
                    </div>
                  </div>
                  
                  {/* Demo Video Button */}
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 animate-bounce-in">
                    <button className="flex items-center space-x-1 sm:space-x-2 academic-button primary sm bg-white text-academic-primary hover:bg-white/90 shadow-lg hover-rotate text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Watch Demo</span>
                      <span className="sm:hidden">Demo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo/Video Section */}
        <section id="demo" className="landing-section academic-section bg-muted/30">
          <div className="academic-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-8">
                <h2 className="academic-heading h2 text-2xl sm:text-3xl lg:text-4xl">See UNI-TEL in Action</h2>
                <p className="academic-subheading max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                  Watch how students use UNI-TEL to track their progress and achieve better grades in just 2 minutes.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-academic-primary/10 to-academic-secondary/10 aspect-video hover-lift">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex items-center justify-center w-20 h-20 rounded-full bg-academic-primary text-white hover:bg-academic-primary/90 transition-all hover:scale-110 shadow-lg">
                    <Play className="h-8 w-8 ml-1" />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced with Alternating Layout */}
        <section id="features" className="landing-section academic-section">
          <div className="academic-container">
            <div className="text-center space-y-4 mb-12 lg:mb-16">
              <h2 className="academic-heading h2 text-2xl sm:text-3xl lg:text-4xl">Everything You Need for Academic Success</h2>
              <p className="academic-subheading max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Comprehensive tools designed specifically for students to track, analyze, and improve their academic performance.
              </p>
            </div>

            {/* Feature 1 - Alternating Layout */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
              <div className="order-2 lg:order-1">
                <div className="academic-card p-6 lg:p-8 hover-lift">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-academic-primary/10">
                      <BarChart3 className="h-7 w-7 text-academic-primary" />
                    </div>
                    <h3 className="academic-heading h3 text-xl lg:text-2xl">Grade Tracking Made Simple</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 text-base lg:text-lg">
                    Monitor your marks across all subjects, calculate CGPA automatically, and track semester performance with beautiful visualizations.
                  </p>
                  <ul className="space-y-2">
                    {['Real-time CGPA calculation', 'Subject-wise performance tracking', 'Semester comparison charts', 'Grade prediction insights'].map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-academic-success flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative floating" data-speed="0.1">
                <div className="relative rounded-2xl bg-gradient-to-br from-academic-primary/10 to-academic-secondary/10 p-6 lg:p-8 hover-lift">
                  <div className="space-y-4">
                    <div className="academic-card p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Semester 1</span>
                        <span className="text-lg font-bold text-academic-primary">3.85 CGPA</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-academic-primary rounded-full" style={{ width: '77%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Math', 'Physics', 'Chemistry', 'English'].map((subject, idx) => (
                        <div key={idx} className="academic-card p-3">
                          <div className="text-xs text-muted-foreground mb-1">{subject}</div>
                          <div className="text-lg font-bold">{85 + idx * 2}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Alternating Layout */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
              <div className="relative floating" data-speed="0.1">
                <div className="relative rounded-2xl bg-gradient-to-br from-academic-warning/10 to-academic-danger/10 p-6 lg:p-8 hover-lift">
                  <div className="space-y-4">
                    <div className="academic-card p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Attendance Status</span>
                        <span className="text-sm font-bold text-academic-warning">92%</span>
                      </div>
                      {['Math', 'Physics', 'Chemistry', 'English'].map((subject, idx) => (
                        <div key={idx} className="mb-3 last:mb-0">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{subject}</span>
                            <span className={idx === 2 ? 'text-academic-danger' : 'text-academic-success'}>
                              {85 + idx * 3}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${idx === 2 ? 'bg-academic-danger' : 'bg-academic-success'}`} 
                              style={{ width: `${85 + idx * 3}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="academic-card p-6 lg:p-8 hover-lift">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-academic-warning/10">
                      <Clock className="h-7 w-7 text-academic-warning" />
                    </div>
                    <h3 className="academic-heading h3 text-xl lg:text-2xl">Never Miss a Class</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 text-base lg:text-lg">
                    Keep track of your attendance across all subjects with smart warnings and automatic calculations.
                  </p>
                  <ul className="space-y-2">
                    {['Automatic attendance tracking', 'Low attendance warnings', 'Required percentage monitoring', 'Subject-wise breakdown'].map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-academic-success flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Other Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="academic-card card-hover space-y-4 hover-lift animate-stagger stagger-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-academic-success/10 hover-rotate">
                    <TrendingUp className="h-6 w-6 text-academic-success" />
                  </div>
                  <h3 className="academic-heading h3">Performance Analytics</h3>
                </div>
                <p className="text-muted-foreground">
                  Get detailed insights into your academic performance with visual charts, trend analysis, and personalized recommendations.
                </p>
                </div>
                
              <div className="academic-card card-hover space-y-4 hover-lift animate-stagger stagger-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-academic-secondary/10 hover-rotate">
                    <BookOpen className="h-6 w-6 text-academic-secondary" />
                  </div>
                  <h3 className="academic-heading h3">Semester Management</h3>
                </div>
                <p className="text-muted-foreground">
                  Organize your academic data by semesters, compare performance across terms, and plan your academic goals effectively.
                </p>
                </div>
                
              <div className="academic-card card-hover space-y-4 hover-lift animate-stagger stagger-5">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-academic-danger/10 hover-rotate">
                    <Target className="h-6 w-6 text-academic-danger" />
                  </div>
                  <h3 className="academic-heading h3">Goal Tracking</h3>
                </div>
                <p className="text-muted-foreground">
                  Set academic goals, track your progress towards target CGPA, and receive motivational insights to stay on track.
                </p>
                </div>
                
              <div className="academic-card card-hover space-y-4 hover-lift animate-stagger stagger-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-academic-accent/10 hover-rotate">
                    <Shield className="h-6 w-6 text-academic-accent" />
                  </div>
                  <h3 className="academic-heading h3">Smart Notifications</h3>
                </div>
                <p className="text-muted-foreground">
                  Stay informed with intelligent notifications about low attendance, upcoming exams, and important academic deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="landing-section academic-section bg-muted/30">
          <div className="academic-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center space-y-2 hover-scale animate-bounce-in stagger-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-primary">10,000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center space-y-2 hover-scale animate-bounce-in stagger-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-primary">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Improved Performance</div>
              </div>
              <div className="text-center space-y-2 hover-scale animate-bounce-in stagger-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-primary">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Universities</div>
              </div>
              <div className="text-center space-y-2 hover-scale animate-bounce-in stagger-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-academic-primary">4.9/5</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Student Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="landing-section academic-section">
          <div className="academic-container">
            <div className="text-center space-y-4 mb-8 lg:mb-12">
              <h2 className="academic-heading h2 text-2xl sm:text-3xl lg:text-4xl">What Students Are Saying</h2>
              <p className="academic-subheading max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Don't just take our word for it. Here's what real students have to say about their experience with UNI-TEL.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="academic-card space-y-4 hover-lift animate-slide-left stagger-1">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 fill-academic-warning text-academic-warning animate-bounce-in stagger-${i}`} />
                  ))}
                    </div>
                <Quote className="h-8 w-8 text-academic-primary/20 animate-float-slow" />
                <p className="text-muted-foreground">
                  "UNI-TEL completely transformed how I track my academic progress. My CGPA improved by 0.3 points in just one semester!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-academic-primary/10 flex items-center justify-center hover-scale">
                    <span className="text-sm font-semibold text-academic-primary">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Mitchell</div>
                    <div className="text-sm text-muted-foreground">Computer Science, MIT</div>
                  </div>
                  </div>
                </div>
                
              <div className="academic-card space-y-4 hover-lift animate-slide-up stagger-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 fill-academic-warning text-academic-warning animate-bounce-in stagger-${i}`} />
                  ))}
                    </div>
                <Quote className="h-8 w-8 text-academic-primary/20 animate-float-slow" />
                <p className="text-muted-foreground">
                  "The attendance tracking feature saved me from missing important classes. The notifications are a game-changer!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-academic-warning/10 flex items-center justify-center hover-scale">
                    <span className="text-sm font-semibold text-academic-warning">AJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Alex Johnson</div>
                    <div className="text-sm text-muted-foreground">Business Administration, Stanford</div>
                  </div>
                  </div>
                </div>
                
              <div className="academic-card space-y-4 hover-lift animate-slide-right stagger-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 fill-academic-warning text-academic-warning animate-bounce-in stagger-${i}`} />
                  ))}
                    </div>
                <Quote className="h-8 w-8 text-academic-primary/20 animate-float-slow" />
                <p className="text-muted-foreground">
                  "The analytics helped me identify my weak subjects early. I was able to focus my study time more effectively."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-academic-success/10 flex items-center justify-center hover-scale">
                    <span className="text-sm font-semibold text-academic-success">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Engineering, UC Berkeley</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="landing-section academic-section bg-muted/30">
          <div className="academic-container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="academic-heading h2">How It Works</h2>
              <p className="academic-subheading max-w-2xl mx-auto">
                Get started with UNI-TEL in just a few simple steps and transform your academic journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-academic-primary/10 mx-auto">
                  <span className="text-2xl font-bold text-academic-primary">1</span>
                </div>
                <h3 className="academic-heading h3">Sign Up & Setup</h3>
                <p className="text-muted-foreground">
                  Create your account and set up your academic profile. Import your existing data or start fresh.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-academic-warning/10 mx-auto">
                  <span className="text-2xl font-bold text-academic-warning">2</span>
                </div>
                <h3 className="academic-heading h3">Track & Monitor</h3>
                <p className="text-muted-foreground">
                  Add your subjects, track grades, and monitor attendance. Set goals and get personalized insights.
                </p>
                </div>

              <div className="text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-academic-success/10 mx-auto">
                  <span className="text-2xl font-bold text-academic-success">3</span>
                </div>
                <h3 className="academic-heading h3">Achieve Success</h3>
                <p className="text-muted-foreground">
                  Watch your academic performance improve with data-driven insights and smart recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="landing-section academic-section bg-muted/30">
          <div className="academic-container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="academic-heading h2 text-2xl sm:text-3xl lg:text-4xl">Frequently Asked Questions</h2>
              <p className="academic-subheading max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Everything you need to know about UNI-TEL. Can't find the answer? Contact our support team.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
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
                <div key={idx} className="academic-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 lg:p-6 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold text-base lg:text-lg pr-4">{faq.q}</span>
                    {openFaq === idx ? (
                      <Minus className="h-5 w-5 text-academic-primary flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 lg:px-6 pb-4 lg:pb-6 text-muted-foreground text-sm lg:text-base">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="landing-section academic-section bg-gradient-to-r from-academic-primary to-academic-secondary text-white gradient-animate relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="academic-container text-center space-y-8 relative z-10">
            <div className="space-y-4 animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                <Rocket className="h-4 w-4" />
                <span className="text-sm font-medium">Join 10,000+ students already succeeding</span>
              </div>
              <h2 className="academic-heading h2 text-white text-3xl sm:text-4xl lg:text-5xl">Start Your Free Trial Today</h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                No credit card required. Set up in 5 minutes. See results in your first semester.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in stagger-1">
              <button 
                onClick={() => navigate('/auth')}
                className="academic-button lg bg-white text-academic-primary hover:bg-white/90 hover-scale magnetic w-full sm:w-auto group shadow-xl"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="academic-button secondary lg border-white/20 text-white hover:bg-white/10 hover-lift w-full sm:w-auto flex items-center justify-center"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Additional CTA Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mx-auto hover:bg-white/20 transition-colors">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white">Quick Setup</h4>
                <p className="text-sm text-white/80">Get started in under 5 minutes</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mx-auto hover:bg-white/20 transition-colors">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white">Secure & Private</h4>
                <p className="text-sm text-white/80">Your data is always protected</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mx-auto hover:bg-white/20 transition-colors">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white">Student-First</h4>
                <p className="text-sm text-white/80">Built by students, for students</p>
              </div>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/70">
                ✓ Free forever • ✓ No credit card • ✓ Cancel anytime
              </p>
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
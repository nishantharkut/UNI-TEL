import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Clock, 
  Target, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  Zap,
  TrendingUp,
  BookOpen,
  Users,
  Menu,
  X
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<{ full_name?: string; email?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="UNI-TEL" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-gray-900">UNI-TEL</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </button>
              )}
              <div className="flex items-center space-x-4">
                {authLoading ? (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : user ? (
                  <>
                    <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                        {userProfile?.full_name || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/auth')}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Trusted by 10,000+ students
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Track Your Grades. Monitor Attendance. Achieve Success.
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  The all-in-one platform for students to manage their academic journey. Calculate CGPA, track attendance, and get insights to improve your performance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button
                    onClick={() => navigate('/auth')}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      const demo = document.getElementById('demo');
                      demo?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </button>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Free forever
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    No credit card
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    5-minute setup
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Academic Dashboard</h3>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Current CGPA</div>
                        <div className="text-2xl font-bold text-blue-600">3.85</div>
                        <div className="text-xs text-green-600 mt-1">+0.15 this semester</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Attendance</div>
                        <div className="text-2xl font-bold text-orange-600">92%</div>
                        <div className="text-xs text-gray-500 mt-1">Above required</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {['Mathematics', 'Physics', 'Chemistry', 'English'].map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{subject}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full" 
                                style={{ width: `${85 + idx * 3}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-12 text-right">
                              {85 + idx * 3}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help you stay on top of your academic performance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BarChart3,
                  title: 'Grade Tracking',
                  description: 'Automatically calculate your CGPA and track grades across all subjects with real-time updates.'
                },
                {
                  icon: Clock,
                  title: 'Attendance Management',
                  description: 'Monitor your attendance percentage for each subject and get alerts when you\'re falling behind.'
                },
                {
                  icon: TrendingUp,
                  title: 'Performance Analytics',
                  description: 'Visualize your academic progress with charts and insights to identify areas for improvement.'
                },
                {
                  icon: Target,
                  title: 'Goal Setting',
                  description: 'Set academic goals and track your progress towards achieving your target CGPA.'
                },
                {
                  icon: BookOpen,
                  title: 'Semester Management',
                  description: 'Organize your academic data by semesters and compare performance across different terms.'
                },
                {
                  icon: Shield,
                  title: 'Secure & Private',
                  description: 'Your data is encrypted and secure. We never share your information with third parties.'
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                See it in action
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch how UNI-TEL helps students track their academic progress
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex items-center justify-center w-20 h-20 bg-white rounded-full hover:scale-110 transition-transform shadow-lg">
                    <Play className="h-8 w-8 text-gray-900 ml-1" />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10,000+', label: 'Active Students' },
                { value: '95%', label: 'See Improvement' },
                { value: '500+', label: 'Universities' },
                { value: '4.9/5', label: 'Student Rating' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What students are saying
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Mitchell',
                  role: 'Computer Science Student',
                  text: 'UNI-TEL completely transformed how I track my academic progress. My CGPA improved by 0.3 points in just one semester!'
                },
                {
                  name: 'Alex Johnson',
                  role: 'Business Student',
                  text: 'The attendance tracking feature saved me from missing important classes. The notifications are a game-changer!'
                },
                {
                  name: 'Maria Rodriguez',
                  role: 'Engineering Student',
                  text: 'The analytics helped me identify my weak subjects early. I was able to focus my study time more effectively.'
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to improve your grades?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of students already using UNI-TEL to track their academic progress
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <p className="text-sm text-blue-100 mt-6">
              Free forever • No credit card required • 5-minute setup
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="UNI-TEL" className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold text-white">UNI-TEL</span>
              </div>
              <p className="text-sm">
                Empowering students worldwide with smart academic management tools.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/auth')} className="hover:text-white">Get Started</button></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2024 UNI-TEL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

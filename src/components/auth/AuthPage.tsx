import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle, BarChart3, Shield, Zap } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the verification link!');
      // The user will need to check their email and click the verification link
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-academic-primary/5 flex flex-col p-4">
      {/* Back Button */}
      <div className="w-full max-w-6xl mx-auto mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back to Landing
        </Button>
      </div>

      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="UNI-TEL Logo" 
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent">
            UNI-TEL
          </h1>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Auth Form */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} lg:order-2`}>
          <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm w-full max-w-md mx-auto lg:max-w-none lg:min-h-[500px]">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="signin" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm sm:text-base">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm sm:text-base">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6 min-h-[400px] flex flex-col justify-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Welcome Back!</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Sign in to continue your academic journey</p>
                  </div>
                  
                  <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="signin-email" className="text-xs sm:text-sm font-medium text-foreground">Email Address</Label>
                      <div className="relative mt-1 sm:mt-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 focus:border-academic-primary transition-colors text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signin-password" className="text-xs sm:text-sm font-medium text-foreground">Password</Label>
                      <div className="relative mt-1 sm:mt-2">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 border-2 focus:border-academic-primary transition-colors text-sm sm:text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-12 bg-gradient-to-r from-academic-primary to-academic-secondary hover:from-academic-primary/90 hover:to-academic-secondary/90 text-sm sm:text-base lg:text-lg font-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm">Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">Sign In</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6 min-h-[400px] flex flex-col justify-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Create Account</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Join thousands of students already using UNI-TEL</p>
                  </div>
                  
                  <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="signup-name" className="text-xs sm:text-sm font-medium text-foreground">Full Name</Label>
                      <div className="relative mt-1 sm:mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 focus:border-academic-primary transition-colors text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-email" className="text-xs sm:text-sm font-medium text-foreground">Email Address</Label>
                      <div className="relative mt-1 sm:mt-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 focus:border-academic-primary transition-colors text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password" className="text-xs sm:text-sm font-medium text-foreground">Password</Label>
                      <div className="relative mt-1 sm:mt-2">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 border-2 focus:border-academic-primary transition-colors text-sm sm:text-base"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-12 bg-gradient-to-r from-academic-primary to-academic-secondary hover:from-academic-primary/90 hover:to-academic-secondary/90 text-sm sm:text-base lg:text-lg font-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm">Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">Create Account</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Content Section */}
        <div className={`space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} lg:order-1 lg:sticky lg:top-8`}>
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-center lg:text-left">
              Welcome to Your
              <span className="bg-gradient-to-r from-academic-primary to-academic-secondary bg-clip-text text-transparent"> Academic Hub</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-center lg:text-left">
              Track your academic journey with intelligent analytics, smart attendance management, 
              and beautiful performance insights.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 rounded-lg bg-academic-success/10">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-academic-success" />
              </div>
              <span className="text-sm sm:text-base text-foreground">Smart Academic Tracking</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 rounded-lg bg-academic-primary/10">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-academic-primary" />
              </div>
              <span className="text-sm sm:text-base text-foreground">Advanced Analytics & Insights</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 rounded-lg bg-academic-warning/10">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-academic-warning" />
              </div>
              <span className="text-sm sm:text-base text-foreground">Secure & Private Data</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 rounded-lg bg-academic-danger/10">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-academic-danger" />
              </div>
              <span className="text-sm sm:text-base text-foreground">Real-time Performance Updates</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { AppRoute, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from registration redirect
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clean up state so message doesn't persist on refresh if we were to use history replace (optional)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate network delay
    setTimeout(() => {
      try {
        // Retrieve registered users from local storage
        const dbUsers = JSON.parse(localStorage.getItem('maonda_db_users') || '[]');
        
        // Find user with matching credentials
        const validUser = dbUsers.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (validUser) {
          // Create session user object (exclude password)
          const sessionUser: User = {
            id: validUser.id,
            name: validUser.name,
            email: validUser.email,
            avatar: validUser.avatar,
            bio: validUser.bio,
            location: validUser.location,
            interests: validUser.interests,
            birthDate: validUser.birthDate,
            phone: validUser.phone
          };

          onLogin(sessionUser);
          navigate(AppRoute.DASHBOARD);
        } else {
          setError('Invalid email or password. Please check your credentials.');
        }
      } catch (err) {
        setError('An error occurred during login. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="relative z-10 flex flex-col items-center">
             <Heart className="w-12 h-12 mb-3 text-primary fill-current" />
             <h2 className="text-2xl font-serif font-bold">Welcome Back</h2>
             <p className="text-slate-300 text-sm mt-1">Sign in to Maonda Foundation</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {successMessage && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-green-100">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-all flex justify-center items-center gap-2 group"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to={AppRoute.REGISTER} className="text-primary font-medium hover:underline">
              Join the Foundation
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

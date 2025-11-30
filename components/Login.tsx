import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { AppRoute, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would come from a backend. 
      // For now, we mock a user.
      const mockUser: User = {
        id: '1',
        name: 'Sarah Wilson', // Fallback if no specific user logic
        email: email
      };
      
      // If there is a "last registered" user in storage for demo purposes, try to use that name
      const stored = localStorage.getItem('maonda_user');
      const userToLogin = stored ? JSON.parse(stored) : mockUser;

      onLogin(userToLogin);
      navigate(AppRoute.DASHBOARD);
      setIsLoading(false);
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
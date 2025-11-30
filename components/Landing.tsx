import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Clock, ArrowRight } from 'lucide-react';
import { AppRoute } from '../types';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="w-8 h-8 fill-current" />
          <span className="font-serif font-bold text-2xl text-slate-900">Maonda Foundation</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to={AppRoute.LOGIN} className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2">
            Log In
          </Link>
          <Link to={AppRoute.REGISTER} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-700 transition-colors">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight mb-8">
              Preserving Heritage, <br/>
              <span className="text-primary">Connecting Generations</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Maonda Foundation provides a private, secure digital sanctuary for your family's legacy. 
              Manage events, share recipes, archive stories, and stay connected like never before.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={AppRoute.REGISTER} className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-700 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Start Your Family Network <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to={AppRoute.LOGIN} className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors">
                Member Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Family Directory</h3>
              <p className="text-slate-600">
                A dynamic, interactive directory to keep track of birthdays, locations, and contact info for the whole extended family.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600">
                Your family's data is sacred. Access deeper services only through secure authentication designed for privacy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">History AI</h3>
              <p className="text-slate-600">
                Use our advanced AI tools to polish family stories, generate nostalgic recipes, and plan the perfect reunions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-6 h-6 fill-current text-primary" />
            <span className="font-serif font-bold text-xl">Maonda Foundation</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Maonda Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
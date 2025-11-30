import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Calendar, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { AppRoute, User } from '../types';

const Dashboard: React.FC = () => {
  // Access the user context passed from Layout
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-900/30 z-10" />
        <img 
          src="https://picsum.photos/1200/400?grayscale" 
          alt="Family Gathering" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Welcome Home, {user ? user.name : 'Member'}</h1>
          <p className="text-slate-200 max-w-xl">
            Stay connected with the latest family updates, upcoming events, and cherished memories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats / Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Next Event</h3>
          <p className="text-slate-600 mb-4">Summer BBQ at Uncle Joe's</p>
          <span className="text-sm font-semibold text-primary mt-auto">Aug 15th • 2:00 PM</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">New Recipe</h3>
          <p className="text-slate-600 mb-4">Aunt May's Apple Pie added by AI Chef</p>
          <Link to={AppRoute.RECIPES} className="text-sm font-semibold text-primary flex items-center gap-1 mt-auto">
            View Recipe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Recent Story</h3>
          <p className="text-slate-600 mb-4">"The Great Fishing Trip of '98"</p>
          <Link to={AppRoute.STORIES} className="text-sm font-semibold text-primary flex items-center gap-1 mt-auto">
            Read Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Photos Preview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-slate-800">Latest Memories</h2>
          <Link to={AppRoute.GALLERY} className="text-primary hover:text-primary/80 font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm">
              <img 
                src={`https://picsum.photos/400/400?random=${i + 10}`} 
                alt="Family memory" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
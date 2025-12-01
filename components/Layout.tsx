
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Utensils, 
  BookOpen, 
  Image as ImageIcon, 
  ShoppingBag,
  Menu, 
  X,
  Heart,
  LogOut,
  GitGraph,
  Flower,
  GraduationCap
} from 'lucide-react';
import { AppRoute, User } from '../types';
import ChatBot from './ChatBot';
import NotificationCenter from './NotificationCenter';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useAppContext();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: 'Dashboard', path: AppRoute.DASHBOARD, icon: Home },
    { name: 'Directory', path: AppRoute.DIRECTORY, icon: Users },
    { name: 'Family Tree', path: AppRoute.FAMILY_TREE, icon: GitGraph },
    { name: 'In Loving Memory', path: AppRoute.MEMORIAL, icon: Flower },
    { name: 'Learning Center', path: AppRoute.LEARNING, icon: GraduationCap },
    { name: 'Calendar', path: AppRoute.CALENDAR, icon: Calendar },
    { name: 'Recipes', path: AppRoute.RECIPES, icon: Utensils },
    { name: 'Historian', path: AppRoute.STORIES, icon: BookOpen },
    { name: 'Gallery', path: AppRoute.GALLERY, icon: ImageIcon },
    { name: 'Family Store', path: AppRoute.SHOP, icon: ShoppingBag, badge: cartItemCount },
  ];

  const handleLogout = () => {
    onLogout();
    navigate(AppRoute.HOME);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="w-6 h-6 fill-current" />
          <span className="font-serif font-bold text-xl text-slate-800">Maonda</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-10 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 hidden md:flex items-center gap-2 text-primary mb-6">
          <Heart className="w-8 h-8 fill-current" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl text-slate-800 leading-none">Maonda</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Foundation</span>
          </div>
        </div>

        <div className="px-6 mb-4">
           <NavLink to={AppRoute.PROFILE} onClick={() => setIsMobileMenuOpen(false)} className="block group">
             <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100 group-hover:border-primary/30 transition-colors">
               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold overflow-hidden">
                 {user?.avatar ? (
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   user?.name.charAt(0) || 'U'
                 )}
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">{user?.name}</p>
                 <p className="text-xs text-slate-500 truncate">View Profile</p>
               </div>
             </div>
           </NavLink>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alerts</span>
            <div className="md:block hidden">
              <NotificationCenter />
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose-600 text-sm font-medium w-full px-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-4 md:p-8 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto">
          {/* Pass the user to all child routes via context */}
          <Outlet context={{ user }} />
        </div>
      </main>

      {/* Global ChatBot - Will hide itself based on route if necessary */}
      <ChatBot />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;

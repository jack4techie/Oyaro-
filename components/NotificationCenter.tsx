
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Calendar, MessageCircle, Info, X, Check, Trash2 } from 'lucide-react';
import { Notification } from '../types';

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Upcoming Event',
    message: 'The Annual Gala is in 24 days.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    type: 'event'
  },
  {
    id: '2',
    title: 'New Story Added',
    message: 'Uncle Bob added "The Treehouse Summer" to the archives.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
    type: 'system'
  },
  {
    id: '3',
    title: 'Welcome!',
    message: 'Welcome to the new Mounda Foundation platform.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    type: 'system'
  }
];

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 md:left-full md:top-auto md:bottom-0 md:ml-2 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right md:origin-bottom-left">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!notification.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 p-2 rounded-full ${!notification.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                            {formatTime(notification.date)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-snug">{notification.message}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {!notification.read && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Plus, Loader2, X, Clock, Check, HelpCircle, XCircle, ArrowUpDown } from 'lucide-react';
import { suggestEventIdeas, hasApiKey } from '../services/geminiService';
import { FamilyEvent } from '../types';
import { useAppContext } from '../context/AppContext';

const EventCalendar: React.FC = () => {
  const { events, addEvent, updateEvent } = useAppContext();
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'title'>('date');
  
  // Add Event Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<FamilyEvent, 'id' | 'rsvpStatus'>>({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'other',
    description: ''
  });

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (a.time || '').localeCompare(b.time || '');
      case 'time':
        // Sort by time of day, putting unspecified times last
        const timeA = a.time || '23:59';
        const timeB = b.time || '23:59';
        const timeDiff = timeA.localeCompare(timeB);
        if (timeDiff !== 0) return timeDiff;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  const handleBrainstorm = async () => {
    if (!hasApiKey()) {
      setIdeas(["Please add API Key to use AI suggestions."]);
      return;
    }
    setIsBrainstorming(true);
    try {
      const suggestions = await suggestEventIdeas("Family Reunion", "Summer");
      setIdeas(suggestions);
    } catch (e) {
      setIdeas(["Could not generate ideas right now."]);
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const eventToAdd: FamilyEvent = {
      id: Date.now().toString(),
      ...newEvent,
      rsvpStatus: 'going' // Auto RSVP for creator
    };

    addEvent(eventToAdd);
    setShowAddModal(false);
    setNewEvent({ title: '', date: '', time: '', location: '', type: 'other', description: '' });
  };

  const handleUpdateRSVP = (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      updateEvent({ ...event, rsvpStatus: status });
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {/* Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-serif font-bold text-lg text-slate-800">Add New Event</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="e.g. Summer Picnic"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      value={newEvent.time}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                   <div className="relative">
                     <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                     <input 
                       type="text" 
                       value={newEvent.location}
                       onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                       className="w-full pl-9 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                       placeholder="e.g. Grandma's House"
                     />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="birthday">Birthday</option>
                    <option value="reunion">Reunion</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={newEvent.description}
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none transition-all"
                    placeholder="Add details about what to bring..."
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-serif font-bold text-slate-800">Upcoming Events</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-sm">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 hidden sm:inline">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none font-medium text-slate-700 cursor-pointer"
                >
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="title">Title</option>
                </select>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-rose-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
             <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
               <p className="text-slate-500">No upcoming events found.</p>
               <button onClick={() => setShowAddModal(true)} className="text-primary font-medium text-sm mt-2 hover:underline">Create your first event</button>
             </div>
          ) : (
            sortedEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:border-primary/30 transition-colors">
                <div className="flex flex-row md:flex-col gap-4 items-center md:min-w-[80px]">
                  <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center min-w-[80px] w-full border border-slate-100 text-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-bold">{new Date(event.date).getDate() + 1}</span>
                  </div>
                  {event.time && (
                    <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                       <Clock className="w-3 h-3" /> {formatTime(event.time)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                    <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                      ${event.type === 'birthday' ? 'bg-purple-100 text-purple-700' : 
                        event.type === 'reunion' ? 'bg-green-100 text-green-700' : 
                        event.type === 'holiday' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-3">
                      {event.location && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <MapPin className="w-4 h-4" /> {event.location}
                        </a>
                      )}
                      {event.time && (
                        <span className="flex md:hidden items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(event.time)}</span>
                      )}
                      <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {new Date(event.date).getFullYear()}</span>
                  </div>

                  <p className="text-slate-600 mb-4">{event.description}</p>
                  
                  {/* RSVP Section */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your RSVP:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateRSVP(event.id, 'going')}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${event.rsvpStatus === 'going' ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-700'}`}
                      >
                        <Check className="w-3 h-3" /> Going
                      </button>
                      <button 
                         onClick={() => handleUpdateRSVP(event.id, 'maybe')}
                         className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${event.rsvpStatus === 'maybe' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700'}`}
                      >
                        <HelpCircle className="w-3 h-3" /> Maybe
                      </button>
                      <button 
                         onClick={() => handleUpdateRSVP(event.id, 'not_going')}
                         className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${event.rsvpStatus === 'not_going' ? 'bg-slate-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <XCircle className="w-3 h-3" /> Can't Go
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 sticky top-24">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Event Planner AI</h3>
          <p className="text-sm text-slate-600 mb-4">Stuck on what to do for the next reunion? Ask our AI assistant.</p>
          
          <button 
            onClick={handleBrainstorm}
            disabled={isBrainstorming}
            className="w-full bg-white text-indigo-600 border border-indigo-200 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2 mb-4 shadow-sm"
          >
             {isBrainstorming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Brainstorm Ideas"}
          </button>

          {ideas.length > 0 && (
            <div className="bg-white/60 rounded-lg p-1 space-y-1 max-h-96 overflow-y-auto">
              {ideas.map((idea, idx) => (
                <div key={idx} className="bg-white p-3 rounded text-sm text-slate-700 border border-indigo-100 flex items-start gap-2 shadow-sm">
                  <span className="text-indigo-400 mt-0.5">•</span> 
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
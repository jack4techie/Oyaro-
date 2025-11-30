import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Plus, Loader2 } from 'lucide-react';
import { suggestEventIdeas, hasApiKey } from '../services/geminiService';
import { FamilyEvent } from '../types';

const INITIAL_EVENTS: FamilyEvent[] = [
  { id: '1', title: "Reunion BBQ", date: "2024-08-15", type: 'reunion', description: "Annual summer gathering at Uncle Joe's backyard." },
  { id: '2', title: "Grandma's 80th Birthday", date: "2024-09-22", type: 'birthday', description: "Surprise party at the Community Hall." },
];

const EventCalendar: React.FC = () => {
  const [events] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif font-bold text-slate-800">Upcoming Events</h2>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-rose-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:border-primary/30 transition-colors">
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center min-w-[80px] border border-slate-100 text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
              </div>
              
              <div className="flex-1">
                 <div className="flex items-start justify-between mb-2">
                   <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                   <span className={`px-3 py-1 rounded-full text-xs font-medium 
                     ${event.type === 'birthday' ? 'bg-purple-100 text-purple-700' : 
                       event.type === 'reunion' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                     {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                   </span>
                 </div>
                 <p className="text-slate-600 mb-3">{event.description}</p>
                 <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Location TBD</span>
                    <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {new Date(event.date).getFullYear()}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Event Planner AI</h3>
          <p className="text-sm text-slate-600 mb-4">Stuck on what to do for the next reunion? Ask our AI assistant.</p>
          
          <button 
            onClick={handleBrainstorm}
            disabled={isBrainstorming}
            className="w-full bg-white text-indigo-600 border border-indigo-200 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2 mb-4"
          >
             {isBrainstorming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Brainstorm Ideas"}
          </button>

          {ideas.length > 0 && (
            <ul className="space-y-2">
              {ideas.map((idea, idx) => (
                <li key={idx} className="bg-white/80 p-2 rounded text-sm text-slate-700 border border-indigo-100 flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span> {idea}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;


import React, { useState } from 'react';
import { Feather, Loader2, BookOpen, Send, Plus, X } from 'lucide-react';
import { polishFamilyStory, hasApiKey } from '../services/geminiService';
import { FamilyStory } from '../types';
import { useAppContext } from '../context/AppContext';

const FamilyHistorian: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stories, addStory } = useAppContext();

  const handlePolish = async () => {
    if (!notes.trim()) return;
    if (!hasApiKey()) {
      setError("Please set REACT_APP_GEMINI_API_KEY.");
      return;
    }

    setIsPolishing(true);
    setError(null);
    try {
      const polishedContent = await polishFamilyStory(notes);
      const newStory: FamilyStory = {
        id: Date.now().toString(),
        title: "A New Memory", // In a real app, AI could generate title too
        author: "Family Historian AI",
        date: new Date().toISOString(),
        content: polishedContent,
        tags: ["AI Assisted", "Memory"]
      };
      addStory(newStory);
      setNotes('');
      setIsModalOpen(false);
    } catch (e) {
      setError("Failed to polish the story.");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-800">Family Chronicles</h2>
        <p className="text-slate-500 mt-1">Preserving our history, one story at a time.</p>
      </div>

      {/* Stories Feed - Full Width */}
      <div className="space-y-6 max-w-4xl mx-auto pb-24">
        {stories.length === 0 ? (
           <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
             <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-700">No Stories Yet</h3>
             <p className="text-slate-500">Be the first to chronicle a family memory.</p>
           </div>
        ) : (
          stories.map(story => (
            <article key={story.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden transition-all hover:shadow-md">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <BookOpen className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                   <h3 className="text-2xl font-serif font-bold text-slate-900">{story.title}</h3>
                   <span className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full w-fit">
                     {new Date(story.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                   </span>
                 </div>
                 
                 <div className="prose prose-slate max-w-none mb-6 text-slate-600 leading-relaxed whitespace-pre-line">
                   {story.content}
                 </div>

                 <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex gap-2 flex-wrap">
                      {story.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">#{tag}</span>
                      ))}
                    </div>
                    <span className="text-sm text-primary font-medium italic flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/40"></span>
                      {story.author}
                    </span>
                 </div>
               </div>
            </article>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-30 bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-rose-200 hover:bg-rose-700 hover:scale-105 transition-all flex items-center justify-center group"
        aria-label="Add Story"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Add Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2 text-primary">
                <Feather className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-slate-800">Tell a Story</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-slate-500 mb-4">
                Jot down some rough notes, dates, or key events. Our AI Historian will turn them into a beautiful narrative for the chronicles.
              </p>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dad taught me to ride a bike in 1995. It was raining. I fell twice but he caught me. We had ice cream after."
                className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base mb-2 resize-none leading-relaxed"
                autoFocus
              />
              
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePolish}
                  disabled={isPolishing || !notes.trim()}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm shadow-rose-100"
                >
                  {isPolishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isPolishing ? "Polishing..." : "Upload Chronicle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyHistorian;

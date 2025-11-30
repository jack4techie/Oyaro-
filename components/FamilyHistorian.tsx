import React, { useState } from 'react';
import { Feather, Loader2, BookOpen, Send } from 'lucide-react';
import { polishFamilyStory, hasApiKey } from '../services/geminiService';
import { FamilyStory } from '../types';

const FamilyHistorian: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [stories, setStories] = useState<FamilyStory[]>([
    {
      id: '1',
      title: "The Treehouse Summer",
      author: "Uncle Bob",
      date: "1998-07-15",
      content: "It was the summer of '98 when we decided to build the biggest treehouse the neighborhood had ever seen. Armed with nothing but scrap wood and youthful optimism, we spent every waking hour in that old oak tree...",
      tags: ["Childhood", "Summer", "Adventure"]
    }
  ]);
  const [error, setError] = useState<string | null>(null);

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
      setStories([newStory, ...stories]);
      setNotes('');
    } catch (e) {
      setError("Failed to polish the story.");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Feather className="w-6 h-6" />
            <h2 className="text-xl font-serif font-bold text-slate-800">Tell a Story</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Jot down some rough notes, dates, or key events. Our AI Historian will turn them into a beautiful narrative.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Dad taught me to ride a bike in 1995. It was raining. I fell twice but he caught me. We had ice cream after."
            className="w-full h-48 p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm mb-4 resize-none"
          />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button
            onClick={handlePolish}
            disabled={isPolishing || !notes}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isPolishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Write Story
          </button>
        </div>
      </div>

      {/* Stories Feed */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Family Chronicles</h2>
        {stories.map(story => (
          <article key={story.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <BookOpen className="w-32 h-32" />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <h3 className="text-2xl font-serif font-bold text-slate-900">{story.title}</h3>
                 <span className="text-xs text-slate-400">|</span>
                 <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{new Date(story.date).toLocaleDateString()}</span>
               </div>
               
               <div className="prose prose-slate max-w-none mb-6 text-slate-600 leading-relaxed whitespace-pre-line">
                 {story.content}
               </div>

               <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex gap-2">
                    {story.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">#{tag}</span>
                    ))}
                  </div>
                  <span className="text-sm text-primary font-medium italic">- {story.author}</span>
               </div>
             </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FamilyHistorian;

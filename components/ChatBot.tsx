
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Loader2, Sparkles, Minimize2 } from 'lucide-react';
import { createChatSession, hasApiKey } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';
import { useAppContext } from '../context/AppContext';
import { AppRoute } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am Gervas, the Maonda Foundation Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { events, members, recipes, stories } = useAppContext();

  // Condition to hide ChatBot on Family Chronicles page
  const isStoriesPage = location.pathname === AppRoute.STORIES;

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Update suggestions based on route
  useEffect(() => {
    const path = location.pathname;
    let newSuggestions: string[] = [];

    switch (path) {
      case AppRoute.DASHBOARD:
        newSuggestions = ["What's the next upcoming event?", "Show me a random recipe", "Who has a birthday soon?"];
        break;
      case AppRoute.CALENDAR:
        newSuggestions = ["Suggest activities for the reunion", "When is Grandma's birthday?", "Help me plan a picnic"];
        break;
      case AppRoute.DIRECTORY:
        newSuggestions = ["Who lives in Seattle?", "List all the cousins", "Find Robert's bio"];
        break;
      case AppRoute.RECIPES:
        newSuggestions = ["Give me a dessert recipe", "What ingredients do I need for the Roast?", "Suggest a healthy dinner"];
        break;
      case AppRoute.STORIES:
        newSuggestions = ["Summarize the Treehouse story", "Help me write about my childhood", "List stories by Uncle Bob"];
        break;
      default:
        newSuggestions = ["How do I add an event?", "Where can I upload photos?", "Who is the admin?"];
    }
    setSuggestions(newSuggestions);
  }, [location.pathname]);

  // Initialize/Update Chat Session with Website Data
  useEffect(() => {
    if (isOpen && hasApiKey() && !isStoriesPage) {
      // Collect all data into a context string
      const websiteData = JSON.stringify({
        events: events.map(e => `${e.title} on ${e.date} at ${e.location} (${e.rsvpStatus})`),
        members: members.map(m => `${m.name} (${m.relation}) lives in ${m.location}`),
        recipes: recipes.map(r => r.title),
        stories: stories.map(s => `${s.title} by ${s.author}`)
      }, null, 2);

      // Create or re-create session with new data
      try {
        chatSessionRef.current = createChatSession(websiteData);
      } catch (e) {
        console.error("Failed to init chat session", e);
      }
    }
  }, [isOpen, events, members, recipes, stories, isStoriesPage]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    if (!hasApiKey()) {
      setMessages(prev => [...prev, 
        { role: 'user', text: textToSend },
        { role: 'model', text: 'Please configure your API Key to use the assistant.' }
      ]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        // Fallback init if useEffect didn't trigger yet (rare)
        chatSessionRef.current = createChatSession(); 
      }

      const streamResult = await chatSessionRef.current.sendMessageStream({ message: textToSend });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        fullResponse += text;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render anything if we are on the Stories page
  if (isStoriesPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[600px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm">Gervas</h3>
                <span className="flex items-center gap-1 text-[10px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  AI Assistant Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                   <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isLoading && (
            <div className="px-4 pb-2 bg-slate-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex gap-2">
                {suggestions.map((sug, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors shadow-sm"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Gervas..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="text-primary disabled:text-slate-300 hover:scale-110 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-rose-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Ask Gervas
          </span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;

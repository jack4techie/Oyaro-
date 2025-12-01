
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Play, MessageSquare, X, Send, Loader2, Sparkles, BrainCircuit, FileText, PenTool, Award, Settings, Gauge, Captions } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { createTutorSession, hasApiKey } from '../../services/geminiService';
import { Chat } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

type Tab = 'video' | 'notes' | 'exercises';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const CourseViewer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, userProgress, submitLessonQuiz } = useAppContext();
  
  const course = courses.find(c => c.id === courseId);
  
  // State
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('video');
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); 
  
  // Player State
  const playerRef = useRef<any>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{score: number, passed: boolean} | null>(null);

  // AI Tutor State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!course) return <div>Course not found</div>;

  const currentLesson = course.lessons[activeLessonIndex];
  const progress = userProgress.find(p => p.courseId === courseId);
  const completedIds = progress?.completedLessonIds || [];
  const currentScore = progress?.lessonScores?.[currentLesson.id];

  // Extract Video ID helper
  const getVideoId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(currentLesson.videoUrl);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize/Reset Logic when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setActiveTab('video');
    setQuizAnswers({});
    setQuizResult(currentScore !== undefined ? { score: currentScore, passed: currentScore >= 70 } : null);
    setPlaybackSpeed(1);
    setIsPlayerReady(false);
    
    // Reset Player if exists
    if (playerRef.current) {
      // We will re-init in the render logic when isPlaying becomes true
    }

    if (showAiTutor) {
      setMessages([{ role: 'model', text: `Hi! I'm your AI Tutor for this lesson on "${currentLesson.title}". Ask me anything about the content!` }]);
      try {
        if (hasApiKey()) {
          chatSessionRef.current = createTutorSession(currentLesson.content, course.title);
        }
      } catch (e) {
        console.error("Failed to init tutor", e);
      }
    }
  }, [currentLesson, showAiTutor, course.title, currentScore]);

  // Handle Player Initialization when playing starts
  useEffect(() => {
    if (isPlaying && videoId && window.YT) {
      const initPlayer = () => {
        // Clear previous instance if any to prevent duplicates or memory leaks
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch(e) { /* ignore */ }
        }

        playerRef.current = new window.YT.Player(`youtube-player-${currentLesson.id}`, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            cc_load_policy: captionsEnabled ? 1 : 0, // 1 = Force captions on
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              event.target.setPlaybackRate(playbackSpeed);
            },
            onStateChange: (event: any) => {
              // 0 = ended, 1 = playing, 2 = paused
            }
          }
        });
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    }
  }, [isPlaying, videoId, currentLesson.id]);

  // Effect to update playback rate when state changes
  useEffect(() => {
    if (playerRef.current && isPlayerReady && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(playbackSpeed);
    }
  }, [playbackSpeed, isPlayerReady]);

  // Effect to handle caption toggling (Requires reload to be robust via API in standard embeds)
  useEffect(() => {
    if (playerRef.current && isPlayerReady && typeof playerRef.current.getCurrentTime === 'function') {
      const currentTime = playerRef.current.getCurrentTime();
      // Re-load video with new caption policy
      playerRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: currentTime,
        suggestedQuality: 'large'
      });
    }
  }, [captionsEnabled]);

  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
  };

  // Scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    if (!hasApiKey()) {
      setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'model', text: "Please configure API Key to use the Tutor." }]);
      setInput('');
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createTutorSession(currentLesson.content, course.title);
      }
      
      const result = await chatSessionRef.current.sendMessage(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: result.text || "I'm thinking..." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I lost my train of thought. Try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!currentLesson.exercises) return;
    
    let correctCount = 0;
    currentLesson.exercises.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / currentLesson.exercises.length) * 100);
    const passed = score >= 70;
    
    setQuizResult({ score, passed });
    submitLessonQuiz(course.id, currentLesson.id, score);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar - Lesson List */}
      <div className="w-full md:w-80 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
          <h2 className="font-bold text-slate-800 leading-tight">{course.title}</h2>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((completedIds.length / course.lessons.length) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((lesson, idx) => {
            const isCompleted = completedIds.includes(lesson.id);
            const isActive = idx === activeLessonIndex;
            const lessonScore = progress?.lessonScores?.[lesson.id];

            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLessonIndex(idx)}
                className={`w-full text-left p-4 border-b border-slate-50 flex gap-3 hover:bg-slate-50 transition-colors
                  ${isActive ? 'bg-blue-50/50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
                `}
              >
                <div className="mt-0.5">
                  {isActive ? (
                    <Play className="w-5 h-5 text-primary fill-current" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-slate-700'}`}>{lesson.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                     <span className="text-xs text-slate-400">{lesson.duration}</span>
                     {lessonScore !== undefined && (
                       <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lessonScore >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {lessonScore}%
                       </span>
                     )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 overflow-hidden relative">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
           {/* Lesson Header */}
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-serif font-bold text-slate-800">{currentLesson.title}</h1>
                <p className="text-sm text-slate-500">Module {activeLessonIndex + 1}</p>
             </div>
             <button 
               onClick={() => setShowAiTutor(!showAiTutor)}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm
                 ${showAiTutor ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20' : 'bg-slate-900 text-white hover:bg-slate-800'}
               `}
             >
               <BrainCircuit className="w-4 h-4" />
               {showAiTutor ? 'Hide Tutor' : 'Open AI Tutor'}
             </button>
           </div>

           {/* Tabs */}
           <div className="flex border-b border-slate-200">
             <button 
               onClick={() => setActiveTab('video')}
               className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors
                 ${activeTab === 'video' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}
               `}
             >
               <Play className="w-4 h-4" /> Video Class
             </button>
             <button 
               onClick={() => setActiveTab('notes')}
               className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors
                 ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}
               `}
             >
               <FileText className="w-4 h-4" /> Study Notes
             </button>
             <button 
               onClick={() => setActiveTab('exercises')}
               className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors
                 ${activeTab === 'exercises' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}
               `}
             >
               <PenTool className="w-4 h-4" /> Exercises
             </button>
           </div>

           {/* Content Viewer */}
           <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
             <div className="max-w-3xl mx-auto space-y-8">
               
               {/* TAB: VIDEO */}
               {activeTab === 'video' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
                        {isPlaying && videoId ? (
                          <div id={`youtube-player-${currentLesson.id}`} className="w-full h-full"></div>
                        ) : (
                          <div 
                            className="w-full h-full relative cursor-pointer"
                            onClick={() => setIsPlaying(true)}
                          >
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border border-white/30">
                                <Play className="w-10 h-10 text-white fill-white ml-1" />
                              </div>
                            </div>
                            <img 
                              src={course.thumbnail} 
                              className="w-full h-full object-cover opacity-80" 
                              alt="Video thumbnail" 
                            />
                            {!videoId && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
                                <p className="text-white font-bold bg-red-500/80 px-4 py-2 rounded">Video unavailable</p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                          </div>
                        )}
                    </div>

                    {/* Custom Player Controls Bar */}
                    {isPlaying && videoId && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
                         <div className="flex items-center gap-2">
                           <Settings className="w-4 h-4 text-slate-400" />
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Player Controls</span>
                         </div>

                         <div className="flex items-center gap-4">
                           {/* Speed Control */}
                           <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                              <Gauge className="w-4 h-4 text-slate-500 ml-2" />
                              {[0.5, 1, 1.5, 2].map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => setPlaybackSpeed(speed)}
                                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all
                                    ${playbackSpeed === speed 
                                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' 
                                      : 'text-slate-500 hover:text-slate-800'}
                                  `}
                                >
                                  {speed}x
                                </button>
                              ))}
                           </div>

                           {/* Caption Toggle */}
                           <button
                             onClick={toggleCaptions}
                             className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                               ${captionsEnabled 
                                 ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500/20' 
                                 : 'bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200'}
                             `}
                           >
                             <Captions className="w-4 h-4" />
                             {captionsEnabled ? 'CC On' : 'CC Off'}
                           </button>
                         </div>
                      </div>
                    )}

                    <div className="prose prose-slate max-w-none">
                      <h3 className="text-lg font-bold text-slate-800">Module Overview</h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line">{currentLesson.content}</p>
                    </div>
                 </div>
               )}

               {/* TAB: NOTES */}
               {activeTab === 'notes' && (
                 <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                   {currentLesson.notes ? (
                     <SimpleMarkdown content={currentLesson.notes} />
                   ) : (
                     <div className="text-center py-12 text-slate-500">
                       <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                       <p>No detailed notes available for this module yet.</p>
                     </div>
                   )}
                 </div>
               )}

               {/* TAB: EXERCISES */}
               {activeTab === 'exercises' && (
                 <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                   {!currentLesson.exercises || currentLesson.exercises.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                        <PenTool className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No exercises available for this module.</p>
                      </div>
                   ) : (
                     <>
                        {/* Result Card */}
                        {quizResult && (
                           <div className={`p-6 rounded-xl border ${quizResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex items-center gap-4`}>
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center ${quizResult.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                               <Award className="w-6 h-6" />
                             </div>
                             <div>
                               <h3 className={`font-bold text-lg ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                                 {quizResult.passed ? 'Module Passed!' : 'Try Again'}
                               </h3>
                               <p className={`text-sm ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                 You scored {quizResult.score}%. {quizResult.passed ? 'Great job!' : 'Review the notes and try again to proceed.'}
                               </p>
                             </div>
                           </div>
                        )}

                        {/* Questions */}
                        {currentLesson.exercises.map((q, idx) => (
                          <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-4 flex gap-2">
                              <span className="text-slate-400">{idx + 1}.</span> {q.question}
                            </h4>
                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => (
                                <label 
                                  key={optIdx} 
                                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                    ${quizAnswers[q.id] === optIdx 
                                      ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                                      : 'border-slate-200 hover:bg-slate-50'
                                    }
                                    ${quizResult && optIdx === q.correctAnswer ? 'bg-green-100 border-green-500' : ''}
                                    ${quizResult && quizAnswers[q.id] === optIdx && optIdx !== q.correctAnswer ? 'bg-red-100 border-red-300' : ''}
                                  `}
                                >
                                  <input 
                                    type="radio" 
                                    name={`question-${q.id}`} 
                                    className="hidden"
                                    checked={quizAnswers[q.id] === optIdx}
                                    onChange={() => !quizResult && setQuizAnswers({...quizAnswers, [q.id]: optIdx})}
                                    disabled={!!quizResult}
                                  />
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                                    ${quizAnswers[q.id] === optIdx ? 'border-primary' : 'border-slate-300'}
                                  `}>
                                    {quizAnswers[q.id] === optIdx && <div className="w-2 h-2 rounded-full bg-primary" />}
                                  </div>
                                  <span className="text-sm text-slate-700">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Submit Button */}
                        {!quizResult && (
                          <div className="flex justify-end pt-4">
                            <button 
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(quizAnswers).length !== currentLesson.exercises.length}
                              className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit Answers
                            </button>
                          </div>
                        )}
                     </>
                   )}
                 </div>
               )}

             </div>
           </div>
        </div>

        {/* AI Tutor Panel (Collapsible) */}
        {showAiTutor && (
          <div className="w-80 md:w-96 bg-white border border-blue-100 rounded-xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 shrink-0">
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <Sparkles className="w-4 h-4" />
                 <h3 className="font-bold">AI Lesson Tutor</h3>
               </div>
               <button onClick={() => setShowAiTutor(false)} className="hover:bg-white/20 p-1 rounded"><X className="w-4 h-4" /></button>
             </div>
             
             <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none">
                     <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                   </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
             </div>

             <div className="p-3 bg-white border-t border-slate-100">
               <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200">
                 <input 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Ask about this lesson..."
                   className="flex-1 bg-transparent text-sm outline-none"
                   disabled={isTyping}
                 />
                 <button onClick={handleSendMessage} disabled={!input.trim() || isTyping} className="text-blue-600 disabled:text-slate-300">
                   <Send className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// MARKDOWN PARSER COMPONENTS
const parseInline = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono text-sm">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const parts = [];
  const lines = content.split('\n');
  let currentCodeBlock: string[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock) {
        // End block
        parts.push(
          <pre key={`code-${i}`} className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
            <code>{currentCodeBlock.join('\n')}</code>
          </pre>
        );
        currentCodeBlock = null;
      } else {
        // Start block
        currentCodeBlock = [];
      }
      continue;
    }

    if (currentCodeBlock) {
      currentCodeBlock.push(line);
      continue;
    }

    // Normal rendering
    if (line.startsWith('# ')) {
      parts.push(<h1 key={i} className="text-3xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">{parseInline(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      parts.push(<h2 key={i} className="text-2xl font-bold text-slate-800 mt-6 mb-3">{parseInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      parts.push(<h3 key={i} className="text-xl font-bold text-slate-800 mt-4 mb-2">{parseInline(line.slice(4))}</h3>);
    } else if (line.trim().startsWith('- ')) {
      parts.push(
        <div key={i} className="flex gap-2 ml-4 mb-1">
          <span className="text-slate-400 select-none">•</span>
          <span className="text-slate-700">{parseInline(line.trim().slice(2))}</span>
        </div>
      );
    } else if (/^\d+\./.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (match) {
        parts.push(
          <div key={i} className="flex gap-2 ml-4 mb-1">
            <span className="font-bold text-slate-500 select-none">{match[1]}.</span>
            <span className="text-slate-700">{parseInline(match[2])}</span>
          </div>
        );
      } else {
         parts.push(<p key={i} className="mb-4 text-slate-600 leading-relaxed">{parseInline(line)}</p>);
      }
    } else if (line.trim() === '') {
      // ignore empty lines
    } else {
      parts.push(<p key={i} className="mb-4 text-slate-600 leading-relaxed">{parseInline(line)}</p>);
    }
  }
  
  return <div>{parts}</div>;
};

export default CourseViewer;

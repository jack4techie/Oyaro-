import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Gift, Briefcase, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { members } = useAppContext();
  
  const member = members.find(m => m.id === id);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-700">Member Not Found</h2>
        <p className="text-slate-500">The family member you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline font-medium">Go Back</button>
      </div>
    );
  }

  // Resolving relationships for display
  const spouse = member.spouse ? members.find(m => m.id === member.spouse) : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parents = member.parents?.map(pid => members.find(m => m.id === pid)).filter(Boolean) as any[] || [];
  const children = members.filter(m => m.parents?.includes(member.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      {/* Header / Cover */}
      <div className="relative mb-20">
        <div className="h-48 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 w-full object-cover shadow-sm border border-slate-100"></div>
        
        <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-slate-50 overflow-hidden bg-white shadow-md flex items-center justify-center">
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {/* Left Column - Key Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">{member.name}</h1>
              <p className="text-primary font-medium mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded text-sm">{member.relation}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-sm">{member.location}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Gift className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-sm">
                  {new Date(member.birthDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Relationships */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
               <Heart className="w-4 h-4 text-primary" /> Family Connections
             </h3>
             
             {spouse && (
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Spouse</p>
                 <Link to={`/member/${spouse.id}`} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                    <img src={spouse.avatar} alt={spouse.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">{spouse.name}</span>
                      <span className="text-xs text-slate-400">{spouse.relation}</span>
                    </div>
                 </Link>
               </div>
             )}

             {parents.length > 0 && (
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Parents</p>
                 <div className="space-y-1">
                   {parents.map((p: any) => (
                      <Link key={p.id} to={`/member/${p.id}`} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover bg-slate-100" />
                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                      </Link>
                   ))}
                 </div>
               </div>
             )}

             {children.length > 0 && (
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Children</p>
                 <div className="space-y-1">
                   {children.map(c => (
                      <Link key={c.id} to={`/member/${c.id}`} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover bg-slate-100" />
                        <span className="text-sm font-medium text-slate-700">{c.name}</span>
                      </Link>
                   ))}
                 </div>
               </div>
             )}
             
             {!spouse && parents.length === 0 && children.length === 0 && (
               <p className="text-sm text-slate-400 italic">No connections listed.</p>
             )}
          </div>
        </div>

        {/* Right Column - Bio */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[200px]">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
               <Briefcase className="w-5 h-5 text-primary" />
               <h3 className="font-bold text-lg text-slate-800">Biography</h3>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
              {member.bio || "No biography available for this family member yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;

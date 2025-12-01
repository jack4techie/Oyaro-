
import React, { useState } from 'react';
import { Search, MapPin, Gift, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Directory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { members } = useAppContext();
  const navigate = useNavigate();

  // Filter out deceased members (they are in Memorial) and apply search
  const filteredMembers = members.filter(member => 
    !member.deathDate && (
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Family Directory</h2>
          <p className="text-slate-500">Keep in touch with everyone.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search family members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
         <div className="text-center py-20 bg-white border border-slate-100 rounded-xl">
           <User className="w-16 h-16 mx-auto text-slate-300 mb-4" />
           <p className="text-slate-500">No active members found.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div 
              key={member.id} 
              onClick={() => navigate(`/member/${member.id}`)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{member.name}</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{member.relation}</span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {member.location || 'Location unknown'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Gift className="w-3.5 h-3.5" />
                    {member.birthDate 
                      ? new Date(member.birthDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
                      : 'Birth date unknown'}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 line-clamp-2">{member.bio || 'No bio available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;

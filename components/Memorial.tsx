
import React, { useState } from 'react';
import { Flower, Calendar, Heart, Plus, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FamilyMember } from '../types';
import { useNavigate } from 'react-router-dom';

const Memorial: React.FC = () => {
  const { members, addMember } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter for members who have a deathDate
  const deceasedMembers = members.filter(m => m.deathDate);

  const [formData, setFormData] = useState({
    name: '',
    relation: 'Ancestor',
    birthDate: '',
    deathDate: '',
    location: '',
    bio: '',
    avatar: '' // In real app, would allow upload
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: FamilyMember = {
      id: `memorial-${Date.now()}`,
      name: formData.name,
      relation: formData.relation,
      birthDate: formData.birthDate,
      deathDate: formData.deathDate,
      location: formData.location,
      bio: formData.bio,
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1f2937&color=fff`,
    };
    addMember(newMember);
    setIsModalOpen(false);
    setFormData({ name: '', relation: 'Ancestor', birthDate: '', deathDate: '', location: '', bio: '', avatar: '' });
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flower className="w-8 h-8 text-rose-300" />
              <h2 className="text-3xl font-serif font-bold text-white">In Loving Memory</h2>
            </div>
            <p className="text-slate-300 max-w-xl">
              Honoring those who came before us. Their stories, wisdom, and love continue to shape our family today.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg shadow-rose-900/50"
          >
            <Plus className="w-5 h-5" /> Add Memorial
          </button>
        </div>
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deceasedMembers.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Flower className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Memorials Yet</h3>
            <p className="text-slate-500 mt-2">Add a family member to honor their memory.</p>
          </div>
        ) : (
          deceasedMembers.map(member => (
            <div 
              key={member.id} 
              onClick={() => navigate(`/member/${member.id}`)}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="h-24 bg-slate-200 relative">
                <div className="absolute -bottom-10 left-6">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
              <div className="pt-12 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-bold text-lg text-slate-900">{member.name}</h3>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-slate-300 text-slate-300" />
                    {member.relation}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(member.birthDate).getFullYear()} - {member.deathDate ? new Date(member.deathDate).getFullYear() : 'Present'}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-3 italic font-serif">
                  "{member.bio}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Memorial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2">
                <Flower className="w-5 h-5 text-rose-500" /> Add Memorial Profile
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Birth Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Passing Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.deathDate}
                    onChange={e => setFormData({...formData, deathDate: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                <input 
                  type="text" 
                  required
                  value={formData.relation}
                  onChange={e => setFormData({...formData, relation: e.target.value})}
                  placeholder="e.g. Great Grandfather"
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Life Summary / Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none h-32 resize-none"
                  placeholder="Share a brief history or memory..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Create Memorial
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memorial;

import React, { useState } from 'react';
import { Search, MapPin, Gift } from 'lucide-react';
import { FamilyMember } from '../types';

const MOCK_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Robert Smith', relation: 'Grandfather', birthDate: '1950-05-12', location: 'Austin, TX', avatar: 'https://picsum.photos/100/100?random=1', bio: 'Retired engineer, loves fishing and woodworking.' },
  { id: '2', name: 'Mary Smith', relation: 'Grandmother', birthDate: '1952-08-23', location: 'Austin, TX', avatar: 'https://picsum.photos/100/100?random=2', bio: 'Best cookie baker in the county. Gardening enthusiast.' },
  { id: '3', name: 'James Wilson', relation: 'Father', birthDate: '1975-03-15', location: 'Seattle, WA', avatar: 'https://picsum.photos/100/100?random=3', bio: 'Software architect. Loves hiking.' },
  { id: '4', name: 'Sarah Wilson', relation: 'Mother', birthDate: '1978-11-30', location: 'Seattle, WA', avatar: 'https://picsum.photos/100/100?random=4', bio: 'High school teacher. Bookworm.' },
  { id: '5', name: 'Emma Wilson', relation: 'Daughter', birthDate: '2005-06-10', location: 'Boston, MA', avatar: 'https://picsum.photos/100/100?random=5', bio: 'College student. Aspiring artist.' },
  { id: '6', name: 'Lucas Wilson', relation: 'Son', birthDate: '2008-01-22', location: 'Seattle, WA', avatar: 'https://picsum.photos/100/100?random=6', bio: 'High school student. Soccer player.' },
];

const Directory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = MOCK_MEMBERS.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800">{member.name}</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{member.relation}</span>
              </div>
              
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {member.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Gift className="w-3.5 h-3.5" />
                  {new Date(member.birthDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-2">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directory;

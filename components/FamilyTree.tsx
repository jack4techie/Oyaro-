
import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FamilyMember } from '../types';
import { useNavigate } from 'react-router-dom';

const FamilyTree: React.FC = () => {
  const { members } = useAppContext();
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  // Helper to find root members (those with no parents listed in the DB)
  // In a real app, you'd likely pick a specific person and look up/down.
  // Here we assume "Roots" are the oldest generation.
  const rootMembers = members.filter(m => !m.parents || m.parents.length === 0);

  // Group roots by spouses to avoid duplicate trees if they are married
  const processedIds = new Set<string>();
  const treeRoots: FamilyMember[] = [];

  rootMembers.forEach(member => {
    if (processedIds.has(member.id)) return;
    
    // Add this member
    treeRoots.push(member);
    processedIds.add(member.id);

    // If they have a spouse in the root list, mark spouse as processed too so we don't start a duplicate tree from them
    if (member.spouse) {
      processedIds.add(member.spouse);
    }
  });

  const getSpouse = (id?: string) => members.find(m => m.id === id);
  const getChildren = (parentId: string, spouseId?: string) => {
    return members.filter(m => {
      if (!m.parents) return false;
      const hasParent = m.parents.includes(parentId);
      // If spouse is known, check if they are also a parent (optional strictness)
      // For now, just checking if the primary node is a parent is enough for this visual
      return hasParent;
    });
  };

  const TreeNode: React.FC<{ member: FamilyMember }> = ({ member }) => {
    const spouse = getSpouse(member.spouse);
    const children = getChildren(member.id, member.spouse);

    return (
      <li className="flex flex-col items-center">
        <div className="flex items-center gap-8 mb-8 relative">
          {/* The Member Card */}
          <div 
            onClick={() => navigate(`/member/${member.id}`)}
            className="flex flex-col items-center bg-white border-2 border-slate-200 hover:border-primary rounded-xl p-3 w-40 cursor-pointer transition-all shadow-sm hover:shadow-md z-10 relative group"
          >
            <div className="relative">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow mb-2 group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="font-bold text-slate-800 text-sm text-center leading-tight">{member.name}</span>
            <span className="text-xs text-slate-500 mt-1">{member.relation}</span>
          </div>

          {/* The Spouse Card (if exists) */}
          {spouse && (
            <>
              {/* Connector Line between spouses */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-slate-300"></div>
              
              <div 
                onClick={() => navigate(`/member/${spouse.id}`)}
                className="flex flex-col items-center bg-white border-2 border-slate-200 hover:border-primary rounded-xl p-3 w-40 cursor-pointer transition-all shadow-sm hover:shadow-md z-10 relative group"
              >
                 <div className="relative">
                  <img 
                    src={spouse.avatar} 
                    alt={spouse.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow mb-2 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="font-bold text-slate-800 text-sm text-center leading-tight">{spouse.name}</span>
                <span className="text-xs text-slate-500 mt-1">{spouse.relation}</span>
              </div>
            </>
          )}
        </div>

        {children.length > 0 && (
          <ul className="flex flex-row justify-center gap-8 pt-8 border-t-2 border-slate-200 relative">
             {/* Vertical line from parents to children list */}
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>

             {children.map(child => (
               <div key={child.id} className="relative">
                  {/* Vertical line to child node */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  <TreeNode member={child} />
               </div>
             ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="h-[calc(100vh-100px)] relative overflow-hidden bg-slate-50 border border-slate-200 rounded-xl">
      {/* Header / Controls */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Family Tree</h2>
        <p className="text-slate-500 text-sm mb-4">Explore your roots and relationships.</p>
        <div className="flex gap-2">
           <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-slate-100 rounded-lg"><ZoomIn className="w-4 h-4" /></button>
           <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-slate-100 rounded-lg"><ZoomOut className="w-4 h-4" /></button>
           <span className="text-xs self-center text-slate-400">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Tree Container */}
      <div className="w-full h-full overflow-auto flex items-center justify-center p-20 cursor-grab active:cursor-grabbing">
        <div 
           className="transition-transform origin-top"
           style={{ transform: `scale(${scale})` }}
        >
          <ul className="flex gap-20">
            {treeRoots.map(root => (
              <TreeNode key={root.id} member={root} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;

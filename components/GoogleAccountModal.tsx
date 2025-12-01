
import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { GoogleAccountProfile } from '../services/authService';

interface GoogleAccountModalProps {
  isOpen: boolean;
  accounts: GoogleAccountProfile[];
  onSelect: (account: GoogleAccountProfile) => void;
  onClose: () => void;
}

const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({ isOpen, accounts, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100">
          <div className="flex justify-center mb-4">
             {/* Google G Logo */}
             <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
          </div>
          <h3 className="text-xl font-medium text-slate-800">Choose an account</h3>
          <p className="text-slate-500 text-sm">to continue to Maonda Foundation</p>
        </div>

        {/* Account List */}
        <div className="py-2">
          {accounts.map((account, idx) => (
            <div 
              key={idx}
              onClick={() => onSelect(account)}
              className="flex items-center gap-4 px-8 py-3 hover:bg-slate-50 cursor-pointer border-b border-transparent hover:border-slate-100 transition-colors"
            >
              <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-slate-700">{account.name}</span>
                <span className="text-xs text-slate-500">{account.email}</span>
              </div>
            </div>
          ))}
          
          <div 
            onClick={onClose}
            className="flex items-center gap-4 px-8 py-4 hover:bg-slate-50 cursor-pointer border-t border-slate-100"
          >
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
               <UserPlus className="w-5 h-5" />
             </div>
             <span className="text-sm font-medium text-slate-700">Use another account</span>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex justify-center">
            <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default GoogleAccountModal;

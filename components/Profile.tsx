
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  User as UserIcon,
  Briefcase,
  Aperture,
  LogOut
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [newInterest, setNewInterest] = useState('');
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const addInterest = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    
    if (newInterest.trim()) {
       const currentInterests = formData.interests || [];
       if (!currentInterests.includes(newInterest.trim())) {
         setFormData({...formData, interests: [...currentInterests, newInterest.trim()]});
       }
       setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
      const currentInterests = formData.interests || [];
      const newInterests = [...currentInterests];
      newInterests.splice(index, 1);
      setFormData({...formData, interests: newInterests});
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      setShowCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Match canvas dimensions to video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Convert to data URL
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setFormData({ ...formData, avatar: dataUrl });
        stopCamera();
      }
    }
  };

  useEffect(() => {
    // Cleanup stream on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Ensure video element gets stream if DOM updates
  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [showCamera, stream]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">Take Profile Photo</h3>
              <button onClick={stopCamera} className="hover:text-red-400"><X /></button>
            </div>
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
               <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-6 flex justify-center gap-4 bg-slate-50">
               <button 
                 onClick={stopCamera} 
                 className="px-6 py-3 rounded-full font-medium text-slate-600 hover:bg-slate-200"
               >
                 Cancel
               </button>
               <button 
                 onClick={takePhoto} 
                 className="px-6 py-3 rounded-full font-bold bg-primary text-white hover:bg-rose-700 flex items-center gap-2"
               >
                 <Aperture className="w-5 h-5" /> Capture
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header / Cover */}
      <div className="relative mb-20 group/header">
        <div className="h-48 rounded-2xl bg-gradient-to-r from-rose-400 to-orange-300 w-full object-cover shadow-sm"></div>
        
        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>

        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-slate-50 overflow-hidden bg-white shadow-md flex items-center justify-center">
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-slate-300" />
              )}
            </div>
            {isEditing && (
              <button 
                onClick={startCamera}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-rose-700 shadow-sm border-2 border-white transition-transform hover:scale-110"
                title="Take photo with camera"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-4 right-8">
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)}
               className="bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-white flex items-center gap-2 transition-colors"
             >
               <Edit2 className="w-4 h-4" /> Edit Profile
             </button>
           ) : (
             <div className="flex gap-2">
               <button 
                 onClick={handleCancel}
                 className="bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-white flex items-center gap-2"
               >
                 <X className="w-4 h-4" /> Cancel
               </button>
               <button 
                 onClick={handleSave}
                 className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-rose-700 flex items-center gap-2"
               >
                 <Save className="w-4 h-4" /> Save Changes
               </button>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {/* Left Column - Key Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-2xl font-serif font-bold text-slate-900 w-full border-b border-slate-200 focus:outline-none focus:border-primary bg-transparent"
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="text-2xl font-serif font-bold text-slate-900">{formData.name}</h1>
              )}
              <p className="text-slate-500">{formData.email}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400" />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.location || ''} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="City, State"
                    className="flex-1 p-1 border-b border-slate-200 focus:outline-none focus:border-primary text-sm"
                  />
                ) : (
                  <span className="text-sm">{formData.location || 'Location not set'}</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-5 h-5 text-slate-400" />
                {isEditing ? (
                  <input 
                    type="date" 
                    value={formData.birthDate || ''} 
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                    className="flex-1 p-1 border-b border-slate-200 focus:outline-none focus:border-primary text-sm"
                  />
                ) : (
                  <span className="text-sm">
                    {formData.birthDate 
                      ? new Date(formData.birthDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Birth date not set'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-slate-400" />
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phone || ''} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="Phone number"
                    className="flex-1 p-1 border-b border-slate-200 focus:outline-none focus:border-primary text-sm"
                  />
                ) : (
                  <span className="text-sm">{formData.phone || 'Phone not set'}</span>
                )}
              </div>
            </div>
          </div>
          
          {isEditing && (
             <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
               <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-bold text-amber-800 uppercase tracking-wide">Avatar URL</label>
                 <button onClick={startCamera} className="text-xs text-primary flex items-center gap-1 hover:underline"><Camera className="w-3 h-3" /> Use Camera</button>
               </div>
               <input 
                  type="text" 
                  value={formData.avatar || ''} 
                  onChange={e => setFormData({...formData, avatar: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-2 bg-white border border-amber-200 rounded text-sm focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-amber-700 mt-1">Paste a link or use the camera button.</p>
             </div>
          )}
        </div>

        {/* Right Column - Bio & Interests */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
               <Briefcase className="w-5 h-5 text-primary" />
               <h3 className="font-bold text-lg text-slate-800">About Me</h3>
            </div>
            {isEditing ? (
              <textarea 
                value={formData.bio || ''} 
                onChange={e => setFormData({...formData, bio: e.target.value})}
                placeholder="Share a little bit about yourself..."
                className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-slate-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {formData.bio || "No bio added yet."}
              </p>
            )}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Interests & Hobbies</h3>
            <div className="flex flex-wrap gap-2">
              {(formData.interests || []).map((interest, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium flex items-center gap-2 group">
                  {interest}
                  {isEditing && (
                    <button onClick={() => removeInterest(idx)} className="text-slate-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newInterest}
                    onChange={e => setNewInterest(e.target.value)}
                    onKeyDown={addInterest}
                    placeholder="Add interest..."
                    className="px-3 py-1.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-primary w-32"
                  />
                  <button onClick={addInterest} className="bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 text-slate-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {!isEditing && (!formData.interests || formData.interests.length === 0) && (
                <span className="text-slate-400 italic text-sm">No interests added.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


import React, { useRef, useState } from 'react';
import { Upload, Loader2, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Gallery: React.FC = () => {
  const { photos, addPhoto } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Simulate a small delay for better UX
        setTimeout(() => {
          const base64String = reader.result as string;
          addPhoto({
            id: Date.now().toString(),
            url: base64String,
            caption: file.name.split('.')[0] || "New Memory", // Default caption from filename
            date: new Date().toISOString()
          });
          setIsUploading(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 800);
      };

      reader.onerror = () => {
        console.error("Error reading file");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-serif font-bold text-slate-800">Family Album</h2>
           <p className="text-slate-500">Shared moments through the years.</p>
        </div>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Upload Photo
              </>
            )}
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
            <Camera className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No Photos Yet</h3>
          <p className="text-slate-500 mb-6">Start building your family album by uploading a photo.</p>
          <button 
            onClick={handleUploadClick}
            className="text-primary font-medium hover:underline"
          >
            Upload your first photo
          </button>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm bg-white border border-slate-100">
              <img 
                src={photo.url} 
                alt={photo.caption}
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-medium text-lg">{photo.caption}</p>
                <p className="text-white/80 text-xs">
                  {new Date(photo.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;

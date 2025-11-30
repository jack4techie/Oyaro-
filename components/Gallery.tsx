import React from 'react';

const Gallery: React.FC = () => {
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/600/${i % 3 === 0 ? 800 : 600}?random=${i + 50}`,
    caption: i % 3 === 0 ? "Summer Vacation" : "Family Dinner"
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-serif font-bold text-slate-800">Family Album</h2>
           <p className="text-slate-500">Shared moments through the years.</p>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700">Upload Photo</button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm">
            <img 
              src={photo.url} 
              alt={photo.caption}
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-medium">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

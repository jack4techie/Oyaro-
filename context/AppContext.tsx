
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FamilyEvent, FamilyMember, Recipe, FamilyStory, Product, CartItem, Photo, User } from '../types';
import { authService } from '../services/authService';

interface AppContextType {
  events: FamilyEvent[];
  members: FamilyMember[];
  recipes: Recipe[];
  stories: FamilyStory[];
  products: Product[];
  cart: CartItem[];
  photos: Photo[];
  addEvent: (event: FamilyEvent) => void;
  updateEvent: (event: FamilyEvent) => void;
  addMember: (member: FamilyMember) => void; // For adding deceased members manually
  addRecipe: (recipe: Recipe) => void;
  addStory: (story: FamilyStory) => void;
  addPhoto: (photo: Photo) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// INITIAL DATA - CLEARED DEFAULT MEMBERS
const INITIAL_EVENTS: FamilyEvent[] = [
  { 
    id: '1', 
    title: "Reunion BBQ", 
    date: "2024-08-15", 
    time: "14:00",
    location: "Uncle Joe's Backyard",
    type: 'reunion', 
    description: "Annual summer gathering at Uncle Joe's backyard.",
    rsvpStatus: 'going',
    reminders: ['24h']
  }
];

const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'default-1',
    title: "Grandma's Sunday Roast",
    author: "Grandma Mary",
    ingredients: ["4lb Beef Roast", "5 Carrots", "5 Potatoes", "Onion Soup Mix"],
    instructions: ["Preheat oven to 350F", "Chop veggies", "Place roast in pan", "Cover and bake for 3 hours"],
    prepTime: "3.5 hours",
    story: "This roast has been the centerpiece of our Sunday gatherings since 1985. It smells like home."
  }
];

const INITIAL_STORIES: FamilyStory[] = [];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Official Reunion Tee', price: 24.99, category: 'clothing', image: 'https://picsum.photos/400/400?random=100', description: '100% Cotton t-shirt with family crest.' },
  { id: '2', name: 'Heritage Coffee Mug', price: 14.50, category: 'keepsake', image: 'https://picsum.photos/400/400?random=101', description: 'Start your morning with family pride.' },
  { id: '3', name: 'Maonda Hoodie', price: 49.99, category: 'clothing', image: 'https://picsum.photos/400/400?random=102', description: 'Cozy fleece hoodie for cold evenings.' },
  { id: '4', name: 'Family Recipe Book', price: 34.00, category: 'keepsake', image: 'https://picsum.photos/400/400?random=103', description: 'Hardcover collection of our best recipes.' },
  { id: '5', name: 'Foundation Donation', price: 50.00, category: 'donation', image: 'https://picsum.photos/400/400?random=104', description: 'Support the Maonda Foundation education fund.' },
  { id: '6', name: 'Canvas Tote Bag', price: 12.00, category: 'clothing', image: 'https://picsum.photos/400/400?random=105', description: 'Durable tote for your daily needs.' },
];

const INITIAL_PHOTOS: Photo[] = [];

const MEMORIAL_DB_KEY = 'maonda_db_memorial';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [stories, setStories] = useState<FamilyStory[]>(INITIAL_STORIES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load Members from Auth DB (Living) and Memorial DB (Deceased)
  useEffect(() => {
    const loadMembers = () => {
      // 1. Get Living Members from Registered Users
      const registeredUsers = authService.getAllUsers();
      const livingMembers: FamilyMember[] = registeredUsers.map(u => ({
        id: u.id,
        name: u.name,
        relation: u.relation || 'Member',
        birthDate: u.birthDate || '',
        location: u.location || '',
        avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`,
        bio: u.bio || '',
        spouse: '', 
        parents: []
      }));

      // 2. Get Memorial/Manual Members from LocalStorage
      let memorialMembers: FamilyMember[] = [];
      try {
        const stored = localStorage.getItem(MEMORIAL_DB_KEY);
        if (stored) {
          memorialMembers = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to load memorial members", e);
      }

      setMembers([...livingMembers, ...memorialMembers]);
    };

    loadMembers();
    // Poll for changes in auth DB (simple way to keep directory sync'd without complex listeners)
    const interval = setInterval(loadMembers, 2000);
    return () => clearInterval(interval);
  }, []);

  const addEvent = (event: FamilyEvent) => {
    setEvents(prev => [...prev, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const updateEvent = (updatedEvent: FamilyEvent) => {
    setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
  };

  const addMember = (member: FamilyMember) => {
    // Determine if this is a manual addition (e.g. Memorial) or live user.
    // Assuming this function is called mainly for Memorial additions since users register via Auth.
    
    // Save to local storage if it's a manual entry (has deathDate usually, or just manual)
    try {
      const stored = localStorage.getItem(MEMORIAL_DB_KEY);
      const currentManual = stored ? JSON.parse(stored) : [];
      const newManual = [...currentManual, member];
      localStorage.setItem(MEMORIAL_DB_KEY, JSON.stringify(newManual));
    } catch (e) {
      console.error("Failed to save memorial member", e);
    }

    setMembers(prev => [...prev, member]);
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [recipe, ...prev]);
  };

  const addStory = (story: FamilyStory) => {
    setStories(prev => [story, ...prev]);
  };

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{ 
      events, 
      members, 
      recipes, 
      stories, 
      products,
      cart,
      photos,
      addEvent, 
      updateEvent, 
      addMember,
      addRecipe, 
      addStory,
      addPhoto,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

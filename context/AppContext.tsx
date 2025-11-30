
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FamilyEvent, FamilyMember, Recipe, FamilyStory, Product, CartItem } from '../types';

interface AppContextType {
  events: FamilyEvent[];
  members: FamilyMember[];
  recipes: Recipe[];
  stories: FamilyStory[];
  products: Product[];
  cart: CartItem[];
  addEvent: (event: FamilyEvent) => void;
  updateEvent: (event: FamilyEvent) => void;
  addRecipe: (recipe: Recipe) => void;
  addStory: (story: FamilyStory) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Robert Smith', relation: 'Grandfather', birthDate: '1950-05-12', location: 'Austin, TX', avatar: 'https://picsum.photos/100/100?random=1', bio: 'Retired engineer, loves fishing and woodworking.' },
  { id: '2', name: 'Mary Smith', relation: 'Grandmother', birthDate: '1952-08-23', location: 'Austin, TX', avatar: 'https://picsum.photos/100/100?random=2', bio: 'Best cookie baker in the county. Gardening enthusiast.' },
  { id: '3', name: 'James Wilson', relation: 'Father', birthDate: '1975-03-15', location: 'Seattle, WA', avatar: 'https://picsum.photos/100/100?random=3', bio: 'Software architect. Loves hiking.' },
  { id: '4', name: 'Sarah Wilson', relation: 'Mother', birthDate: '1978-11-30', location: 'Seattle, WA', avatar: 'https://picsum.photos/100/100?random=4', bio: 'High school teacher. Bookworm.' },
  { id: '5', name: 'Emma Wilson', relation: 'Daughter', birthDate: '2005-06-10', location: 'Boston, MA', avatar: 'https://picsum.photos/100/100?random=5', bio: 'College student. Aspiring artist.' },
  { id: '6', name: 'Lucas Wilson', relation: 'Son', birthDate: '2008-01-22', location: 'Seattle, WA', avatar: 'https://picsum.photos/100/100?random=6', bio: 'High school student. Soccer player.' },
];

const INITIAL_EVENTS: FamilyEvent[] = [
  { 
    id: '1', 
    title: "Reunion BBQ", 
    date: "2024-08-15", 
    time: "14:00",
    location: "Uncle Joe's Backyard",
    type: 'reunion', 
    description: "Annual summer gathering at Uncle Joe's backyard.",
    rsvpStatus: 'going'
  },
  { 
    id: '2', 
    title: "Grandma's 80th Birthday", 
    date: "2024-09-22", 
    time: "17:00",
    location: "Community Hall",
    type: 'birthday', 
    description: "Surprise party at the Community Hall.",
    rsvpStatus: 'maybe'
  },
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

const INITIAL_STORIES: FamilyStory[] = [
  {
    id: '1',
    title: "The Treehouse Summer",
    author: "Uncle Bob",
    date: "1998-07-15",
    content: "It was the summer of '98 when we decided to build the biggest treehouse the neighborhood had ever seen. Armed with nothing but scrap wood and youthful optimism, we spent every waking hour in that old oak tree...",
    tags: ["Childhood", "Summer", "Adventure"]
  }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Official Reunion Tee', price: 24.99, category: 'clothing', image: 'https://picsum.photos/400/400?random=100', description: '100% Cotton t-shirt with family crest.' },
  { id: '2', name: 'Heritage Coffee Mug', price: 14.50, category: 'keepsake', image: 'https://picsum.photos/400/400?random=101', description: 'Start your morning with family pride.' },
  { id: '3', name: 'Maonda Hoodie', price: 49.99, category: 'clothing', image: 'https://picsum.photos/400/400?random=102', description: 'Cozy fleece hoodie for cold evenings.' },
  { id: '4', name: 'Family Recipe Book', price: 34.00, category: 'keepsake', image: 'https://picsum.photos/400/400?random=103', description: 'Hardcover collection of our best recipes.' },
  { id: '5', name: 'Foundation Donation', price: 50.00, category: 'donation', image: 'https://picsum.photos/400/400?random=104', description: 'Support the Maonda Foundation education fund.' },
  { id: '6', name: 'Canvas Tote Bag', price: 12.00, category: 'clothing', image: 'https://picsum.photos/400/400?random=105', description: 'Durable tote for your daily needs.' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [members] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [stories, setStories] = useState<FamilyStory[]>(INITIAL_STORIES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addEvent = (event: FamilyEvent) => {
    setEvents(prev => [...prev, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const updateEvent = (updatedEvent: FamilyEvent) => {
    setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [recipe, ...prev]);
  };

  const addStory = (story: FamilyStory) => {
    setStories(prev => [story, ...prev]);
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
      addEvent, 
      updateEvent, 
      addRecipe, 
      addStory,
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

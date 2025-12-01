
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FamilyEvent, FamilyMember, Recipe, FamilyStory, Product, CartItem, Photo, User, Course, UserCourseProgress } from '../types';
import { authService } from '../services/authService';

interface AppContextType {
  events: FamilyEvent[];
  members: FamilyMember[];
  recipes: Recipe[];
  stories: FamilyStory[];
  products: Product[];
  cart: CartItem[];
  photos: Photo[];
  courses: Course[]; // Learning
  userProgress: UserCourseProgress[]; // Learning
  addEvent: (event: FamilyEvent) => void;
  updateEvent: (event: FamilyEvent) => void;
  addMember: (member: FamilyMember) => void;
  addRecipe: (recipe: Recipe) => void;
  addStory: (story: FamilyStory) => void;
  addPhoto: (photo: Photo) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  submitLessonQuiz: (courseId: string, lessonId: string, score: number) => void; // Updated from markLessonComplete
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

// --- Kenyan CBC & IT Skills Curriculum ---
const INITIAL_COURSES: Course[] = [
  // --- SENIOR SECONDARY ---
  {
    id: 'ss-math-1',
    title: 'Senior School Mathematics (Alt A)',
    description: 'Advanced mathematics covering Calculus, Trigonometry, and Matrices aligned with KICD syllabus for Grades 10-12.',
    instructor: 'Mr. Kamau (B.Ed Science)',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    category: 'sciences',
    level: 'Senior Secondary',
    lessons: [
      { 
        id: 'ss-m-1', 
        title: 'Differentiation (Calculus I)', 
        duration: '45 min', 
        videoUrl: 'https://www.youtube.com/embed/ScMd48B1Cco',
        content: 'Introduction to differentiation. Gradient of a curve, general rule of differentiation, and stationary points. Essential for Engineering tracks.',
        notes: `
# Differentiation: The Basics
Differentiation is the process of finding the derivative, or rate of change, of a function.

## Key Concepts
1. **The Gradient**: The derivative represents the slope (gradient) of the tangent to a curve at any given point.
2. **Notation**: We often denote the derivative as **dy/dx** or **f'(x)**.

## The Power Rule
If $y = x^n$, then the derivative is:
$dy/dx = n * x^(n-1)$

### Example:
If $y = x^3$, then:
$dy/dx = 3x^2$

## Stationary Points
Stationary points occur where the gradient is zero ($dy/dx = 0$).
These can be:
- Maximum points
- Minimum points
- Points of inflection
        `,
        exercises: [
          {
            id: 'q1',
            question: 'What is the derivative of y = x^4?',
            options: ['4x^3', 'x^3', '4x', '3x^3'],
            correctAnswer: 0
          },
          {
            id: 'q2',
            question: 'At a stationary point, the gradient is:',
            options: ['Undefined', 'One', 'Zero', 'Negative'],
            correctAnswer: 2
          },
          {
            id: 'q3',
            question: 'Differentiate y = 3x^2 + 2x',
            options: ['6x', '6x + 2', '3x + 2', 'x^2'],
            correctAnswer: 1
          }
        ]
      },
      { 
        id: 'ss-m-2', 
        title: 'Trigonometric Wave Forms', 
        duration: '40 min', 
        videoUrl: 'https://www.youtube.com/embed/qJ-oUV7xLdc',
        content: 'Understanding amplitude, period, and phase shift in Sine and Cosine waves. Applications in Physics.',
        notes: `
# Trigonometric Waves

## The Sine Wave
The general form is $y = A sin(Bx + C) + D$.

- **Amplitude (A)**: The peak deviation from the center line.
- **Period**: The length of one complete cycle, calculated as $360° / B$.
- **Phase Shift**: Horizontal shift.

## Applications
- Sound waves
- Alternating Current (AC) electricity
- Simple Harmonic Motion
        `,
        exercises: [
          {
            id: 'q1',
            question: 'What is the amplitude of y = 5 sin(x)?',
            options: ['1', '5', '10', 'Undefined'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'If the period is 180 degrees, what is B in sin(Bx)?',
            options: ['1', '2', '0.5', '4'],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    id: 'ss-phy-1',
    title: 'Senior Physics: Mechanics & Electricity',
    description: 'Core physics concepts required for STEM pathways. Covers Newton\'s laws, Work, Energy, and Current Electricity.',
    instructor: 'Ms. Atieno',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80',
    category: 'sciences',
    level: 'Senior Secondary',
    lessons: [
      { 
        id: 'ss-p-1', 
        title: 'Newton\'s Laws of Motion', 
        duration: '50 min', 
        videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
        content: 'Deep dive into Inertia, F=ma, and Action-Reaction forces. Free body diagrams and practical examples from Kenyan roads.',
        notes: `
# Newton's Three Laws

## First Law (Law of Inertia)
An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.

## Second Law (F=ma)
The acceleration of an object is dependent upon two variables:
1. The net force acting upon the object.
2. The mass of the object.

Formula: **Force = mass x acceleration**

## Third Law
For every action, there is an equal and opposite reaction.
        `,
        exercises: [
          {
            id: 'q1',
            question: 'Which law explains why you lurch forward when a matatu brakes suddenly?',
            options: ['First Law', 'Second Law', 'Third Law', 'None'],
            correctAnswer: 0
          },
          {
            id: 'q2',
            question: 'If Mass = 10kg and Acceleration = 2m/s^2, what is the Force?',
            options: ['5N', '20N', '12N', '8N'],
            correctAnswer: 1
          }
        ]
      },
      { 
        id: 'ss-p-2', 
        title: 'Current Electricity II', 
        duration: '55 min', 
        videoUrl: 'https://www.youtube.com/embed/8gvJzrjwjds',
        content: 'Ohm\'s law, Kirchhoff\'s laws, and calculating effective resistance in complex circuits.' 
      }
    ]
  },
  {
    id: 'ss-chem-1',
    title: 'Chemistry: The Mole Concept',
    description: 'Mastering stoichiometry and volumetric analysis. Key foundational topic for Senior Chemistry.',
    instructor: 'Tr. Omondi',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    category: 'sciences',
    level: 'Senior Secondary',
    lessons: [
      { 
        id: 'ss-c-1', 
        title: 'Molar Mass & Gas Volumes', 
        duration: '35 min', 
        videoUrl: 'https://www.youtube.com/embed/wI5rlB-4sMQ',
        content: 'Calculating molar mass, Avogadro\'s constant, and molar gas volume at RTP/STP.' 
      }
    ]
  },

  // --- ICT & SKILLS ---
  {
    id: 'ict-prog-1',
    title: 'Computer Studies: Programming (Python)',
    description: 'Practical coding skills aligned with the Computer Studies project syllabus. Learn Python from scratch.',
    instructor: 'Gervas AI Tech Lead',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    category: 'ict',
    level: 'Tertiary & Skills',
    lessons: [
      { 
        id: 'ict-p-1', 
        title: 'Python Basics: Variables & Data Types', 
        duration: '30 min', 
        videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
        content: 'Setting up your IDE. Understanding Integers, Strings, and Floats. Writing your first "Hello World".',
        notes: `
# Python Basics

Python is a high-level, interpreted programming language known for its readability.

## Data Types
- **String (str)**: Text data, e.g., "Hello".
- **Integer (int)**: Whole numbers, e.g., 5, 100.
- **Float**: Decimal numbers, e.g., 3.14.
- **Boolean**: True or False.

## Variables
Variables are containers for storing data values.
\`\`\`python
x = 5
name = "Maonda"
\`\`\`
        `,
        exercises: [
          {
            id: 'q1',
            question: 'Which of these is a correct Integer variable assignment?',
            options: ['x = "5"', 'x = 5', 'x = 5.0', 'x = True'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'What function is used to output text to the console?',
            options: ['log()', 'echo()', 'print()', 'write()'],
            correctAnswer: 2
          }
        ]
      },
      { 
        id: 'ict-p-2', 
        title: 'Control Structures', 
        duration: '45 min', 
        videoUrl: 'https://www.youtube.com/embed/PqFKRqpHrjw',
        content: 'If/Else statements, For loops, and While loops. Logic flow in programming.' 
      }
    ]
  },
  {
    id: 'ict-web-1',
    title: 'Web Development Bootcamp',
    description: 'Modern web design skills. HTML5, CSS3, and Introduction to JavaScript. Build your own portfolio.',
    instructor: 'Maonda Digital',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    category: 'ict',
    level: 'Tertiary & Skills',
    lessons: [
      { 
        id: 'ict-w-1', 
        title: 'HTML5 Structure', 
        duration: '25 min', 
        videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU',
        content: 'Semantic HTML, Divs, Spans, and Document structure. The backbone of the web.' 
      }
    ]
  },

  // --- JUNIOR SECONDARY ---
  {
    id: 'js-sci-1',
    title: 'Junior Secondary Integrated Science',
    description: 'CBC Grade 7-9 Science. Covering basic Biology, Physics, and Chemistry concepts.',
    instructor: 'Madam Wanjiku',
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
    category: 'sciences',
    level: 'Junior Secondary',
    lessons: [
      { 
        id: 'js-s-1', 
        title: 'Laboratory Safety & Tools', 
        duration: '20 min', 
        videoUrl: 'https://www.youtube.com/embed/V-Gus-t27Wk',
        content: 'Identifying common apparatus (Bunsen burner, Beakers). Safety rules in the science lab.' 
      },
      { 
        id: 'js-s-2', 
        title: 'States of Matter', 
        duration: '30 min', 
        videoUrl: 'https://www.youtube.com/embed/j_nJ5N8i4t0',
        content: 'Solids, Liquids, and Gases. Kinetic theory of matter and changes of state.' 
      }
    ]
  }
];
// -----------------------------------

const MEMORIAL_DB_KEY = 'maonda_db_memorial';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [stories, setStories] = useState<FamilyStory[]>(INITIAL_STORIES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Learning State
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [userProgress, setUserProgress] = useState<UserCourseProgress[]>([]);

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

  // Learning Functions
  const submitLessonQuiz = (courseId: string, lessonId: string, score: number) => {
    setUserProgress(prev => {
      const existingProg = prev.find(p => p.courseId === courseId);
      
      if (existingProg) {
        // If lesson already completed and score is better, update it.
        // Or if not completed, mark it.
        const alreadyCompleted = existingProg.completedLessonIds.includes(lessonId);
        
        let newCompletedIds = existingProg.completedLessonIds;
        // Assume score > 70 is passing
        if (score >= 70 && !alreadyCompleted) {
           newCompletedIds = [...existingProg.completedLessonIds, lessonId];
        }

        const newScores = { ...existingProg.lessonScores, [lessonId]: score };
        
        const course = courses.find(c => c.id === courseId);
        const isNowComplete = course ? newCompletedIds.length === course.lessons.length : false;

        return prev.map(p => p.courseId === courseId ? {
          ...p,
          completedLessonIds: newCompletedIds,
          lessonScores: newScores,
          lastAccessedDate: new Date().toISOString(),
          isCompleted: isNowComplete
        } : p);
      } else {
        // Create new progress entry
        const isPassed = score >= 70;
        const course = courses.find(c => c.id === courseId);
        const isNowComplete = (isPassed && course) ? course.lessons.length === 1 : false;
        
        return [...prev, {
          courseId,
          completedLessonIds: isPassed ? [lessonId] : [],
          lessonScores: { [lessonId]: score },
          lastAccessedDate: new Date().toISOString(),
          isCompleted: isNowComplete
        }];
      }
    });
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
      courses,
      userProgress,
      addEvent, 
      updateEvent, 
      addMember,
      addRecipe, 
      addStory,
      addPhoto,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      submitLessonQuiz
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

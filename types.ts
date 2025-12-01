
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthDate: string;
  deathDate?: string; // New field for Memorial
  location: string;
  avatar: string;
  bio: string;
  parents?: string[];
  spouse?: string;
}

export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type: 'birthday' | 'reunion' | 'holiday' | 'other';
  description: string;
  rsvpStatus?: 'going' | 'maybe' | 'not_going';
  reminders?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  story?: string;
  imageUrl?: string;
}

export interface FamilyStory {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  birthDate?: string;
  phone?: string;
  authProvider?: 'email' | 'google';
  relation?: string; // Added relation
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'event' | 'message' | 'system';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'clothing' | 'keepsake' | 'digital' | 'donation';
}

export interface CartItem extends Product {
  quantity: number;
}

// --- E-Learning Types ---
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Brief description
  videoUrl?: string; // YouTube Embed URL
  duration: string;
  notes?: string; // Markdown-style text for study notes
  exercises?: QuizQuestion[]; // Quiz at the end of the module
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  // Updated for Kenyan Syllabus
  category: 'sciences' | 'humanities' | 'technical' | 'ict' | 'languages';
  level: 'Junior Secondary' | 'Senior Secondary' | 'Tertiary & Skills';
  lessons: Lesson[];
}

export interface UserCourseProgress {
  courseId: string;
  completedLessonIds: string[];
  lessonScores: Record<string, number>; // Map of lessonId -> Score (0-100)
  lastAccessedDate: string;
  isCompleted: boolean;
}
// ------------------------

export enum AppRoute {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  DIRECTORY = '/directory',
  CALENDAR = '/calendar',
  RECIPES = '/recipes',
  STORIES = '/stories',
  GALLERY = '/gallery',
  PROFILE = '/profile',
  SHOP = '/shop',
  FAMILY_TREE = '/family-tree',
  MEMBER = '/member/:id',
  MEMORIAL = '/memorial',
  LEARNING = '/learning',
  COURSE = '/learning/course/:courseId'
}

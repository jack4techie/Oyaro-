
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthDate: string;
  location: string;
  avatar: string;
  bio: string;
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
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'event' | 'message' | 'system';
}

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
  PROFILE = '/profile'
}

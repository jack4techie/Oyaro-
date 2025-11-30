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
  type: 'birthday' | 'reunion' | 'holiday' | 'other';
  description: string;
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
  GALLERY = '/gallery'
}

import { User } from '../types';

const DB_KEY = 'maonda_db_users';
const SESSION_KEY = 'maonda_user';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDatabase = (): any[] => {
  try {
    const db = localStorage.getItem(DB_KEY);
    if (!db) {
      return [];
    }
    return JSON.parse(db);
  } catch (e) {
    console.error("Database read error", e);
    return [];
  }
};

const saveDatabase = (users: any[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

export interface GoogleAccountProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const authService = {
  /**
   * Registers a new user.
   */
  register: async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
    await delay(1000); 

    const users = getDatabase();
    const normalizedEmail = userData.email.trim().toLowerCase();

    const emailExists = users.some((u: any) => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    
    if (emailExists) {
      throw new Error("This email address is already associated with an account.");
    }

    const newUser = {
      ...userData,
      email: userData.email.trim(),
      password: userData.password.trim(),
      id: Date.now().toString(),
      interests: userData.interests || [],
      avatar: userData.avatar || '',
      bio: userData.bio || '',
      location: userData.location || '',
      birthDate: userData.birthDate || '',
      phone: userData.phone || '',
      authProvider: 'email' as const,
      relation: userData.relation || 'Member'
    };

    users.push(newUser);
    saveDatabase(users);

    const { password, ...userResponse } = newUser;
    return userResponse;
  },

  /**
   * Authenticates a user.
   */
  login: async (email: string, pass: string): Promise<User> => {
    await delay(1000);
    
    const users = getDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPass = pass.trim();
    
    const validUser = users.find((u: any) => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uPass = (u.password || '').trim();
      return uEmail === normalizedEmail && uPass === normalizedPass;
    });

    if (!validUser) {
      throw new Error("Invalid email or password.");
    }

    const { password, ...safeUser } = validUser;
    return safeUser;
  },

  updateProfile: async (updatedUser: User): Promise<User> => {
    const users = getDatabase();
    const index = users.findIndex((u: any) => u.id === updatedUser.id);

    if (index === -1) {
      throw new Error("User not found in database.");
    }

    const currentRecord = users[index];
    const newRecord = { ...currentRecord, ...updatedUser };
    
    users[index] = newRecord;
    saveDatabase(users);

    const { password, ...safeUser } = newRecord;
    return safeUser;
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // NEW: Helper to get all registered users for Directory
  getAllUsers: (): User[] => {
    const users = getDatabase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }: any) => user);
  }
};

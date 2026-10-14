export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  createdAt: string;
  role: 'creator' | 'vip' | 'streamer' | 'pro';
  bio?: string;
}

export interface StoredUser extends User {
  passwordHash: string; // Plain/Base64 stored locally for demo authentication
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

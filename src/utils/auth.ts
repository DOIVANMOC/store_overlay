import { User, StoredUser, AuthResponse } from '../types/user';

const USERS_STORAGE_KEY = 'forest_users_db';
const CURRENT_USER_STORAGE_KEY = 'forest_current_user';

// Pre-seeded default users for convenience and instant 1-click testing
const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'user-demo-1',
    username: 'streamer_demo',
    displayName: 'Minh Streamer',
    email: 'minh.streamer@forestoverlay.io',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
    role: 'pro',
    bio: 'Twitch Partner & Content Creator | Streamer game sinh tồn & FPS',
    passwordHash: '123456'
  },
  {
    id: 'user-demo-2',
    username: 'vortex_gaming',
    displayName: 'Vortex Gaming',
    email: 'vortex@gaming.vn',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-03-01T10:30:00.000Z',
    role: 'vip',
    bio: 'YouTuber & Streamer chuyên nghiệp | Fan trung thành của Forest Overlay',
    passwordHash: '123456'
  }
];

class AuthService {
  private getStoredUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        // Initialize with default demo users
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USERS;
    }
  }

  private saveStoredUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users database', e);
    }
  }

  // Get current active logged-in user session
  public getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  // Set current user session
  private setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to update current user session', e);
    }
  }

  // Register / Create Account
  public register(
    username: string,
    password: string,
    displayName?: string,
    email?: string
  ): AuthResponse {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanDisplayName = displayName?.trim() || username.trim();
    const cleanEmail = email?.trim() || `${cleanUsername}@streamer.vn`;

    // Validation
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Tên tài khoản phải có ít nhất 3 ký tự.' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return { success: false, message: 'Tên tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới (_).' };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, message: 'Mật khẩu phải có độ dài từ 6 ký tự trở lên.' };
    }

    const users = this.getStoredUsers();

    // Check if username already exists
    const existingUser = users.find(
      u => u.username.toLowerCase() === cleanUsername || (email && u.email.toLowerCase() === cleanEmail.toLowerCase())
    );

    if (existingUser) {
      return { success: false, message: 'Tên tài khoản hoặc email này đã tồn tại trên hệ thống.' };
    }

    // Create new user object
    const newUser: StoredUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username: cleanUsername,
      displayName: cleanDisplayName,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}&backgroundColor=163D2B`,
      createdAt: new Date().toISOString(),
      role: 'streamer',
      bio: 'Streamer mới gia nhập cộng đồng Forest Overlay Studio',
      passwordHash: cleanPassword
    };

    users.push(newUser);
    this.saveStoredUsers(users);

    // Omit passwordHash before saving to session
    const { passwordHash: _, ...publicUser } = newUser;
    this.setCurrentUser(publicUser);

    return {
      success: true,
      message: 'Tạo tài khoản thành công! Chào mừng bạn đến với Forest Overlay.',
      user: publicUser
    };
  }

  // Login with username and password
  public login(identifier: string, password: string): AuthResponse {
    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      return { success: false, message: 'Vui lòng nhập tên tài khoản hoặc email.' };
    }

    if (!cleanPassword) {
      return { success: false, message: 'Vui lòng nhập mật khẩu.' };
    }

    const users = this.getStoredUsers();

    // Find user by username or email
    const found = users.find(
      u => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier
    );

    if (!found) {
      return { success: false, message: 'Tài khoản không tồn tại trên hệ thống.' };
    }

    if (found.passwordHash !== cleanPassword) {
      return { success: false, message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.' };
    }

    // Success
    const { passwordHash: _, ...publicUser } = found;
    this.setCurrentUser(publicUser);

    return {
      success: true,
      message: `Chào mừng ${publicUser.displayName} đã quay trở lại!`,
      user: publicUser
    };
  }

  // Logout
  public logout(): void {
    this.setCurrentUser(null);
  }

  // Update profile
  public updateProfile(updatedData: Partial<User>): AuthResponse {
    const current = this.getCurrentUser();
    if (!current) {
      return { success: false, message: 'Bạn chưa đăng nhập.' };
    }

    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === current.id);

    if (index === -1) {
      return { success: false, message: 'Không tìm thấy người dùng.' };
    }

    const updatedUser: StoredUser = {
      ...users[index],
      ...updatedData
    };

    users[index] = updatedUser;
    this.saveStoredUsers(users);

    const { passwordHash: _, ...publicUser } = updatedUser;
    this.setCurrentUser(publicUser);

    return {
      success: true,
      message: 'Cập nhật thông tin thành công!',
      user: publicUser
    };
  }

  // Get sample demo accounts
  public getDemoAccounts(): { username: string; password: string; role: string; name: string }[] {
    return [
      { username: 'streamer_demo', password: '123456', role: 'Pro Creator', name: 'Minh Streamer' },
      { username: 'vortex_gaming', password: '123456', role: 'VIP Streamer', name: 'Vortex Gaming' }
    ];
  }
}

export const authService = new AuthService();

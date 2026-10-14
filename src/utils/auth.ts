import { User, StoredUser, AuthResponse } from '../types/user';

const USERS_STORAGE_KEY = 'forest_users_db';
const CURRENT_USER_STORAGE_KEY = 'forest_current_user';

export const ADMIN_EMAILS = ['honggiahuy933@gmail.com'];

export function isAdminIdentity(email?: string, username?: string): boolean {
  if (email && ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
    return true;
  }
  if (username && (username.toLowerCase().trim() === 'honggiahuy' || username.toLowerCase().trim() === 'honggiahuy933')) {
    return true;
  }
  return false;
}

// Pre-seeded default users with admin account for honggiahuy933@gmail.com
const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'user-admin-huy',
    username: 'honggiahuy',
    displayName: 'Huy Hoàng (Admin)',
    email: 'honggiahuy933@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-01T00:00:00.000Z',
    role: 'admin',
    bio: 'Quản trị viên tối cao Forest Overlay Studio | Quyền quản lý và đăng tải khung livestream',
    passwordHash: '123456'
  },
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
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      const parsed: StoredUser[] = JSON.parse(data);
      // Ensure admin user exists in stored users
      const hasAdmin = parsed.some(u => isAdminIdentity(u.email, u.username));
      if (!hasAdmin) {
        parsed.unshift(DEFAULT_USERS[0]);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
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
      const user: User = JSON.parse(data);
      // Automatically enforce admin role for honggiahuy933@gmail.com
      if (isAdminIdentity(user.email, user.username)) {
        user.role = 'admin';
      }
      return user;
    } catch {
      return null;
    }
  }

  // Set current user session
  private setCurrentUser(user: User | null): void {
    try {
      if (user) {
        if (isAdminIdentity(user.email, user.username)) {
          user.role = 'admin';
        }
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
    const cleanEmail = email?.trim().toLowerCase() || `${cleanUsername}@streamer.vn`;

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
      u => u.username.toLowerCase() === cleanUsername || (email && u.email.toLowerCase() === cleanEmail)
    );

    if (existingUser) {
      return { success: false, message: 'Tên tài khoản hoặc email này đã tồn tại trên hệ thống.' };
    }

    // Determine admin status
    const isAdmin = isAdminIdentity(cleanEmail, cleanUsername);

    // Create new user object
    const newUser: StoredUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username: cleanUsername,
      displayName: cleanDisplayName,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}&backgroundColor=163D2B`,
      createdAt: new Date().toISOString(),
      role: isAdmin ? 'admin' : 'streamer',
      bio: isAdmin ? 'Quản trị viên tối cao Forest Overlay Studio' : 'Streamer mới gia nhập cộng đồng Forest Overlay',
      passwordHash: cleanPassword
    };

    users.push(newUser);
    this.saveStoredUsers(users);

    const { passwordHash: _, ...publicUser } = newUser;
    this.setCurrentUser(publicUser);

    return {
      success: true,
      message: isAdmin 
        ? 'Tạo tài khoản Quản trị viên (Admin) thành công!' 
        : 'Tạo tài khoản thành công! Chào mừng bạn đến với Forest Overlay.',
      user: publicUser
    };
  }

  // Login with username or email and password
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

    // Check & grant admin if identifier matches admin email
    if (isAdminIdentity(found.email, found.username)) {
      found.role = 'admin';
    }

    const { passwordHash: _, ...publicUser } = found;
    this.setCurrentUser(publicUser);

    return {
      success: true,
      message: publicUser.role === 'admin'
        ? `Xin chào Quản trị viên ${publicUser.displayName}! Bạn có toàn quyền quản lý hệ thống.`
        : `Chào mừng ${publicUser.displayName} đã quay trở lại!`,
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

    if (isAdminIdentity(updatedUser.email, updatedUser.username)) {
      updatedUser.role = 'admin';
    }

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
      { username: 'honggiahuy', password: '123456', role: 'Quản trị viên (Admin)', name: 'Huy Hoàng (honggiahuy933@gmail.com)' },
      { username: 'streamer_demo', password: '123456', role: 'Pro Creator', name: 'Minh Streamer' },
      { username: 'vortex_gaming', password: '123456', role: 'VIP Streamer', name: 'Vortex Gaming' }
    ];
  }
}

export const authService = new AuthService();

import { UserAccount, UserAddress, StoreOrder } from '../types';
import { getStoredOrders } from './orderStorage';

const CURRENT_USER_KEY = 'zevioza_current_user';
const REGISTERED_USERS_KEY = 'zevioza_registered_users';

export const AUTH_CHANGE_EVENT = 'zevioza_auth_changed';

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse current user from storage', err);
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: user }));
  } catch (err) {
    console.error('Failed to save current user to storage', err);
  }
}

export function getRegisteredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse registered users from storage', err);
    return [];
  }
}

export function saveRegisteredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users to storage', err);
  }
}

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

export function registerUser(params: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}): { success: boolean; user?: UserAccount; error?: string } {
  const cleanPhone = cleanPhoneNumber(params.phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number' };
  }

  const trimmedName = params.name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Please enter your full name' };
  }

  const allUsers = getRegisteredUsers();
  const existingUserIndex = allUsers.findIndex(
    (u) => cleanPhoneNumber(u.phone) === cleanPhone || (params.email && u.email?.toLowerCase() === params.email.trim().toLowerCase())
  );

  const initialAddresses: UserAddress[] = [];
  if (params.address && params.address.trim()) {
    initialAddresses.push({
      id: `addr-${Date.now()}`,
      tag: 'Home',
      name: trimmedName,
      phone: params.phone.trim(),
      address: params.address.trim(),
      city: params.city?.trim() || '',
      state: params.state?.trim() || '',
      pincode: params.pincode?.trim() || '',
      isDefault: true,
    });
  }

  if (existingUserIndex >= 0) {
    // Update existing profile name & details with latest input
    const existing = allUsers[existingUserIndex];
    const updated: UserAccount = {
      ...existing,
      name: trimmedName,
      email: params.email?.trim() || existing.email,
      lastLoginAt: new Date().toISOString(),
      addresses: initialAddresses.length > 0 ? [...initialAddresses, ...existing.addresses.filter(a => !a.isDefault)] : existing.addresses,
    };
    allUsers[existingUserIndex] = updated;
    saveRegisteredUsers(allUsers);
    setCurrentUser(updated);
    return { success: true, user: updated };
  }

  const newUser: UserAccount = {
    id: `ZV-CL-${cleanPhone.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: trimmedName,
    phone: params.phone.trim(),
    email: params.email?.trim() || '',
    addresses: initialAddresses,
    memberTier: 'Member',
    loyaltyPoints: 100, // Welcome gift points
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  allUsers.push(newUser);
  saveRegisteredUsers(allUsers);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function loginUser(
  phoneOrEmail: string
): { success: boolean; user?: UserAccount; error?: string } {
  const query = phoneOrEmail.trim();
  if (!query) {
    return { success: false, error: 'Please enter your mobile number or email' };
  }

  const cleanDigits = cleanPhoneNumber(query);
  const allUsers = getRegisteredUsers();

  // 1. Search in registered users
  let match = allUsers.find((u) => {
    if (cleanDigits.length >= 10 && cleanPhoneNumber(u.phone) === cleanDigits) {
      return true;
    }
    if (u.email && u.email.toLowerCase() === query.toLowerCase()) {
      return true;
    }
    return false;
  });

  // 2. If not found in registered users, search in past store orders!
  // A user who placed an order before can seamlessly log in with their phone!
  if (!match) {
    const orders = getStoredOrders();
    const orderMatch = orders.find((o) => {
      const oDigits = cleanPhoneNumber(o.customer.phone);
      if (cleanDigits.length >= 10 && oDigits === cleanDigits) return true;
      if (query.includes('@') && o.customer.email.toLowerCase() === query.toLowerCase()) return true;
      return false;
    });

    if (orderMatch) {
      // Auto-create user account from their verified order
      const derivedUser: UserAccount = {
        id: `ZV-CL-${cleanPhoneNumber(orderMatch.customer.phone).slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: orderMatch.customer.name,
        phone: orderMatch.customer.phone,
        email: orderMatch.customer.email,
        addresses: [
          {
            id: `addr-${Date.now()}`,
            tag: 'Primary Residence',
            name: orderMatch.customer.name,
            phone: orderMatch.customer.phone,
            address: orderMatch.customer.address,
            city: orderMatch.customer.city,
            state: orderMatch.customer.state,
            pincode: orderMatch.customer.pincode,
            isDefault: true,
          },
        ],
        memberTier: orders.length > 2 ? 'Gold' : 'Member',
        loyaltyPoints: Math.round(orderMatch.total * 0.05),
        createdAt: orderMatch.createdAt,
        lastLoginAt: new Date().toISOString(),
      };

      allUsers.push(derivedUser);
      saveRegisteredUsers(allUsers);
      match = derivedUser;
    }
  }

  if (!match) {
    return {
      success: false,
      error: 'Account not found with this mobile or email. Please click "Create Account" below to register in 10 seconds.',
    };
  }

  match.lastLoginAt = new Date().toISOString();
  saveRegisteredUsers(allUsers);
  setCurrentUser(match);
  return { success: true, user: match };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function updateUserProfile(updates: Partial<UserAccount>): UserAccount | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserAccount = {
    ...current,
    ...updates,
  };

  const allUsers = getRegisteredUsers();
  const idx = allUsers.findIndex((u) => u.id === current.id || cleanPhoneNumber(u.phone) === cleanPhoneNumber(current.phone));
  if (idx >= 0) {
    allUsers[idx] = updated;
    saveRegisteredUsers(allUsers);
  }

  setCurrentUser(updated);
  return updated;
}

export function addUserAddress(address: Omit<UserAddress, 'id'>): UserAccount | null {
  const current = getCurrentUser();
  if (!current) return null;

  const newAddress: UserAddress = {
    ...address,
    id: `addr-${Date.now()}`,
  };

  let updatedAddresses = [...(current.addresses || [])];
  if (newAddress.isDefault) {
    updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
  }
  updatedAddresses.push(newAddress);

  return updateUserProfile({ addresses: updatedAddresses });
}

export function deleteUserAddress(addressId: string): UserAccount | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updatedAddresses = (current.addresses || []).filter((a) => a.id !== addressId);
  return updateUserProfile({ addresses: updatedAddresses });
}

/**
 * Filter orders strictly belonging to this user
 */
export function getUserOrders(user: UserAccount | null): StoreOrder[] {
  if (!user) return [];
  const allOrders = getStoredOrders();
  const userDigits = cleanPhoneNumber(user.phone);
  const userEmail = user.email?.trim().toLowerCase();

  return allOrders.filter((order) => {
    // Check phone match
    if (userDigits.length >= 10) {
      const orderDigits = cleanPhoneNumber(order.customer.phone);
      if (orderDigits === userDigits) return true;
    }
    // Check email match
    if (userEmail && order.customer.email.toLowerCase() === userEmail) {
      return true;
    }
    // Check exact name match if phone was missing
    if (order.customer.name.trim().toLowerCase() === user.name.trim().toLowerCase()) {
      return true;
    }
    return false;
  });
}

/**
 * When an order is placed, link it to the user account or auto-create account for new user
 */
export function associateOrderWithUser(order: StoreOrder): void {
  try {
    const cleanDigits = cleanPhoneNumber(order.customer.phone);
    if (!cleanDigits || cleanDigits.length < 10) return;

    const allUsers = getRegisteredUsers();
    let existing = allUsers.find(
      (u) => cleanPhoneNumber(u.phone) === cleanDigits || (order.customer.email && u.email?.toLowerCase() === order.customer.email.toLowerCase())
    );

    if (!existing) {
      const newUser: UserAccount = {
        id: `ZV-CL-${cleanDigits.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        addresses: [
          {
            id: `addr-${Date.now()}`,
            tag: 'Primary Residence',
            name: order.customer.name,
            phone: order.customer.phone,
            address: order.customer.address,
            city: order.customer.city,
            state: order.customer.state,
            pincode: order.customer.pincode,
            isDefault: true,
          },
        ],
        memberTier: 'Member',
        loyaltyPoints: Math.round(order.total * 0.05),
        createdAt: order.createdAt,
        lastLoginAt: new Date().toISOString(),
      };
      allUsers.push(newUser);
      saveRegisteredUsers(allUsers);
      existing = newUser;
    } else {
      // Add address to existing if not already present
      const hasAddr = existing.addresses.some(
        (a) => a.address.toLowerCase() === order.customer.address.toLowerCase()
      );
      if (!hasAddr) {
        existing.addresses.push({
          id: `addr-${Date.now()}`,
          tag: 'Delivery Address',
          name: order.customer.name,
          phone: order.customer.phone,
          address: order.customer.address,
          city: order.customer.city,
          state: order.customer.state,
          pincode: order.customer.pincode,
          isDefault: false,
        });
      }
      existing.name = order.customer.name; // sync latest name
      saveRegisteredUsers(allUsers);
    }

    // Auto-login so when customer goes to Account tab, their own account and order is visible!
    setCurrentUser(existing);
  } catch (err) {
    console.error('Failed to associate order with user', err);
  }
}

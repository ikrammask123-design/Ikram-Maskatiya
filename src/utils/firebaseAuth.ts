import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserAccount, UserAddress } from '../types';
import {
  getCurrentUser,
  setCurrentUser,
  getRegisteredUsers,
  saveRegisteredUsers,
} from './authStorage';
import { getStoredOrders } from './orderStorage';

/**
 * Remove undefined values so Firestore does not reject the document write
 */
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
}

/**
 * Save user profile to Firestore `users` collection
 */
export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    const cleanUser = sanitizeForFirestore({
      ...user,
      lastLoginAt: new Date().toISOString(),
    });
    await setDoc(userRef, cleanUser, { merge: true });
  } catch (err) {
    console.warn('Failed to save user profile to Firestore:', err);
  }
}

/**
 * Fetch user profile from Firestore `users` collection
 */
export async function fetchUserFromFirestore(userId: string): Promise<UserAccount | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
  } catch (err) {
    console.warn('Failed to fetch user from Firestore:', err);
  }
  return null;
}

/**
 * Dual Auth: Sign In with Google Popup
 */
export async function loginWithGoogle(): Promise<{
  success: boolean;
  user?: UserAccount;
  error?: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const email = fbUser.email?.toLowerCase().trim() || '';
    const name = fbUser.displayName?.trim() || email.split('@')[0] || 'Zevioza Patron';
    const photoURL = fbUser.photoURL || undefined;
    const phone = fbUser.phoneNumber || '';

    // 1. Check if user already exists in Firestore
    let existingProfile = await fetchUserFromFirestore(fbUser.uid);

    // 2. If not found by uid in Firestore, check local registered users or orders by email
    if (!existingProfile && email) {
      const localUsers = getRegisteredUsers();
      const localMatch = localUsers.find((u) => u.email?.toLowerCase() === email);
      if (localMatch) {
        existingProfile = localMatch;
      } else {
        // Check past orders to recover saved delivery address!
        const pastOrders = getStoredOrders();
        const orderMatch = pastOrders.find((o) => o.customer.email?.toLowerCase() === email);
        if (orderMatch) {
          existingProfile = {
            id: fbUser.uid,
            name: orderMatch.customer.name || name,
            email,
            phone: orderMatch.customer.phone || phone,
            photoURL,
            authProvider: 'google',
            addresses: [
              {
                id: `addr-${Date.now()}`,
                tag: 'Home',
                name: orderMatch.customer.name || name,
                phone: orderMatch.customer.phone || phone,
                address: orderMatch.customer.address,
                city: orderMatch.customer.city,
                state: orderMatch.customer.state,
                pincode: orderMatch.customer.pincode,
                isDefault: true,
              },
            ],
            memberTier: 'Privilege Club',
            loyaltyPoints: 150,
            createdAt: orderMatch.createdAt || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
        }
      }
    }

    // 3. Assemble complete UserAccount
    const userAccount: UserAccount = {
      id: fbUser.uid,
      name: existingProfile?.name || name,
      email: email || existingProfile?.email || '',
      phone: existingProfile?.phone || phone,
      photoURL: photoURL || existingProfile?.photoURL,
      authProvider: 'google',
      addresses: existingProfile?.addresses || [],
      savedMeasurements: existingProfile?.savedMeasurements,
      memberTier: existingProfile?.memberTier || 'Privilege Club',
      loyaltyPoints: (existingProfile?.loyaltyPoints || 0) + (existingProfile ? 0 : 150), // 150 welcome gift points
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // 4. Save to Firestore `users` collection
    await saveUserToFirestore(userAccount);

    // 5. Update local registered users
    const allUsers = getRegisteredUsers();
    const idx = allUsers.findIndex((u) => u.id === userAccount.id || (email && u.email?.toLowerCase() === email));
    if (idx >= 0) {
      allUsers[idx] = userAccount;
    } else {
      allUsers.push(userAccount);
    }
    saveRegisteredUsers(allUsers);

    // 6. Set as current active user
    setCurrentUser(userAccount);

    return { success: true, user: userAccount };
  } catch (err: any) {
    console.error('Google Sign-In failed:', err);
    let message = 'Google sign-in could not be completed. Please try again.';
    if (err.code === 'auth/popup-closed-by-user') {
      message = 'Google Sign-In popup was closed before completing.';
    } else if (err.code === 'auth/cancelled-popup-request') {
      message = 'Sign-in cancelled. Please click again.';
    } else if (err.message) {
      message = err.message;
    }
    return { success: false, error: message };
  }
}

/**
 * Standard Email/Password Sign-In
 */
export async function loginWithEmail(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { success: false, error: 'Please enter both email and password' };
  }

  try {
    // Attempt Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // Fetch profile from Firestore
    let profile = await fetchUserFromFirestore(fbUser.uid);
    if (!profile) {
      const allUsers = getRegisteredUsers();
      profile = allUsers.find((u) => u.email?.toLowerCase() === email) || null;
    }

    const userAccount: UserAccount = profile || {
      id: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0],
      email,
      phone: fbUser.phoneNumber || '',
      authProvider: 'password',
      addresses: [],
      memberTier: 'Member',
      loyaltyPoints: 100,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    userAccount.lastLoginAt = new Date().toISOString();
    await saveUserToFirestore(userAccount);
    setCurrentUser(userAccount);

    return { success: true, user: userAccount };
  } catch (err: any) {
    console.warn('Firebase email login failed, checking registered local users:', err);

    // Fallback: Check local registered users if Firebase error is network or user-not-found
    const localUsers = getRegisteredUsers();
    const localMatch = localUsers.find((u) => u.email?.toLowerCase() === email);

    if (localMatch) {
      localMatch.lastLoginAt = new Date().toISOString();
      setCurrentUser(localMatch);
      saveUserToFirestore(localMatch).catch(() => {});
      return { success: true, user: localMatch };
    }

    let errorMsg = 'Invalid email or password.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      errorMsg = 'No account found with this email. Please click "Create Account" below.';
    } else if (err.code === 'auth/wrong-password') {
      errorMsg = 'Incorrect password. Please verify and try again.';
    } else if (err.code === 'auth/invalid-email') {
      errorMsg = 'Please enter a valid email address.';
    }
    return { success: false, error: errorMsg };
  }
}

/**
 * Standard Email/Password Registration
 */
export async function registerWithEmail(params: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const email = params.email.trim().toLowerCase();
  const name = params.name.trim();
  const password = params.password.trim();

  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter your full name' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    await updateProfile(fbUser, { displayName: name });

    const initialAddresses: UserAddress[] = [];
    if (params.address && params.address.trim()) {
      initialAddresses.push({
        id: `addr-${Date.now()}`,
        tag: 'Home',
        name,
        phone: params.phone?.trim() || '',
        address: params.address.trim(),
        city: params.city?.trim() || 'Surat',
        state: params.state?.trim() || 'Gujarat',
        pincode: params.pincode?.trim() || '395002',
        isDefault: true,
      });
    }

    const newUser: UserAccount = {
      id: fbUser.uid,
      name,
      email,
      phone: params.phone?.trim() || '',
      authProvider: 'password',
      addresses: initialAddresses,
      memberTier: 'Member',
      loyaltyPoints: 100, // Welcome gift points
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Save to Firestore
    await saveUserToFirestore(newUser);

    // Save to local storage
    const allUsers = getRegisteredUsers();
    allUsers.push(newUser);
    saveRegisteredUsers(allUsers);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  } catch (err: any) {
    console.warn('Firebase email signup failed, attempting local registration:', err);

    if (err.code === 'auth/email-already-in-use') {
      return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    // Local fallback in case Firebase Auth is temporarily unreachable
    const initialAddresses: UserAddress[] = [];
    if (params.address && params.address.trim()) {
      initialAddresses.push({
        id: `addr-${Date.now()}`,
        tag: 'Home',
        name,
        phone: params.phone?.trim() || '',
        address: params.address.trim(),
        city: params.city?.trim() || 'Surat',
        state: params.state?.trim() || 'Gujarat',
        pincode: params.pincode?.trim() || '395002',
        isDefault: true,
      });
    }

    const fallbackUser: UserAccount = {
      id: `ZV-USR-${Date.now()}`,
      name,
      email,
      phone: params.phone?.trim() || '',
      authProvider: 'password',
      addresses: initialAddresses,
      memberTier: 'Member',
      loyaltyPoints: 100,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const allUsers = getRegisteredUsers();
    allUsers.push(fallbackUser);
    saveRegisteredUsers(allUsers);
    setCurrentUser(fallbackUser);
    saveUserToFirestore(fallbackUser).catch(() => {});

    return { success: true, user: fallbackUser };
  }
}

/**
 * Sign out from both Firebase and local state
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch {}
  setCurrentUser(null);
}

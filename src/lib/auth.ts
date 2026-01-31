import { db } from '@/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export async function isAdminEmail(email: string): Promise<boolean> {
  const q = query(collection(db, 'admins'), where('email', '==', email));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function registerAdmin(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  await addDoc(collection(db, 'admins'), {
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    role: 'admin', // Default role for auto-registered users
  });
}

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  User
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (method: string, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (method === "password") {
       await signInWithEmailAndPassword(auth, email, password);
    }
  };

  const signUp = async (formData: FormData) => {
     const email = formData.get("email") as string;
     const password = formData.get("password") as string;
     const name = formData.get("name") as string;
     
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     if (name) {
       await updateProfile(userCredential.user, { displayName: name });
       // Force update local state to reflect display name immediately if needed
       setUser({ ...userCredential.user, displayName: name });
     }
  };

  const signOut = () => firebaseSignOut(auth);

  return {
    isLoading,
    isAuthenticated: !!user,
    user: user ? {
      ...user,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      _id: user.uid, // Compatibility with existing code
      emailVerificationTime: user.emailVerified ? Date.now() : (user.uid ? Date.now() : undefined) // Mock verification for now or use user.emailVerified
    } : undefined,
    signIn,
    signUp,
    signOut,
  };
}
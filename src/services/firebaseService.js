import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project",
};

// Initialize Firebase (wrapped in try-catch to allow offline/mock development)
let app, auth, db;
export let isFirebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  if (firebaseConfig.apiKey !== "mock-key") {
    isFirebaseInitialized = true;
  }
} catch (error) {
  console.warn("Firebase failed to initialize. Falling back to localStorage.", error);
}

// Ensure user is signed in anonymously
export const getSafeUserId = async () => {
  if (!isFirebaseInitialized) return "local-demo-user";
  
  if (auth.currentUser) return auth.currentUser.uid;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (error) {
    console.error("Auth failed, using fallback ID", error);
    return "local-demo-user";
  }
};

export const saveVoiceProfile = async (profile) => {
  const userId = await getSafeUserId();
  const profileWithMeta = { ...profile, updatedAt: new Date().toISOString() };
  
  if (!isFirebaseInitialized) {
    localStorage.setItem(`voicerank_${userId}_profile`, JSON.stringify(profileWithMeta));
    return true;
  }

  try {
    await setDoc(doc(db, "users", userId), { voiceProfile: profileWithMeta }, { merge: true });
    // Also save backup to localStorage
    localStorage.setItem(`voicerank_${userId}_profile`, JSON.stringify(profileWithMeta));
    return true;
  } catch (error) {
    console.error("Firestore save failed, used localStorage fallback", error);
    localStorage.setItem(`voicerank_${userId}_profile`, JSON.stringify(profileWithMeta));
    return true; // Graceful fallback
  }
};

export const getVoiceProfile = async () => {
  const userId = await getSafeUserId();
  
  if (!isFirebaseInitialized) {
    const local = localStorage.getItem(`voicerank_${userId}_profile`);
    return local ? JSON.parse(local) : null;
  }

  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists() && docSnap.data().voiceProfile) {
      return docSnap.data().voiceProfile;
    }
    // Fallback to local
    const local = localStorage.getItem(`voicerank_${userId}_profile`);
    return local ? JSON.parse(local) : null;
  } catch (error) {
    console.error("Firestore read failed, checking localStorage", error);
    const local = localStorage.getItem(`voicerank_${userId}_profile`);
    return local ? JSON.parse(local) : null;
  }
};

export const saveBlog = async (blog) => {
  const userId = await getSafeUserId();
  const blogWithMeta = { ...blog, updatedAt: new Date().toISOString() };

  if (!isFirebaseInitialized) {
    localStorage.setItem(`voicerank_blog_current`, JSON.stringify(blogWithMeta));
    return blogWithMeta;
  }

  try {
    if (blog.id) {
      await updateDoc(doc(db, "users", userId, "blogs", blog.id), blogWithMeta);
    } else {
      const docRef = await addDoc(collection(db, "users", userId, "blogs"), {
        ...blogWithMeta,
        createdAt: new Date().toISOString()
      });
      blogWithMeta.id = docRef.id;
    }
    localStorage.setItem(`voicerank_blog_current`, JSON.stringify(blogWithMeta));
    return blogWithMeta;
  } catch (error) {
    console.error("Firestore save blog failed, used localStorage fallback", error);
    localStorage.setItem(`voicerank_blog_current`, JSON.stringify(blogWithMeta));
    return blogWithMeta;
  }
};

import {createContext, useState,useEffect} from 'react';
import { onAuthStateChanged, signInAnonymously} from '@react-native-firebase/auth';
import {doc, getDoc, setDoc, updateDoc} from '@react-native-firebase/firestore';
import {auth, db, serverTimestamp} from '@react-native-firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const isNewUser = !loading && user && !profile;

  useEffect(() => {
    setLoading(true); // start in the loading screen

    //listen to the changes of authentication
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try{ // check if user exist in the database
          const userRef = doc(db, 'profile', currentUser.uid);
          const snapShot = await getDoc(userRef);
        } catch (e) {
          console.error(`Anonymous Authentication Failed - ${e}`);
        }

      } else { // if user does not exist then sign in anonymously
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error(`Anonymous Authentication Failed - ${e}`);
        }
      }
      setLoading(false);
    });

  return unsubscribe;
  }, []);



}



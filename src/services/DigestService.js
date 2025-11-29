import {getFunctions, httpsCallable} from "@react-native-firebase/functions"
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from '@react-native-firebase/firestore';

const db = getFirestore();
const functions = getFunctions();

export const triggerManualDigest = async () => {
  try {
    const generateDigest = httpsCallable(functions, 'generateManualDigest');
    const result = await generateDigest();
    return result.data;
  } catch (e) {
    console.error("Failed to trigger digest: ", e);
    throw e;
  }
}

export const getLatestDigest = async (userId) => {
  try{
    const digestsRef = collection(db, 'digests');

    const queryToGetDigest = query(
      digestsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(queryToGetDigest);

    if (snapshot.empty) return null;

    return snapshot.docs[0].data();

  } catch (e) {
    console.error("Failed to getLatestDigest: ", e);
    throw e;
  }
}
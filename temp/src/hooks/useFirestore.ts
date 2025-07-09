import {useState, useEffect} from 'react';
import {collection, query, onSnapshot, QueryConstraint, type DocumentData} from 'firebase/firestore';
import {db} from '../services/firebase';
import type {Booking} from '../types/booking';

/**
 * Generic hook for real-time Firestore collections
 */
export const useFirestoreCollection = <T = DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const documents = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as T[];

                setData(documents);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error(`Error listening to ${collectionName}:`, err);
                setError(`Грешка при зареждане на данните: ${err.message}`);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, constraints]);

    return {data, loading, error};
};

/**
 * Hook for real-time appointments
 */
export const useRealtimeAppointments = (constraints: QueryConstraint[] = []) => {
    return useFirestoreCollection<Booking>('appointments', constraints);
};

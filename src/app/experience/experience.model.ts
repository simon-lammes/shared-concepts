// @ts-ignore
import Timestamp from 'firebase/firestore';

export interface Experience {
    correctStreak: number;
    lastTimeSeen: Timestamp;
    conceptKey: string;
}

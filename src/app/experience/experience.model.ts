import Timestamp = firebase.firestore.Timestamp;

export interface Experience {
    correctStreak: number;
    lastTimeSeen: Timestamp;
    conceptKey: string;
}

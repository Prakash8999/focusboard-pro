export interface LearningTopic {
    id: string;
    userId: string;
    title: string;
    completed: boolean;
    createdAt: number;
    completedAt?: number;
}

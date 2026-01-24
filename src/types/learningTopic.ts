export interface LearningTopic {
    id: string;
    userId: string;
    title: string;
    groupTitle?: string; // Optional group/category title
    completed: boolean;
    createdAt: number;
    completedAt?: number;
}

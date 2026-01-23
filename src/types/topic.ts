export interface Topic {
    id: string;
    userId: string;
    title: string;
    content: string;
    images: string[]; // Cloudinary URLs
    linkedTaskIds: string[]; // References to kanban tasks
    createdAt: number;
    updatedAt: number;
}

export interface KanbanTask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "blocked" | "done";
    linkedTopicId?: string; // Reference to topic
    createdAt: number;
    completedAt?: number;
    blockedReason?: string;
}

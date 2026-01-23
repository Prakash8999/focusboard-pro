import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LearningTopic } from "@/types/learningTopic";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function LearningTopicsPage() {
    const { user } = useAuth();
    const [topics, setTopics] = useState<LearningTopic[]>([]);
    const [newTopic, setNewTopic] = useState("");
    const [bulkTopics, setBulkTopics] = useState("");
    const [showBulkAdd, setShowBulkAdd] = useState(false);

    useEffect(() => {
        if (!user?._id) return;

        const q = query(
            collection(db, "learningTopics"),
            where("userId", "==", user._id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const topicsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as LearningTopic[];

            // Sort: incomplete first, then by creation date
            topicsData.sort((a, b) => {
                if (a.completed === b.completed) {
                    return b.createdAt - a.createdAt;
                }
                return a.completed ? 1 : -1;
            });

            setTopics(topicsData);
        });

        return () => unsubscribe();
    }, [user?._id]);

    const handleAddTopic = async () => {
        if (!user?._id || !newTopic.trim()) return;

        try {
            const topicRef = doc(db, "learningTopics", crypto.randomUUID());
            await setDoc(topicRef, {
                userId: user._id,
                title: newTopic.trim(),
                completed: false,
                createdAt: Date.now(),
            });
            setNewTopic("");
            toast.success("Topic added");
        } catch (error) {
            console.error("Failed to add topic:", error);
            toast.error("Failed to add topic");
        }
    };

    const handleBulkAdd = async () => {
        if (!user?._id || !bulkTopics.trim()) return;

        const lines = bulkTopics
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (lines.length === 0) return;

        try {
            for (const line of lines) {
                const topicRef = doc(db, "learningTopics", crypto.randomUUID());
                await setDoc(topicRef, {
                    userId: user._id,
                    title: line,
                    completed: false,
                    createdAt: Date.now(),
                });
            }
            setBulkTopics("");
            setShowBulkAdd(false);
            toast.success(`Added ${lines.length} topics`);
        } catch (error) {
            console.error("Failed to add topics:", error);
            toast.error("Failed to add topics");
        }
    };

    const handleToggleComplete = async (topicId: string, completed: boolean) => {
        try {
            const topicRef = doc(db, "learningTopics", topicId);
            await updateDoc(topicRef, {
                completed: !completed,
                completedAt: !completed ? Date.now() : null,
            });
        } catch (error) {
            console.error("Failed to update topic:", error);
            toast.error("Failed to update topic");
        }
    };

    const handleDelete = async (topicId: string) => {
        try {
            await deleteDoc(doc(db, "learningTopics", topicId));
            toast.success("Topic deleted");
        } catch (error) {
            console.error("Failed to delete topic:", error);
            toast.error("Failed to delete topic");
        }
    };

    const completedCount = topics.filter(t => t.completed).length;
    const totalCount = topics.length;

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-4 md:px-6 py-4 space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Learning Topics</h2>
                        <p className="text-sm text-muted-foreground">
                            {completedCount} of {totalCount} completed
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowBulkAdd(!showBulkAdd)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Bulk Add
                    </Button>
                </div>

                {/* Bulk Add */}
                {showBulkAdd && (
                    <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                        <Textarea
                            placeholder="Paste topics here (one per line)..."
                            value={bulkTopics}
                            onChange={(e) => setBulkTopics(e.target.value)}
                            className="min-h-[120px]"
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleBulkAdd} size="sm">
                                Add All
                            </Button>
                            <Button
                                onClick={() => {
                                    setBulkTopics("");
                                    setShowBulkAdd(false);
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Add Single Topic */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a learning topic..."
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                    />
                    <Button onClick={handleAddTopic} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>
                </div>
            </div>

            {/* Topics List */}
            <div className="flex-1 overflow-y-auto">
                {topics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <p className="text-muted-foreground mb-4">No learning topics yet</p>
                        <p className="text-sm text-muted-foreground">
                            Add topics to track your learning progress
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {topics.map((topic) => (
                            <div
                                key={topic.id}
                                className="flex items-center gap-3 px-4 md:px-6 py-3 hover:bg-muted/50 transition-colors group"
                            >
                                <Checkbox
                                    checked={topic.completed}
                                    onCheckedChange={() => handleToggleComplete(topic.id, topic.completed)}
                                />
                                <span
                                    className={`flex-1 ${topic.completed ? "line-through text-muted-foreground" : ""}`}
                                >
                                    {topic.title}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(topic.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

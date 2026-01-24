import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LearningTopic } from "@/types/learningTopic";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function LearningTopicsPage() {
    const { user } = useAuth();
    const [topics, setTopics] = useState<LearningTopic[]>([]);
    const [newTopic, setNewTopic] = useState("");
    const [newTopicGroupTitle, setNewTopicGroupTitle] = useState("");
    const [bulkTopics, setBulkTopics] = useState("");
    const [bulkGroupTitle, setBulkGroupTitle] = useState("");
    const [showBulkAdd, setShowBulkAdd] = useState(false);
    const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingGroupTitle, setEditingGroupTitle] = useState("");

    // Get unique group titles from existing topics
    const existingGroupTitles = Array.from(
        new Set(topics.filter(t => t.groupTitle).map(t => t.groupTitle!))
    ).sort();

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

            // Sort by creation date only (newest first)
            topicsData.sort((a, b) => b.createdAt - a.createdAt);

            setTopics(topicsData);
        });

        return () => unsubscribe();
    }, [user?._id]);

    const handleAddTopic = async () => {
        if (!user?._id || !newTopic.trim()) return;

        try {
            const topicRef = doc(db, "learningTopics", crypto.randomUUID());
            const topicData: any = {
                userId: user._id,
                title: newTopic.trim(),
                completed: false,
                createdAt: Date.now(),
            };

            if (newTopicGroupTitle.trim()) {
                topicData.groupTitle = newTopicGroupTitle.trim();
            }

            await setDoc(topicRef, topicData);
            setNewTopic("");
            setNewTopicGroupTitle("");
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
                const topicData: any = {
                    userId: user._id,
                    title: line,
                    completed: false,
                    createdAt: Date.now(),
                };

                if (bulkGroupTitle.trim()) {
                    topicData.groupTitle = bulkGroupTitle.trim();
                }

                await setDoc(topicRef, topicData);
            }
            setBulkTopics("");
            setBulkGroupTitle("");
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

    const startEditing = (topic: LearningTopic) => {
        setEditingTopicId(topic.id);
        setEditingTitle(topic.title);
        setEditingGroupTitle(topic.groupTitle || "");
    };

    const cancelEditing = () => {
        setEditingTopicId(null);
        setEditingTitle("");
        setEditingGroupTitle("");
    };

    const saveEditing = async () => {
        if (!editingTopicId || !editingTitle.trim()) return;

        try {
            const topicRef = doc(db, "learningTopics", editingTopicId);
            const updateData: any = {
                title: editingTitle.trim(),
            };

            if (editingGroupTitle.trim()) {
                updateData.groupTitle = editingGroupTitle.trim();
            } else {
                // Remove groupTitle if empty
                updateData.groupTitle = null;
            }

            await updateDoc(topicRef, updateData);
            toast.success("Topic updated");
            cancelEditing();
        } catch (error) {
            console.error("Failed to update topic:", error);
            toast.error("Failed to update topic");
        }
    };

    // Group topics by groupTitle
    const groupedTopics = topics.reduce((acc, topic) => {
        const key = topic.groupTitle || "__ungrouped__";
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(topic);
        return acc;
    }, {} as Record<string, LearningTopic[]>);

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
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Group Title (Optional)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter group title..."
                                    value={bulkGroupTitle}
                                    onChange={(e) => setBulkGroupTitle(e.target.value)}
                                />
                                {existingGroupTitles.length > 0 && (
                                    <Select
                                        value={bulkGroupTitle}
                                        onValueChange={setBulkGroupTitle}
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Or select existing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {existingGroupTitles.map((title) => (
                                                <SelectItem key={title} value={title}>
                                                    {title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
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
                                    setBulkGroupTitle("");
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
                <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Group title (optional)..."
                            value={newTopicGroupTitle}
                            onChange={(e) => setNewTopicGroupTitle(e.target.value)}
                            className="flex-1"
                        />
                        {existingGroupTitles.length > 0 && (
                            <Select
                                value={newTopicGroupTitle}
                                onValueChange={setNewTopicGroupTitle}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Or select existing" />
                                </SelectTrigger>
                                <SelectContent>
                                    {existingGroupTitles.map((title) => (
                                        <SelectItem key={title} value={title}>
                                            {title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
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
                    <div className="p-4 md:p-6 space-y-4">
                        {Object.entries(groupedTopics).map(([groupKey, groupTopics]) => {
                            const hasGroupTitle = groupKey !== "__ungrouped__";

                            return (
                                <div key={groupKey}>
                                    {hasGroupTitle && (
                                        <h3 className="text-sm font-semibold mb-2 px-2 text-primary">
                                            {groupKey}
                                        </h3>
                                    )}
                                    <div
                                        className={
                                            hasGroupTitle
                                                ? "bg-muted/30 rounded-lg border shadow-sm p-3 space-y-2"
                                                : "space-y-2"
                                        }
                                    >
                                        {groupTopics.map((topic) => (
                                            <div
                                                key={topic.id}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-md transition-colors group"
                                            >
                                                {editingTopicId === topic.id ? (
                                                    <>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder="Group title (optional)..."
                                                                    value={editingGroupTitle}
                                                                    onChange={(e) => setEditingGroupTitle(e.target.value)}
                                                                    className="flex-1"
                                                                />
                                                                {existingGroupTitles.length > 0 && (
                                                                    <Select
                                                                        value={editingGroupTitle}
                                                                        onValueChange={setEditingGroupTitle}
                                                                    >
                                                                        <SelectTrigger className="w-[180px]">
                                                                            <SelectValue placeholder="Select group" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {existingGroupTitles.map((title) => (
                                                                                <SelectItem key={title} value={title}>
                                                                                    {title}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            </div>
                                                            <Input
                                                                placeholder="Topic title..."
                                                                value={editingTitle}
                                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") saveEditing();
                                                                    if (e.key === "Escape") cancelEditing();
                                                                }}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={saveEditing}
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={cancelEditing}
                                                                className="text-muted-foreground hover:text-foreground"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Checkbox
                                                            checked={topic.completed}
                                                            onCheckedChange={() => handleToggleComplete(topic.id, topic.completed)}
                                                        />
                                                        <span
                                                            className={`flex-1 ${topic.completed ? "line-through text-muted-foreground" : ""}`}
                                                        >
                                                            {topic.title}
                                                        </span>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => startEditing(topic)}
                                                                className="text-muted-foreground hover:text-foreground"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(topic.id)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

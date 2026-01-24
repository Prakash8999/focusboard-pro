import { useState, useEffect } from "react";
import { Search, Clock, Plus, ArrowLeft, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/topic";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { TopicEditor } from "./TopicEditor";

interface TopicsPageProps {
    selectedTopicId?: string;
    onTopicSelect: (topicId: string | undefined) => void;
}

export function TopicsPage({ selectedTopicId, onTopicSelect }: TopicsPageProps) {
    const { user } = useAuth();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTopic, setSelectedTopic] = useState<Topic | undefined>();
    const [loadingTopic, setLoadingTopic] = useState(false);

    useEffect(() => {
        if (!user?._id) return;

        const q = query(
            collection(db, "topics"),
            where("userId", "==", user._id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const topicsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Topic[];

            // Sort by updatedAt on client side (no Firestore index needed)
            topicsData.sort((a, b) => b.updatedAt - a.updatedAt);

            setTopics(topicsData);
        });

        return () => unsubscribe();
    }, [user?._id]);

    // Fetch full topic data by ID when opening
    useEffect(() => {
        if (!selectedTopicId || selectedTopicId === "new") {
            setSelectedTopic(undefined);
            return;
        }

        const fetchTopicById = async () => {
            setLoadingTopic(true);
            try {
                const topicDocRef = doc(db, "topics", selectedTopicId);
                const topicDoc = await getDoc(topicDocRef);
                if (topicDoc.exists()) {
                    setSelectedTopic({ id: topicDoc.id, ...topicDoc.data() } as Topic);
                }
            } catch (error) {
                console.error("Failed to fetch topic:", error);
            } finally {
                setLoadingTopic(false);
            }
        };

        fetchTopicById();
    }, [selectedTopicId]);

    // Client-side search - only search if query length >= 3
    const filteredTopics = topics.filter((topic) => {
        const trimmedQuery = searchQuery.trim();

        // Show all topics if search query is empty or less than 3 characters
        if (!trimmedQuery || trimmedQuery.length < 3) return true;

        const query = trimmedQuery.toLowerCase();
        // Only search in title (content not loaded in list for performance)
        return topic.title.toLowerCase().includes(query);
    });

    const handleNewTopic = () => {
        onTopicSelect("new");
    };

    const handleBackToList = () => {
        onTopicSelect(undefined);
    };

    const handleTopicSaved = () => {
        // Stay on editor after save, or go back to list
        // onTopicSelect(undefined);
    };

    const handleDeleteTopic = async (topicId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the topic

        if (!confirm("Are you sure you want to delete this topic? This cannot be undone.")) {
            return;
        }

        try {
            await import("firebase/firestore").then(m => m.deleteDoc(doc(db, "topics", topicId)));
            import("sonner").then(m => m.toast.success("Topic deleted"));
        } catch (error) {
            console.error("Failed to delete topic:", error);
            import("sonner").then(m => m.toast.error("Failed to delete topic"));
        }
    };

    // Show editor if a topic is selected or creating new
    if (selectedTopicId) {
        // Show loading while fetching topic data
        if (loadingTopic && selectedTopicId !== "new") {
            return (
                <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Loading topic...</p>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col">
                <TopicEditor
                    topicId={selectedTopicId === "new" ? undefined : selectedTopicId}
                    initialTopic={selectedTopic}
                    onSave={handleTopicSaved}
                    onBack={handleBackToList}
                />
            </div>
        );
    }

    // Show topics list
    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-4 md:px-6 py-4 space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">All Topics</h2>
                    <Button onClick={handleNewTopic} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Topic
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search topics (min 3 characters)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Topics List */}
            <div className="flex-1 overflow-y-auto">
                {filteredTopics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? "No topics found" : "No topics yet"}
                        </p>
                        {!searchQuery && (
                            <Button onClick={handleNewTopic} variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Create your first topic
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="p-4 md:p-6 space-y-3">
                        {filteredTopics.map((topic) => (
                            <div
                                key={topic.id}
                                className="flex items-center gap-3 px-4 md:px-6 py-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                            >
                                <button
                                    onClick={() => onTopicSelect(topic.id)}
                                    className="flex-1 text-left"
                                >
                                    <h3 className="font-medium mb-2 line-clamp-1">{topic.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(topic.updatedAt, { addSuffix: true })}
                                        </div>
                                        {topic.linkedTaskIds.length > 0 && (
                                            <div>
                                                {topic.linkedTaskIds.length} linked task{topic.linkedTaskIds.length !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                </button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleDeleteTopic(topic.id, e)}
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

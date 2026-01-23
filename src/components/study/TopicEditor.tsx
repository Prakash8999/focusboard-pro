import { useState, useEffect } from "react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader, ImagePreview } from "./ImageUploader";
import { LinkedTasksPanel } from "./LinkedTasksPanel";
import { Topic } from "@/types/topic";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface TopicEditorProps {
    topicId?: string;
    initialTopic?: Topic;
    onSave?: () => void;
    onBack?: () => void;
}

export function TopicEditor({ topicId, initialTopic, onSave, onBack }: TopicEditorProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState(initialTopic?.title || "");
    const [content, setContent] = useState(initialTopic?.content || "");
    const [images, setImages] = useState<string[]>(initialTopic?.images || []);
    const [linkedTaskIds, setLinkedTaskIds] = useState<string[]>(initialTopic?.linkedTaskIds || []);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (initialTopic) {
            setTitle(initialTopic.title);
            setContent(initialTopic.content);
            setImages(initialTopic.images);
            setLinkedTaskIds(initialTopic.linkedTaskIds);
            setHasChanges(false);
        }
    }, [initialTopic]);

    useEffect(() => {
        setHasChanges(true);
    }, [title, content, images, linkedTaskIds]);

    const handleSave = async () => {
        if (!user?._id) return;
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        setSaving(true);
        try {
            const topicData = {
                userId: user._id,
                title: title.trim(),
                content: content.trim(),
                images,
                linkedTaskIds,
                updatedAt: Date.now(),
            };

            if (topicId) {
                // Update existing topic
                const topicRef = doc(db, "topics", topicId);
                await updateDoc(topicRef, topicData);
                toast.success("Topic updated");
            } else {
                // Create new topic
                const newTopicRef = doc(db, "topics", crypto.randomUUID());
                await setDoc(newTopicRef, {
                    ...topicData,
                    createdAt: Date.now(),
                });
                toast.success("Topic created");
            }

            setHasChanges(false);
            onSave?.();
        } catch (error: any) {
            toast.error("Failed to save topic", { description: error.message });
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUploaded = (url: string) => {
        setImages([...images, url]);
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleTasksLinked = (taskIds: string[]) => {
        setLinkedTaskIds(taskIds);
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                    )}
                    <h2 className="text-lg font-semibold">
                        {topicId ? "Edit Topic" : "New Topic"}
                    </h2>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    size="sm"
                    className="gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save
                        </>
                    )}
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <Input
                            placeholder="Topic Title (e.g., CAP Theorem)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <Textarea
                            placeholder="Write your notes here... No limits on length. Use this space for deep learning notes, code snippets, explanations, etc."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[400px] resize-none border-0 px-0 focus-visible:ring-0 text-base leading-relaxed"
                        />
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Images</h3>
                            <ImageUploader onImageUploaded={handleImageUploaded} />
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {images.map((url, index) => (
                                    <ImagePreview
                                        key={index}
                                        url={url}
                                        onRemove={() => handleRemoveImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Linked Tasks */}
                    <div className="border-t pt-6">
                        <LinkedTasksPanel
                            topicId={topicId}
                            linkedTaskIds={linkedTaskIds}
                            onTasksLinked={handleTasksLinked}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

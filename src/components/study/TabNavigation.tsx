import { BookOpen, KanbanSquare, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "topics" | "learning" | "kanban";

interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    const tabs = [
        { id: "topics" as TabType, label: "Topics", icon: BookOpen },
        { id: "learning" as TabType, label: "Learning Topics", icon: CheckSquare },
        { id: "kanban" as TabType, label: "Kanban", icon: KanbanSquare },
    ];

    return (
        <div className="border-b bg-card/50 backdrop-blur-xl">
            <div className="flex items-center gap-1 px-4 md:px-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative",
                                "hover:text-foreground",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>

                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

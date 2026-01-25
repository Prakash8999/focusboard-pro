import { BookOpen, KanbanSquare, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "topic" | "list" | "kanban";

interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    const tabs = [
        { id: "topic" as TabType, label: "Topics", shortLabel: "Topics", icon: BookOpen },
        { id: "list" as TabType, label: "Learning Topics", shortLabel: "Learning", icon: CheckSquare },
        { id: "kanban" as TabType, label: "Kanban", shortLabel: "Kanban", icon: KanbanSquare },
    ];

    return (
        <>
            {/* Desktop - Top Tabs (hidden on mobile) */}
            <div className="hidden md:block border-b bg-card/50 backdrop-blur-xl">
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
                                <span>{tab.label}</span>

                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Mobile - Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl">
                <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-300 relative flex-1",
                                    "active:scale-95",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-500"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {/* Icon */}
                                <Icon className="w-5 h-5 transition-all duration-300" />

                                {/* Label */}
                                <span className={cn(
                                    "text-[10px] font-medium transition-all duration-300",
                                    isActive ? "font-semibold" : "font-normal"
                                )}>
                                    {tab.shortLabel}
                                </span>

                                {/* Active Underline */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 dark:bg-blue-500 rounded-full animate-in slide-in-from-bottom-2 duration-200" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

import { Doc, Id } from "@/convex/_generated/dataModel";
import { TaskCard } from "./TaskCard";
import { TaskStatus } from "./Board";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  color: string;
  tasks: Doc<"tasks">[];
  onDragStart: (taskId: Id<"tasks">) => void;
  onDrop: () => void;
}

export function KanbanColumn({ id, label, color, tasks, onDragStart, onDrop }: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col rounded-xl border bg-card/50 backdrop-blur-sm transition-colors",
        id === "in_progress" && "border-blue-200 dark:border-blue-900",
        id === "blocked" && "border-red-200 dark:border-red-900",
        id === "done" && "border-green-200 dark:border-green-900"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("bg-accent/50");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("bg-accent/50");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-accent/50");
        onDrop();
      }}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", 
            id === "todo" && "bg-slate-400",
            id === "in_progress" && "bg-blue-500",
            id === "blocked" && "bg-red-500",
            id === "done" && "bg-green-500"
          )} />
          <h3 className="font-semibold tracking-tight text-sm uppercase text-muted-foreground">
            {label}
          </h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDragStart={onDragStart} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

//taskOptions.tsx
import { deleteTask } from "../../services/apiService";
import { Trash, Pencil } from "lucide-react";
import { TaskOptionsProps } from "../../types/types";

export default function TaskOptions({ task, onDelete, onEdit }: TaskOptionsProps) {
    const handleDelete = async () => {
        try {
            await deleteTask(task.taskId as number);
            onDelete();
            alert("Task deleted successfully!");
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Task deletion failed!");
        }
    };

    return (
        <>
          <div className="flex gap-2 z-50">
          <button className="btn btn-ghost btn-warning" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </button>
            <button className="btn btn-ghost btn-error" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </>
      );
    }
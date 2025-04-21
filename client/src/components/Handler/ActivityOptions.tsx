//ActivityOptions.tsx
import { deleteActivity } from "../../services/apiService";
import { Trash, Pencil } from "lucide-react";
import { ActivityOptionsProps } from "../../types/types";

export default function ActivityOptions({ activity, onDelete, onEdit }: ActivityOptionsProps) {
    const handleDelete = async () => {
        try {
            await deleteActivity(activity.activityId as number);
            onDelete();
            alert("Activity deleted successfully!");
        } catch (error) {
            console.error("Failed to delete activity:", error);
            alert("Activity deletion failed!");
        }
    };

    return ( 
        <>
          <div className="flex gap-2 z-50">
          <button className="btn btn-ghost btn-warning" onClick={() => onEdit(activity)}>
            <Pencil className="h-4 w-4" />
          </button>
            <button className="btn btn-ghost btn-error" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </>
      );
    }
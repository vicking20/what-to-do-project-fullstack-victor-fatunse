//taskeditmodal.tsx
import { useState, useEffect } from "react";
import { getActivities, updateTask } from "../../services/apiService";
import { TaskEditModalProps } from "../../types/types";
import { ActivityModel } from "../../types/types";

export default function TaskEditModal({ task, onTaskUpdated }: TaskEditModalProps) { 
    const [name, setName] = useState(task.name);
    const [content, setContent] = useState(task.content);
    const [startDate, setStartDate] = useState(task.startDate || "");
    const [endDate, setEndDate] = useState(task.endDate || "");
    const [status, setStatus] = useState(task.status);
    const [activityId, setActivityId] = useState<number | null>(task.activityId);
    const [activities, setActivities] = useState<ActivityModel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setActivities(data);
            } catch (error) {
                console.error("Error loading activities:", error);
                alert("Could not load activities");
            }
        };
        fetchActivities();
    }, []);

    const handleUpdate = async () => {
        if (!name || !content) {
            alert("Some fields are required!");
            return;
        }
        setLoading(true);
        try {
            await updateTask({
                taskId: task.taskId, 
                name,
                content,
                startDate,
                endDate,
                status,
                activityId,
        });
        alert("Task Updated");
        (document.getElementById(`task_edit_modal_${task.taskId}`) as HTMLDialogElement)?.close();
        onTaskUpdated();
    } catch (error) {
        alert("Failed to update task");
        console.error(error);
    } finally {
        setLoading(false);
    }
   };

   return (
    <dialog id={`task_edit_modal}`} className="modal">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Edit Task</h3>
      <input
        type="text"
        className="input input-bordered w-full mt-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full mt-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="date"
        className="input input-bordered w-full mt-4"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className="input input-bordered w-full mt-4"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <select
        className="select select-bordered w-full mt-4"
        value={status}
        onChange={(e) => setStatus(parseInt(e.target.value))}
      >
        <option value={0}>New</option>
        <option value={1}>In Progress</option>
        <option value={2}>Done</option>
      </select>
      <select
        className="select select-bordered w-full mt-4"
        value={activityId || ""}
        onChange={(e) => setActivityId(Number(e.target.value) || null)}
      >
        <option value="">Select Activity</option>
        {activities.map((a) => (
          <option key={a.activityId} value={a.activityId}>
            {a.name}
          </option>
        ))}
      </select>
      <div className="modal-action">
        <button
          className="btn btn-secondary"
          onClick={() => (document.getElementById(`task_edit_modal_${task.taskId}`) as HTMLDialogElement)?.close()}
        >
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Task"}
        </button>
      </div>
    </div>
  </dialog>
   );
}
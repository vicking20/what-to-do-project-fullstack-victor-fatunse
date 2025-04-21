import { useState, useEffect } from "react";
import { createTask, getActivities } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { TaskStatusEnum } from "../../types/types";

interface NewTaskModalProps {
    onTaskCreated: () => void;
}

export default function NewTaskModal({ onTaskCreated }: NewTaskModalProps) {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.New);
    const [activityId, setActivityId] = useState<number | null>(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate= useNavigate()

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setActivities(data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };
        fetchActivities();
    }, []);

    const handleSubmit = async () => {
        if (!name || !content || !startDate || !endDate) {
            alert("All fields are required!");
            return;
        }
        setLoading(true);
        
        try {
            await createTask({ name, content, startDate, endDate, status, activityId });
            alert("Task created successfully!");
            setName("");
            setContent(""); 
            setStartDate("");
            setEndDate("");
            setStatus(0);
            setActivityId(null);
            (document.getElementById("task_modal_1") as HTMLDialogElement).close();
            onTaskCreated();
            navigate(0);
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="task_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    New Task
                </h3>
                <input type="text"
                placeholder="Task Name"
                className="input input-bordered w-full mt-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <textarea
                placeholder="Task Description"
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
                className="seelct select-bordered w-full mt-4"
                value={status}
                onChange={(e) => setStatus(Number(e.target.value) as TaskStatusEnum)}
                >
                    <option value={TaskStatusEnum.New}>New</option>
                    <option value={TaskStatusEnum.InProgress}>In Progress</option>
                    <option value={TaskStatusEnum.Done}>Done</option>
                </select>

                <select
                className="select select-bordered w-full mt-4"
                value={activityId || ""}
                onChange={(e) => setActivityId(Number(e.target.value) || null)}
                >
                    <option value="">Select Activity</option>
                    {activities.map((activity) => (
                        <option key={activity.activityId} value={activity.activityId}>
                            {activity.name}
                        </option>
                    ))}
                </select>
                <div className="modal-action">
                    <button
                        className="btn btn-secondary"
                        onClick={() => (document.getElementById("task_modal_1") as HTMLDialogElement | null)?.close()}
                        >
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating...": "Create Task"}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

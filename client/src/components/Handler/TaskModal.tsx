//taskmodal.tsx
import { useState, useEffect } from "react";
import { TaskModel, TaskStatusEnum } from "../../types/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskModel) => void;
  initialData?: TaskModel;
  mode: "create" | "update";
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const [taskData, setTaskData] = useState<TaskModel>({
    taskId: "",
    name: "",
    content: "",
    startDate: "",
    endDate: "",
    status: TaskStatusEnum.New,
  });

  useEffect(() => {
    if (mode === "update" && initialData) {
      setTaskData(initialData);
    }
  }, [initialData, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: name === "status" ? Number(value) : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taskData); 
    onClose();
  };

  const handleTaskSubmit = (taskData: TaskModel) => {
    console.log("Task Submitted:", taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-500 bg-opacity-10 flex justify-center items-center z-20">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{mode === "create" ? "Create Task" : "Update Task"}</h2>
          <button onClick={onClose} className="text-lg font-bold">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">Task Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={taskData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="content">Task Content</label>
            <textarea
              id="content"
              name="content"
              value={taskData.content}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={taskData.startDate}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={taskData.endDate}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="status">Task Status</label>
            <select
              id="status"
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="input input-bordered w-full"
            >
              <option value={TaskStatusEnum.New}>New</option>
              <option value={TaskStatusEnum.InProgress}>In Progress</option>
              <option value={TaskStatusEnum.Done}>Done</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {mode === "create" ? "Create Task" : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

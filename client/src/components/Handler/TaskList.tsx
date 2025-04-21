// components/TaskList.tsx
import React from "react";
import { useState } from "react";
import { TaskModel } from "../../types/types";
import TaskModal from "./TaskModal";

interface TaskListProps {
  taskList: TaskModel[];
  onDeleteTask: (task: TaskModel) => void;
  onUpdateTask: (updatedTask: TaskModel) => void;
}

const TaskList: React.FC<TaskListProps> = ({ taskList, onDeleteTask, onUpdateTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);

  const getStatusColour = (status: number) => {
    switch (status) {
      case 0:
        return "bg-blue-100";
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-green-500";
    }
  };
  const handleUpdateClick = (task: TaskModel) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };


  return (
    <div>
      <ul className="space-y-4 mt-4">
        {taskList.map((task) => (
          <li
            key={task.taskId}
            className="flex justify-between items-center p-4 rounded-md shadow-md hover:bg-gray-200 transition"
          >
            <span className={`w-3.5 h-3.5 rounded-full ${getStatusColour(task.status)} mr-4`}></span>
            <span className="text-lg font-semibold">{task.name}</span>

            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                onClick={() => handleUpdateClick(task)}
              >
                Update
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                onClick={() => onDeleteTask(task)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onUpdateTask}
          initialData={selectedTask}
          mode="update"
        />
      )}
    </div>
  );
};

export default TaskList;

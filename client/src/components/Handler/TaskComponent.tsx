import { Plus } from "lucide-react";
import NewActivityModal from "./NewActivityModal";
import NewTaskModal from "./NewTaskModal";
import { useEffect, useState, useRef } from "react";
import { getActivities, getTasks } from "../../services/apiService";

export default function TaskComponent() {

  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error("Error fecthing activities:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fecthing tasks:", error);
    }
  };

  useEffect(() => {
    loadActivities();
    loadTasks();
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey((oldKey) => oldKey + 1)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4 gap-2">
        <button className="btn" onClick={() => document.getElementById("activity_modal_1").showModal()}>
          <Plus className="h-4 w-4" />
          New Activity
        </button>
        <button className="btn" onClick={() => document.getElementById("task_modal_1").showModal()}>
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>
      <NewActivityModal onActivityCreated={refreshData} />
      <NewTaskModal onTaskCreated={refreshData} />
    </div>
  );
}
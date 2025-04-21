import { Plus } from "lucide-react";
import NewActivityModal from "./NewActivityModal";
import NewTaskModal from "./NewTaskModal";
import { useEffect, useState } from "react";
import { getActivities, getTasks } from "../../services/apiService";

export default function TaskComponent() {

  const [, setActivities] = useState([]);
  const [, setTasks] = useState([]);
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

  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };  

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4 gap-2"> 
        <button className="btn" onClick={() => openModal("activity_modal_1")}>
          <Plus className="h-4 w-4" />
          New Activity
        </button>
        <button className="btn" onClick={() => openModal("task_modal_1")}>
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>
      <NewActivityModal onActivityCreated={refreshData} />
      <NewTaskModal onTaskCreated={refreshData} />
    </div>
  );
}
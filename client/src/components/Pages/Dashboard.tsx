//Dashboard.tsx
//displays this page for users to see a brief overview of their tasks
import { useEffect, useState } from "react";
import TaskChart from "../Misc/TaskChart";
import { getTasks } from "../../services/apiService";
import { TaskModel } from "../../types/types";


export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [statusCount, setStatusCount] = useState({ Pending: 0, InProgress: 0, Completed: 0 });

  useEffect(() => {
    const fetchData = async() => {
      try {
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchData();
  }, []);
 
  useEffect(() => {
    const counts = { Pending: 0, InProgress: 0, Completed: 0 };
    tasks.forEach((task) => {
      if (task.status === 0) counts.Pending++;
      else if (task.status === 1) counts.InProgress++;
      else if (task.status === 2) counts.Completed++;
    });
    setStatusCount(counts);
  }, [tasks])
  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <div className="h-10"></div>
      <TaskChart statusCount={statusCount} />
    </div>
  )
}
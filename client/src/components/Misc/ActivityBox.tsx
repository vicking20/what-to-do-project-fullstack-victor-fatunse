import { useEffect, useState } from "react";
import { ArrowDown, Calendar, CheckCircle, Ellipsis, Search, SortAsc, Filter } from "lucide-react";
import { getTasks, getActivities, updateTask } from "../../services/apiService";  
import { ActivityModel, TaskModel } from "../../types/types";
import TaskOptions from "../Handler/TaskOptions";
import TaskModal from "../Handler/TaskModal";
import TaskComponent from "../Handler/TaskComponent";
import ActivityOptions from "../Handler/ActivityOptions";
import EditActivityModal from "../Handler/EditActivityModal";

export default function ActivityBox() {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskModel | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [viewMode, setViewMode] = useState("grouped");
  const [sortBy, setSortBy] = useState("default");
  const [isEditActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel | null>(null);
  const [openActivityOptionsId, setOpenActivityOptionsId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    activityId: "all"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage, setActivitiesPerPage] = useState(9);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, activitiesData] = await Promise.all([getTasks(), getActivities()]);
        setTasks(tasksData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setActivities(prev => prev.filter(a => a.activityId !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === "all" || 
      (filters.status === "new" && task.status === 0) ||
      (filters.status === "inProgress" && task.status === 1) ||
      (filters.status === "done" && task.status === 2);
    
    let matchesDateRange = true;
    const today = new Date();
    const taskDate = task.endDate ? new Date(task.endDate) : null;
    
    if (filters.dateRange !== "all" && taskDate) {
      if (filters.dateRange === "today") {
        matchesDateRange = taskDate.toDateString() === today.toDateString();
      } else if (filters.dateRange === "thisWeek") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        matchesDateRange = taskDate >= weekStart && taskDate <= weekEnd;
      } else if (filters.dateRange === "thisMonth") {
        matchesDateRange = taskDate.getMonth() === today.getMonth() && 
                           taskDate.getFullYear() === today.getFullYear();
      }
    }
    
    const matchesActivity = filters.activityId === "all" || 
      task.activityId?.toString() === filters.activityId || 
      (filters.activityId === "general" && !task.activityId);
    
    return matchesSearch && matchesStatus && matchesDateRange && matchesActivity;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case "status":
        return a.status - b.status;
      default:
        return 0;
    }
  });

  const tasksByActivity: Record<number | "general", TaskModel[]> = sortedTasks.reduce((acc, task) => {
    const key = task.activityId ?? "general";
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {} as Record<number | "general", TaskModel[]>);

  const getPaginatedActivities = () => {
    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    return activities.slice(indexOfFirstActivity, indexOfLastActivity);
  };

  const handleTaskEdit = (task: TaskModel) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }; 

  const handleActivityEdit = (activity: ActivityModel) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleActivityUpdate = async (updatedActivity: ActivityModel) => {
    try {
      setActivities(prev => prev.map(a =>
        a.activityId === updatedActivity.activityId ? updatedActivity : a
      ));
    } catch (error) {
      console.error("Failed to update activity:", error);
    } 
  };

  const toggleActivityOptions = (activityId: number) => {
    setOpenActivityOptionsId(prev =>
      prev === activityId ? null : activityId
    );
  };    

  const handleTaskUpdate = async (updatedTask: TaskModel) => {
    try {
      const taskData = {
        taskId: updatedTask.taskId as number,
        name: updatedTask.name,
        content: updatedTask.content,
        startDate: updatedTask.startDate,
        endDate: updatedTask.endDate,
        status: updatedTask.status as number,
        activityId: null
      };
      await updateTask(taskData);
      setTasks(prev => prev.map(t => 
        t.taskId === updatedTask.taskId ? updatedTask : t
      ));
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Task update failed!");
    } 
  };

  const renderTask = (task: TaskModel) => (
    <div key={task.taskId} className="collapse border border-gray-200 mb-4">
      <input type="checkbox" />
      <div className="collapse-title" style={{paddingRight: "16px"}}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            <h3 className="text-lg">{task.name}</h3>
          </div>
          <TaskOptions 
            task={task} 
            onDelete={() => setTasks(prev => prev.filter(t => t.taskId !== task.taskId))}
            onEdit={handleTaskEdit}
          />
        </div>
      </div>
      <div className="collapse-content text-sm">
        <p className="text-left">{task.content}</p>
        <div className="flex gap-4 mt-2">
          <div className="badge badge-outline badge-success">
            {task.status === 0 ? "New" : task.status === 1 ? "In Progress" : "Done"}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <p>{task.endDate ? new Date(task.endDate).toDateString() : "No due date"}</p>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <p>{task.status === 2 ? "Completed" : "Not completed"}</p>
          </div>
          {viewMode === "unified" && task.activityId && (
            <div className="badge badge-outline badge-info">
              {activities.find(a => a.activityId === task.activityId)?.name || "Unknown Activity"}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(activities.length / activitiesPerPage);
    
    return (
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Activities per page:</span>
          <select
            className="select select-bordered select-sm"
            value={activitiesPerPage}
            onChange={(e) => {
              setActivitiesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={9}>10</option>
            <option value={19}>20</option>
            <option value={49}>50</option>
            <option value={99}>100</option>
          </select>
        </div>
        
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button className="join-item btn btn-sm">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex items-center w-full sm:w-64 border px-2 border-gray-300 rounded-md shadow-sm">
            <div className="text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="flex-1 h-9 bg-transparent outline-none text-base px-2"
            />
          </div>
  
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              <SortAsc className="h-4 w-4 mr-1" />
              Sort
            </div>
            <ul tabIndex={0} className="dropdown-content z-10 menu bg-base-100 rounded-box w-52 p-2 shadow">
              <li><a onClick={() => setSortBy("default")} className={sortBy === "default" ? "active" : ""}>Default</a></li>
              <li><a onClick={() => setSortBy("name")} className={sortBy === "name" ? "active" : ""}>By Name</a></li>
              <li><a onClick={() => setSortBy("date")} className={sortBy === "date" ? "active" : ""}>By Date</a></li>
              <li><a onClick={() => setSortBy("status")} className={sortBy === "status" ? "active" : ""}>By Status</a></li>
            </ul>
          </div>
  
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </div>
            <div tabIndex={0} className="dropdown-content z-10 p-4 shadow bg-base-100 rounded-box w-64">
              <h3 className="font-medium mb-2">Filter Options</h3>
              
              <div className="form-control mb-2">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select 
                  className="select select-bordered w-full" 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div className="form-control mb-2">
                <label className="label">
                  <span className="label-text">Date Range</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Activity</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.activityId}
                  onChange={(e) => setFilters({...filters, activityId: e.target.value})}
                >
                  <option value="all">All Activities</option>
                  <option value="general">General (No Activity)</option>
                  {activities.map(activity => (
                    <option key={activity.activityId} value={activity.activityId.toString()}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="btn btn-sm btn-outline w-full"
                onClick={() => setFilters({
                  status: "all",
                  dateRange: "all",
                  activityId: "all"
                })}
              >
                Reset Filters
              </button>
            </div>
          </div>
  
          <div>
            <select 
              className="select select-bordered"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="grouped">Grouped View</option>
              <option value="unified">Unified View</option>
            </select>
          </div>
        </div>
  
        <div>
          <TaskComponent />
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={handleTaskUpdate}
        initialData={selectedTask}
        mode="update"
      />

      {viewMode === "unified" ? (
        <div className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => renderTask(task))
          ) : (
            <p className="text-gray-500 text-sm text-left">No tasks available.</p>
          )}
        </div>
      ) : (
        <>
          {tasksByActivity.general?.length > 0 && (
            <div className="collapse border w-full">
              <input type="checkbox" />
              <div style={{paddingRight: "16px"}} className="collapse-title font-semibold">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-5 w-5" />
                    <h2 className="text-xl">General Activities</h2>
                  </div>
                </div>
              </div>
              <div className="collapse-content space-y-4">
                {tasksByActivity.general.map((task) => renderTask(task))}
              </div>
            </div>
          )}

          {getPaginatedActivities().map((activity) => (
            <div key={activity.activityId} className="collapse border">
              <input type="checkbox" />
              <div className="collapse-title font-semibold" style={{paddingRight: "16px"}}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-5 w-5" />
                    <h2 className="text-xl">{activity.name}</h2>
                  </div>
                  <div className="flex gap-2 z-10">
                  <button
                    className="btn btn-ghost btn-primary"
                    onClick={() => toggleActivityOptions(activity.activityId)}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </button>

                  {openActivityOptionsId === activity.activityId && (
                    <ActivityOptions
                      activity={activity}
                      onDelete={() => handleDelete(activity.activityId)}
                      onEdit={handleActivityEdit}
                    />
                  )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-left">{activity.description}</p>
              </div>
              <div className="collapse-content space-y-4">
                {tasksByActivity[activity.activityId]?.length ? (
                  tasksByActivity[activity.activityId].map((task) => renderTask(task))
                ) : (
                  <p className="text-gray-500 text-sm text-left">No tasks available for this activity.</p>
                )}
              </div>
            </div>
          ))}

          {renderPagination()} {/*function to render pagination on the bottom of the screen (items per page and page number to move to)*/} 
        </>
      )}
      {selectedActivity && (
        <EditActivityModal
          isOpen={isEditActivityModalOpen}
          activity={selectedActivity}
          onClose={() => {
            setIsActivityModalOpen(false);
            setSelectedActivity(null);
          }}
          onUpdate={handleActivityUpdate}
        />
      )}
      <div className="h-4"></div>
    </div>
  );
}
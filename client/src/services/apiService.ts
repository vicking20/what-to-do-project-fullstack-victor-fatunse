//apiService.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { TaskStatusEnum } from "../types/types";

const apiClient = axios.create({
    baseURL: "http://192.168.0.117:5000/api",
    //baseURL: "http://172.16.3.0:5000/api", //baseurl from second wifi connection
    timeout: 5000,
});

export async function getTasks() {
    try {
        const response: AxiosResponse = await apiClient.get("/tasks");
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
}

export const createTask = async (taskData: { name: string, content: string, startDate: string, endDate: string, status: TaskStatusEnum, activityId: number | null }) => {
    try {
      const response = await apiClient.post(`/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  export const deleteTask = async (taskId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }; 

  export const updateTask = async (taskData: {
    taskId: number | string;
    name: string;
    content: string;
    startDate: string;
    endDate: string;
    status: number;
    activityId: number | null;
  }) => {
    try {
      const response = await apiClient.put(`tasks/`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };
  
  export const getActivities = async () => {
    try {
      const response = await apiClient.get("/activities");
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      throw new Error(`Error fetching activities: ${err.response?.data}`);
  };
};

  export const createActivity = async (activityData: { name:string; description:string; }) => {
    try {
      const response = await apiClient.post("/activities", activityData);
      return response.data;
    } catch (error) {
        console.error("Error creating activity:", error);
        throw error;
    }
  };


  export const deleteActivity = async (activityId: number) => {
    try {
      const response = await apiClient.delete(`/activities/${activityId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }

  export const updateActivity = async (activityData: {
    activityId: number;
    name: string;
    description: string;
  }) => {
    try {
      const response = await apiClient.put("/activities", activityData);
      return response.data;
    } catch (error) {
      console.error("Error updating activity", error);
      throw error;
    }
  };

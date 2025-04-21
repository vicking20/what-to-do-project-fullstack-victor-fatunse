import { Request, Response } from "express";
import { TaskModel } from "../models/taskModel";
import { TaskStatusEnum } from "../models/taskModel";

const exampleTaskList: string[] = ["Task 1", "Task 2", "Task 3", "Task 4"];

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await TaskModel.findAll(); 
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, content, startDate, endDate, status, activityId } = req.body;

    if (!name || !content || !startDate || !endDate) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const taskStatus = status !== undefined ? status : TaskStatusEnum.New;

    const newTask = await TaskModel.create({
      name,
      content,
      startDate,
      endDate,
      status: taskStatus,
      activityId,
    });

    res.status(201).json(newTask); 
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findByPk(id);
    if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
    }
    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully!" });
    return;
  }
  catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId, name, content, startDate, endDate, status } = req.body;

    if (!taskId) {
      res.status(400).json({ message: "Task ID is required" });
      return;
    }

    const task = await TaskModel.findByPk(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found!" });
      return;
    }

    await task.update({
      name,
      content,
      startDate,
      endDate,
      status
    });

    res.status(200).json({ message: "Task updated successfully!", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

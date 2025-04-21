import express from "express";
import { createTask, getTasks, deleteTask, updateTask } from "../controllers/taskController";

const router = express.Router();

router.post("/tasks", createTask); 
router.get("/tasks", getTasks);
router.delete("/tasks/:id", deleteTask);
router.put("/tasks/", updateTask);

export default router;

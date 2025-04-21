import express from "express";
import { createActivity, getActivities, updateActivity, deleteActivity } from "../controllers/activityController";

const router = express.Router();

router.post("/activities", createActivity);
router.get("/activities", getActivities);
router.delete("/activities/:id", deleteActivity);
router.put("/activities", updateActivity);

export default router;
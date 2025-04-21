import { Request, Response } from "express";
import { ActivityModel } from "../models/activityModel";

export const getActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const activities = await ActivityModel.findAll();
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ message: "Activity name is required" });
            return;
        }
        const newActivity = await ActivityModel.create({ name, description });
        res.status(201).json(newActivity);
    } catch (error) {
        console.error("Error creating activity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const activity = await ActivityModel.findByPk(id);

        if (!activity) {
            res.status(404).json({ message: "Activity not found" });
            return;
        }
        await activity.destroy();
        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { activityId, name, description } = req.body;
        if (!activityId) {
            res.status(404).json({ message: "Activity Id is required" });
            return;
        }
        const activity = await ActivityModel.findByPk(activityId);
        if (!activity) {
            res.status(404).json({ message: "Activity not found" });
            return;
        }
        await activity.update({ name, description });
        res.status(200).json({ message: "Activity updated successfully", activity });
    } catch (error) {
        console.error("Error updating activity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
import { useState, useEffect } from "react";
import { updateActivity } from "../../services/apiService";
import { ActivityModel } from "../../types/types";

interface EditActivityModalProps {
    isOpen: boolean;
    activity: ActivityModel;
    onClose: () => void;
    onUpdate: (updatedActivity: ActivityModel) => void;
}

export default function EditActivityModal({ isOpen, activity, onClose, onUpdate }: EditActivityModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    //Reset form when activity changes
    useEffect(() => {
        if (activity) {
            setName(activity.name);
            setDescription(activity.description || "");
        }
    }, [activity]);

    const handleSubmit = async () => {
        if (!name || !description) {
            alert("Activity detailed are required")
            return;
        }
        setLoading(true);
        try {
            const updatedActivity = {
                activityId: activity.activityId,
                name,
                description
            };
            await updateActivity(updatedActivity);
            onUpdate({...activity, name, description});
            alert("Activity updated successfully");
            onClose();
        } catch (error) {
            console.error("Error updating activity:", error);
            alert("Failed to update actiivty");
        } finally {
            setLoading(false);
        }
    };
    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Edit Activity</h3>

                <input
                type="text"
                placeholder="Activity Name"
                className="input input-bordered w-full mt-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <textarea
                placeholder="Activity Description"
                className="textarea textarea-bordered w-full mt-4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />

                <div className="modal-action">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Updating..." : "Update Activity"}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
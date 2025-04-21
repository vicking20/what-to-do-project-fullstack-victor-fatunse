//NewActivityModal.tsx
import { useState, useRef } from "react";
import { createActivity } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { NewActivityModalProps } from "../../types/types";

export default function NewActivityModal({ onActivityCreated }: NewActivityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  
  const handleSubmit = async () => {
    if (!name) {
      alert("Activity name is required!");
      return;
    }
    setLoading(true);
    try {
      await createActivity({ name, description });
      alert("Activity created successfully!");
      setName("");
      setDescription("");
      onActivityCreated();
      modalRef.current?.close();
      navigate(0);
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Failed to create activity.");
    } finally {
      setLoading(false)
    }
  };
  
  const handleClose = () => {
    modalRef.current?.close();
  };
  
  return (
    <dialog id="activity_modal_1" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          New Activity
        </h3>
        {/* input field */}
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
        {/* Modal actions */}
        <div className="modal-action">
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Activity"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
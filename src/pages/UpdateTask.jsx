import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("task_token");
        const response = await axios.get(`https://taskmanager-backend-nqq8.onrender.com/api/task/${id}`, {
          headers: { token },
        });
        const task = response.data.task;
        setFormData({
          title: task.title,
          description: task.description || "",
          status: task.status,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
          priority: task.priority,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch task");
        navigate("/");
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("task_token");
      await axios.put(`https://taskmanager-backend-nqq8.onrender.com/api/task/${id}`, formData, {
        headers: { token },
      });
      toast.success("Task updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center text-gray-600 mt-20">Loading task...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-600 mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-600 mb-2 font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-600 mb-2 font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-600 mb-2 font-medium">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-gray-600 mb-2 font-medium">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md transition duration-200 cursor-pointer ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 "
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
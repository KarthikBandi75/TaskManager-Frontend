import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("task_name");

 
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("task_token");
      const response = await axios.get("https://taskmanager-backend-nqq8.onrender.com/api/task", {
        headers: { token },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 
  const handleLogout = () => {
    localStorage.removeItem("task_token");
    localStorage.removeItem("task_name");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("task_token");
      await axios.delete(`https://taskmanager-backend-nqq8.onrender.com/api/task/${id}`, {
        headers: { token },
      });
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-[#F4F6F8]"
    >
      <div className="max-w-6xl mx-auto py-8">
       
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1F2A44] ">
            Welcome, {username || "User"}!
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-[#0A66C2] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0958A6] transition duration-200 cursor-pointer"
          >
            Logout
          </motion.button>
        </div>

       
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/add")}
            className="bg-[#0A66C2] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#0958A6] transition duration-200 cursor-pointer"
          >
            Add New Task
          </motion.button>
        </div>

       
        {loading ? (
          <p className="text-center text-[#6B7280]">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-[#6B7280]">No tasks found. Add a task to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">{task.title}</h3>
                <p className="text-sm text-[#6B7280] mb-1">
                  <span className="font-medium text-[#1F2A44]">Description:</span>{" "}
                  {task.description || "No description"}
                </p>
                <p className="text-sm text-[#6B7280] mb-1">
                  <span className="font-medium text-[#1F2A44]">Status:</span> {task.status}
                </p>
                <p className="text-sm text-[#6B7280] mb-1">
                  <span className="font-medium text-[#1F2A44]">Priority:</span> {task.priority}
                </p>
                {task.dueDate && (
                  <p className="text-sm text-[#6B7280] mb-3">
                    <span className="font-medium text-[#1F2A44]">Due:</span>{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/update/${task._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#0A66C2] text-white rounded-md text-sm font-medium hover:bg-[#0958A6] cursor-pointer"
                  >
                    <Eye size={16} /> Update
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(task._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#00A69C] text-white rounded-md text-sm font-medium hover:bg-[#008C84] cursor-pointer"
                  >
                    <Trash2 size={16} /> Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
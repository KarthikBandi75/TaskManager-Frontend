import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Both fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://taskmanager-backend-nqq8.onrender.com/api/user/login",
        formData
      );
      localStorage.setItem("task_token", response.data.token);
      localStorage.setItem("task_name", response.data.user.name); 
      toast.success(response.data.message || "Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
         
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

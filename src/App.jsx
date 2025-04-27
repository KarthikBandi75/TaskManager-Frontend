import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateTask from "./pages/UpdateTask";

import AddTask from "./pages/AddTask";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add" element={<AddTask/>}/>
        <Route path="/update/:id" element={<UpdateTask/>}/>
      </Routes>
    </>
  );
};

export default App;

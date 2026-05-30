// src/pages/admin/CreateAdmin.jsx

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
      );

      setMessage(response.data);
      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
      });
    } catch (error) {
      console.log(error);

      setSuccess(false);

      setMessage(error.response?.data || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-teal-500 opacity-20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-500 opacity-20 blur-[120px] rounded-full"></div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-5 rounded-2xl shadow-lg">
              <ShieldCheck size={45} className="text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-center text-white"
          >
            Create Admin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-300 mt-3 mb-8 text-sm"
          >
            Register secure admin account
          </motion.p>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-5 p-3 rounded-xl text-center text-sm font-medium ${
                success
                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                  : "bg-red-500/20 text-red-300 border border-red-400/30"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Full Name
              </label>

              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <User className="text-gray-400" size={20} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-4 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>

              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <Mail className="text-gray-400" size={20} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-4 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Password
              </label>

              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <Lock className="text-gray-400" size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl transition-all"
            >
              <UserPlus size={22} />

              {loading ? "Creating..." : "Create Admin"}
            </motion.button>
          </form>

          {/* Back */}
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate("/admin-options")}
            className="mt-8 flex items-center gap-2 text-gray-300 hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateAdmin;

// src/pages/admin/AdminOptions.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, LogIn, UserPlus, ArrowLeft } from "lucide-react";

const AdminOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-teal-500 opacity-20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-500 opacity-20 blur-[120px] rounded-full"></div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-5 rounded-2xl shadow-lg">
              <ShieldCheck size={45} className="text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-center text-white"
          >
            Admin Portal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-300 mt-3 mb-10 text-sm"
          >
            Securely manage the Intern Training System
          </motion.p>

          {/* Buttons */}
          <div className="space-y-5">
            {/* Register */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-admin")}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl transition-all"
            >
              <UserPlus size={22} />
              Register Admin
            </motion.button>

            {/* Login */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white py-4 rounded-2xl text-lg font-semibold transition-all"
            >
              <LogIn size={22} />
              Login Admin
            </motion.button>
          </div>

          {/* Back */}
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate("/")}
            className="mt-8 flex items-center gap-2 text-gray-300 hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={18} />
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOptions;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { saveAuthData } from "../../utils/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Footer from "../../components/landing/Footer";
import Navbar from "../../components/landing/Navbar";
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const decodeJwtRole = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/login", formData);

      const token =
        typeof response.data === "string" ? response.data : response.data.token;

      if (!token) {
        toast.error("Token not received");
        return;
      }

      const role = decodeJwtRole(token);

      if (!role) {
        toast.error("Role not found in token");
        return;
      }

      saveAuthData(token, role);

      toast.success("Login successful");

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "MENTOR") {
        navigate("/mentor/dashboard");
      } else if (role === "INTERN") {
        navigate("/intern/dashboard");
      } else {
        toast.error("Invalid role");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    }
  };

  return (
    // <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
    //   <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">
    //     <div className="text-center mb-8">
    //       <h1 className="text-3xl font-bold text-teal-600">Login</h1>
    //       <p className="text-slate-500 mt-2">
    //         Intern Training Management System
    //       </p>
    //     </div>

    //     <form onSubmit={handleSubmit} className="space-y-5">
    //       <div>
    //         <label className="block text-sm font-medium text-slate-700 mb-2">
    //           Email
    //         </label>
    //         <input
    //           type="email"
    //           name="email"
    //           placeholder="Enter your email"
    //           value={formData.email}
    //           onChange={handleChange}
    //           className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
    //           required
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium text-slate-700 mb-2">
    //           Password
    //         </label>
    //         <input
    //           type="password"
    //           name="password"
    //           placeholder="Enter your password"
    //           value={formData.password}
    //           onChange={handleChange}
    //           className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
    //           required
    //         />
    //       </div>

    //       <button
    //         type="submit"
    //         className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition"
    //       >
    //         Login
    //       </button>
    //     </form>

    //     <p className="text-center text-sm text-slate-500 mt-6">
    //       Secure access for Admin, Mentor and Intern
    //     </p>
    //   </div>
    // </div>

    // <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    //   <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">
    //     {/* Header */}
    //     <div className="mb-8 text-center">
    //       <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
    //       <p className="text-sm text-slate-500 mt-1">
    //         Intern Training Management System
    //       </p>
    //     </div>

    //     {/* Form */}
    //     <form onSubmit={handleSubmit} className="space-y-5">
    //       {/* Email */}
    //       <div>
    //         <label className="block text-sm font-medium text-slate-700 mb-1">
    //           Email address
    //         </label>
    //         <input
    //           type="email"
    //           name="email"
    //           placeholder="you@example.com"
    //           value={formData.email}
    //           onChange={handleChange}
    //           className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
    //           required
    //         />
    //       </div>

    //       {/* Password */}
    //       <div>
    //         <div className="flex justify-between items-center mb-1">
    //           <label className="text-sm font-medium text-slate-700">
    //             Password
    //           </label>
    //         </div>

    //         <div className="relative">
    //           <input
    //             type={showPassword ? "text" : "password"}
    //             name="password"
    //             placeholder="Enter your password"
    //             value={formData.password}
    //             onChange={handleChange}
    //             className="w-full border border-slate-300 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
    //             required
    //           />

    //           {/* Eye Icon */}
    //           <span
    //             onClick={togglePassword}
    //             className="absolute right-3 top-2.5 cursor-pointer text-slate-500 hover:text-slate-700"
    //           >
    //             {showPassword ? <FiEyeOff /> : <FiEye />}
    //           </span>
    //         </div>
    //       </div>

    //       {/* Button */}
    //       <button
    //         type="submit"
    //         className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg transition duration-200"
    //       >
    //         Sign in
    //       </button>
    //     </form>

    //     {/* Divider */}
    //     <div className="flex items-center gap-3 my-6">
    //       <div className="flex-1 h-px bg-slate-200"></div>
    //       <span className="text-xs text-slate-400">Secure Login</span>
    //       <div className="flex-1 h-px bg-slate-200"></div>
    //     </div>

    //     {/* Footer */}
    //     <p className="text-center text-xs text-slate-500">
    //       Access restricted to Admin, Mentor & Intern
    //     </p>
    //   </div>
    // </div>

    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-100 rounded-full blur-3xl opacity-40"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-40"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Top Badge */}
        <div className="flex justify-center mb-5">
          <div className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md">
            Secure Login Portal
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h1>

            <p className="text-slate-500 mt-2 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-slate-300 bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                {/* <button
                  type="button"
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot Password?
                </button> */}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-slate-300 bg-slate-50 rounded-2xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />

                {/* Eye Icon */}
                <span
                  onClick={togglePassword}
                  className="absolute right-4 top-3.5 cursor-pointer text-slate-500 hover:text-slate-700 transition"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="accent-teal-600" />
                Remember me
              </label>

              <span className="text-slate-400">Protected Access</span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-200"></div>

            <span className="text-xs text-slate-400 uppercase tracking-widest">
              Secure System
            </span>

            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-slate-500 leading-6">
              Access restricted to authorized Admin, Mentor, and Intern users
              only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

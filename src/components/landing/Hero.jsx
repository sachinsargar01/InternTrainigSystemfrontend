import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-slate-50 py-24 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

      {/* Animated Blobs using Framer Motion */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          delay: 2,
          ease: "easeInOut",
        }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-teal-700 font-semibold text-sm mb-8 border border-blue-200">
            <Sparkles className="h-4 w-4" />
            <span>The smart way to manage interns</span>
          </div>

          <h1 className="text-5xl lg:text-showcase lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
              Intern Training
            </span>
          </h1>

          <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-xl">
            Streamline your intern management process with our comprehensive
            platform. From interactive training to daily task tracking, empower
            your team to succeed all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              to="/login"
              className="group flex justify-center items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5"
            >
              Intern Login
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="flex justify-center items-center px-8 py-4 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              Mentor Login
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-100 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-slate-600">Secure Platform</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-slate-600">Easy Collaboration</span>
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative lg:ml-auto w-full max-w-lg"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-white/60 bg-white/50 backdrop-blur-sm p-3">
            <img
              src="../../../public/hero2.png"
              alt="Intern training dashboard preview"
              className="rounded-2xl w-full h-auto object-cover border border-slate-100"
            />
          </div>

          {/* Decorative floating element */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100/50 flex items-center gap-4 z-10"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center border border-green-200">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">+45%</p>
              <p className="text-xs text-slate-500 font-semibold tracking-wide">
                PRODUCTIVITY
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

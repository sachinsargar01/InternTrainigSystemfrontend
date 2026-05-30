import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
              <GraduationCap className="h-6 w-6 text-teal-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              InternHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#roles"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Roles
            </a>
            <a
              href="#workflow"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Workflow
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors px-2"
            >
              Sign up
            </Link> */}
            <Link
              to="/admin-options"
              className="bg-teal-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm hover:shadow-teal-600/20 hover:-translate-y-0.5"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 min-h-screen bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out px-6 py-24 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-6">
            <a
              href="#home"
              className="text-lg font-medium text-slate-700 hover:text-teal-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#features"
              className="text-lg font-medium text-slate-700 hover:text-teal-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#roles"
              className="text-lg font-medium text-slate-700 hover:text-teal-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roles
            </a>
            <a
              href="#workflow"
              className="text-lg font-medium text-slate-700 hover:text-teal-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workflow
            </a>
            <hr className="border-slate-100 my-2" />
            <Link
              to="/login"
              className="text-lg font-medium text-slate-700 hover:text-teal-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-teal-600 text-white text-center font-medium px-5 py-3 rounded-lg hover:bg-teal-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

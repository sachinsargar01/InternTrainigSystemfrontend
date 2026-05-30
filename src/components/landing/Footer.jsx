import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand & About */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-600/10 rounded-lg">
              <GraduationCap className="h-7 w-7 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              InternHub
            </h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Empowering organizations with a smart platform for intern
            management, continuous learning, and seamless performance tracking.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-slate-500 hover:text-teal-400 transition-colors duration-300"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-teal-400 transition-colors duration-300"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-teal-400 transition-colors duration-300"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
            Product
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Workflows
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Role Management
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Analytics
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
            Resources
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                API Reference
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Community
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
              <span className="text-slate-400">
                123 Thynk Tech India <br />
                phase 2 pune
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-500 shrink-0" />
              <a
                href="mailto:support@internhub.com"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                support@internhub.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-500 shrink-0" />
              <a
                href="tel:+1234567890"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                +919881884005
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} InternHub. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a
            href="#"
            className="text-slate-500 hover:text-white transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-slate-500 hover:text-white transition-colors duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-slate-500 hover:text-white transition-colors duration-300"
          >
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}

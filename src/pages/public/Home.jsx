import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaVideo,
  FaTasks,
  FaClipboardCheck,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

import {
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Features from "../../components/landing/Features";
import About from "../../components/landing/About";
import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Stats from "../../components/landing/Stats";
import Roles from "../../components/landing/Roles";
import Workflow from "../../components/landing/Workflow";
import Testimonials from "../../components/landing/Testimonials";
import Footer from "../../components/landing/Footer";
import Contact from "../../components/landing/Contact";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="w-full bg-white shadow-sm border-b">
        <Navbar />
      </header>

      <Hero />
      <Stats />
      <About />
      <Features />
      <Roles />
      <Workflow />
      <Contact />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}

export default Home;

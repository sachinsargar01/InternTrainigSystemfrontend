// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { logout } from "../../utils/auth";
// import { toast } from "react-toastify";

// import {
//   FiHome,
//   FiCheckSquare,
//   FiVideo,
//   FiCalendar,
//   FiFileText,
//   FiBarChart2,
//   FiLogOut,
// } from "react-icons/fi";

// function InternSidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const menuItems = [
//     { name: "Dashboard", path: "/intern/dashboard", icon: <FiHome /> },
//     { name: "Tasks", path: "/intern/tasks", icon: <FiCheckSquare /> },
//     { name: "Videos", path: "/intern/videos", icon: <FiVideo /> },
//     { name: "Meetings", path: "/intern/meetings", icon: <FiCalendar /> },
//     { name: "Tests", path: "/intern/tests", icon: <FiFileText /> },
//     {
//       name: "Progress Report",
//       path: "/intern/progress-report",
//       icon: <FiBarChart2 />,
//     },
//   ];

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   return (
//     <div className="sticky left-0 w-64 min-h-screen bg-white text-gray-800 flex flex-col shadow-md">
//       {/* Header */}
//       <div className="px-6 py-5 border-b border-gray-200">
//         <h1 className="text-xl font-bold text-teal-600">Intern Panel</h1>
//         <p className="text-xs text-gray-500 mt-1">Intern Training System</p>
//       </div>

//       {/* Menu */}
//       <div className="flex-1 px-3 py-6 space-y-1">
//         {menuItems.map((item) => {
//           const active = location.pathname === item.path;

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
//                 ${
//                   active
//                     ? "bg-teal-50 text-teal-600 font-medium"
//                     : "text-gray-600 hover:bg-gray-100 hover:text-teal-600"
//                 }
//               `}
//             >
//               {/* Left Indicator */}
//               <span
//                 className={`absolute left-0 top-0 h-full w-1 rounded-r-lg
//                   ${active ? "bg-teal-500" : "bg-transparent"}
//                 `}
//               ></span>

//               {/* Icon */}
//               <span className="text-lg">{item.icon}</span>

//               {/* Text */}
//               <span className="text-sm">{item.name}</span>
//             </Link>
//           );
//         })}
//       </div>

//       {/* Logout */}
//       <div className="p-4 border-t">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition"
//         >
//           <FiLogOut />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default InternSidebar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { toast } from "react-toastify";

import {
  FiHome,
  FiCheckSquare,
  FiVideo,
  FiCalendar,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiMessageCircle,
} from "react-icons/fi";

function InternSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/intern/dashboard", icon: <FiHome /> },

    { name: "Tasks", path: "/intern/tasks", icon: <FiCheckSquare /> },

    { name: "Videos", path: "/intern/videos", icon: <FiVideo /> },

    { name: "Meetings", path: "/intern/meetings", icon: <FiCalendar /> },

    { name: "Tests", path: "/intern/tests", icon: <FiFileText /> },

    {
      name: "Progress Report",
      path: "/intern/progress-report",
      icon: <FiBarChart2 />,
    },

    // CHAT ADDED
    {
      name: "Chat",
      path: "/intern/chat",
      icon: <FiMessageCircle />,
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="sticky left-0 w-64 min-h-screen bg-white text-gray-800 flex flex-col shadow-md">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-teal-600">Intern Panel</h1>

        <p className="text-xs text-gray-500 mt-1">Intern Training System</p>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                ${
                  active
                    ? "bg-teal-50 text-teal-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-teal-600"
                }
              `}
            >
              {/* Left Indicator */}
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-r-lg
                  ${active ? "bg-teal-500" : "bg-transparent"}
                `}
              ></span>

              {/* Icon */}
              <span className="text-lg">{item.icon}</span>

              {/* Text */}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}

export default InternSidebar;

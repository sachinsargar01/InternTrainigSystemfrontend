import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { toast } from "react-toastify";
import { FiHome, FiLayers, FiUser, FiUsers, FiLogOut } from "react-icons/fi"; // React Icons

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={20} /> },
    { name: "Batches", path: "/admin/batches", icon: <FiLayers size={20} /> },
    { name: "Mentors", path: "/admin/mentors", icon: <FiUser size={20} /> },
    { name: "Interns", path: "/admin/interns", icon: <FiUsers size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="sticky left-0 w-64 min-h-screen bg-white text-gray-800 flex flex-col shadow-lg">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-teal-600">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Intern Training System</p>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col mt-4 relative">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 transition-colors duration-300 
                ${
                  active
                    ? "text-teal-600 font-semibold"
                    : "text-gray-600 hover:text-teal-600"
                }
              `}
            >
              {/* Smooth teal indicator */}
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-tr-lg rounded-br-lg
                  ${active ? "bg-teal-500" : "bg-transparent"} transition-all duration-300
                `}
              ></span>

              {/* Icon */}
              <span>{item.icon}</span>

              {/* Text */}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition-colors duration-300 flex items-center gap-2 w-full justify-center"
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

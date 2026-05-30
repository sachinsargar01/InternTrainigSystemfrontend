import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

function AdminLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar title={title} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;

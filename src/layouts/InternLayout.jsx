import InternSidebar from "../components/common/InternSidebar";
import InternTopbar from "../components/common/internTopbar";

function InternLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <InternSidebar />

      <div className="flex-1 flex flex-col">
        <InternTopbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default InternLayout;

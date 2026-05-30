import MentorSidebar from "../components/common/MentorSidebar";
import MentorTopbar from "../components/common/MentorTopbar";

function MentorLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <MentorSidebar />

      <div className="flex-1 flex flex-col">
        <MentorTopbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default MentorLayout;

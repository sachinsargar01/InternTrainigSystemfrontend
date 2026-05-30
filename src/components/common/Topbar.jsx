function Topbar({ title }) {
  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      <div className="text-sm text-slate-500">
        Welcome, <span className="font-semibold text-slate-700">Admin</span>
      </div>
    </div>
  );
}

export default Topbar;

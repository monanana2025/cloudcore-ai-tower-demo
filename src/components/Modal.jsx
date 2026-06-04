export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-6">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <button className="rounded-md px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

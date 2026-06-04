export default function Badge({ label, tone = "slate" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    teal: "bg-teal-50 text-teal-700 ring-teal-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    orange: "bg-orange-50 text-orange-700 ring-orange-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone] || tones.slate}`}>
      {label}
    </span>
  );
}

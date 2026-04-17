import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";

function OccupancyCard({ items = [] }) {
  const navigate = useNavigate();

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.percent - a.percent);
  }, [items]);

  const averageOccupancy = useMemo(() => {
    if (sortedItems.length === 0) return 0;

    const total = sortedItems.reduce((sum, item) => sum + item.percent, 0);
    return Math.round(total / sortedItems.length);
  }, [sortedItems]);

  return (
    <div className="rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-white">Occupation en direct</h3>
            <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Live
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Moyenne actuelle :{" "}
            <span className="font-semibold text-cyan-400">
              {averageOccupancy}%
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/salles")}
          className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
        >
          voir tout ↗
        </button>
      </div>

      {sortedItems.length === 0 ? (
        <div className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-cyan-400/10 bg-[#09111f] text-center">
          <Activity size={20} className="mb-2 text-slate-500" />
          <p className="text-sm text-slate-400">Aucune donnée d’occupation disponible.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[140px_1fr_48px] items-center gap-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-300">
                  {item.name}
                </p>
              </div>

              <div className="h-2.5 rounded-full bg-slate-900/90">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${Math.max(0, Math.min(item.percent, 100))}%` }}
                />
              </div>

              <p className="text-right text-xs font-semibold text-slate-500">
                {item.percent}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OccupancyCard;
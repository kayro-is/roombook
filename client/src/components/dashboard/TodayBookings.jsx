import { useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";

function TodayBookings({ bookings = [] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Aujourd&apos;hui
          </h3>
          <span className="rounded-md bg-slate-800 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-slate-500">
            {bookings.length} créneau{bookings.length > 1 ? "x" : ""}
          </span>
        </div>

        <button
          onClick={() => navigate("/reservations")}
          className="self-start text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 sm:self-auto"
        >
          voir tout ↗
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-cyan-400/10 bg-[#09111f] px-4 text-center">
          <CalendarClock size={20} className="mb-2 text-slate-500" />
          <p className="text-sm text-slate-400">
            Aucune réservation prévue aujourd&apos;hui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((item, index) => (
            <div
              key={`${item.room}-${item.time}-${index}`}
              className="rounded-2xl border border-cyan-400/10 bg-white/[0.02] px-4 py-3 transition hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {item.room || "Salle"}
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-500 sm:truncate">
                    {item.time || "Horaire non défini"} ·{" "}
                    {item.person || "Utilisateur"}
                  </p>
                </div>

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                    item.color || "from-cyan-400 to-blue-500"
                  } text-[10px] font-bold text-white`}
                >
                  {item.initials || "RS"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodayBookings;
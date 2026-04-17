import { Plus, Minus, DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function RoomsTable({ rooms = [] }) {
  const navigate = useNavigate();

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      if (a.statut === "LIBRE" && b.statut !== "LIBRE") return -1;
      if (a.statut !== "LIBRE" && b.statut === "LIBRE") return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [rooms]);

  const handleAction = (room) => {
    if (room.statut === "LIBRE") {
      navigate("/reservations", { state: { selectedSalleId: room.id } });
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
        <div className="flex items-center gap-3">
          <DoorOpen className="text-cyan-400" size={22} />
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Disponibilité des salles
          </h3>
        </div>

        <button
          onClick={() => navigate("/salles")}
          className="self-start rounded-md bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400 transition hover:bg-cyan-400/20 sm:self-auto"
        >
          Voir toutes
        </button>
      </div>

      {sortedRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-10 text-slate-400">
          <DoorOpen size={28} />
          <p>Aucune salle disponible.</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-3 p-4 lg:hidden">
            {sortedRooms.map((room) => (
              <div
                key={room.id}
                className="rounded-2xl border border-cyan-400/10 bg-[#09111f] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {room.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {room.code}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAction(room)}
                    disabled={room.statut !== "LIBRE"}
                    title={
                      room.statut === "LIBRE"
                        ? "Réserver cette salle"
                        : "Salle non disponible"
                    }
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                      room.statut === "LIBRE"
                        ? "border-cyan-400/40 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950"
                        : "cursor-not-allowed border-slate-700 text-slate-600"
                    }`}
                  >
                    {room.statut === "LIBRE" ? (
                      <Plus size={14} />
                    ) : (
                      <Minus size={12} />
                    )}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">
                      Capacité
                    </p>
                    <p className="mt-1 text-slate-300">{room.cap}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">
                      Étage
                    </p>
                    <p className="mt-1 text-slate-300">{room.etage}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${room.statutColor}`}
                  >
                    ● {room.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.8fr_80px_100px_120px_80px] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
              <span>Salle</span>
              <span>Cap.</span>
              <span>Étage</span>
              <span>Statut</span>
              <span className="text-center">Action</span>
            </div>

            {sortedRooms.map((room) => (
              <div
                key={room.id}
                className="grid grid-cols-[1.8fr_80px_100px_120px_80px] items-center border-t border-slate-800 px-5 py-5 transition hover:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {room.name}
                  </p>
                  <p className="text-sm text-slate-500">{room.code}</p>
                </div>

                <p className="text-slate-400">{room.cap}</p>
                <p className="text-slate-400">{room.etage}</p>

                <div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${room.statutColor}`}
                  >
                    ● {room.statut}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => handleAction(room)}
                    disabled={room.statut !== "LIBRE"}
                    title={
                      room.statut === "LIBRE"
                        ? "Réserver cette salle"
                        : "Salle non disponible"
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                      room.statut === "LIBRE"
                        ? "border-cyan-400/40 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950"
                        : "cursor-not-allowed border-slate-700 text-slate-600"
                    }`}
                  >
                    {room.statut === "LIBRE" ? (
                      <Plus size={14} />
                    ) : (
                      <Minus size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RoomsTable;
import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/dashboard/Sidebar";
import { MapPin, Users, DoorOpen } from "lucide-react";

function RoomsPage() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/salle");

      // selon la forme de la réponse API
      const data = Array.isArray(res.data) ? res.data : res.data.salles || [];
      setSalles(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des salles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  return (
    <div className="min-h-screen bg-[#030817] text-white flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="mt-12 mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3 border border-cyan-400/20">
              <DoorOpen className="text-cyan-400" size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">Salles</h1>
              <p className="text-slate-400 mt-1">
                Consultez les salles disponibles pour effectuer une réservation.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220] p-6 text-center text-cyan-400">
            Chargement des salles...
          </div>
        ) : salles.length === 0 ? (
          <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220] p-6 text-center text-slate-400">
            Aucune salle disponible.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {salles.map((salle) => (
              <div
                key={salle.id_salle}
                className="group rounded-3xl border border-cyan-400/10 bg-[#0b1220]/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-cyan-400/20 hover:-translate-y-0.5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {salle.nom_salle || "Sans nom"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Salle de réunion
                    </p>
                  </div>

                  <div className="rounded-xl bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                    ID #{salle.id_salle}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-cyan-400" />
                    <span>
                      <span className="font-medium text-white">
                        {salle.capacite ?? "?"}
                      </span>{" "}
                      places
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-cyan-400" />
                    <span>{salle.localisation || "Localisation non renseignée"}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#09101d] px-4 py-3 border border-white/5">
                  <p className="text-sm leading-6 text-slate-400">
                    {salle.description || "Aucune description disponible."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RoomsPage;
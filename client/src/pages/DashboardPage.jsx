import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import OccupancyCard from "../components/dashboard/OccupancyCard";
import RoomsTable from "../components/dashboard/RoomsTable";
import CalendarCard from "../components/dashboard/CalendarCard";
import TodayBookings from "../components/dashboard/TodayBookings";
import api from "../services/api";
import { getUserFromToken } from "../utils/auth";
import {
  Search,
  Zap,
  User,
  DoorOpen,
  Users,
  Power,
  Plus,
} from "lucide-react";

const BOOKING_COLORS = [
  "from-cyan-400 to-blue-500",
  "from-cyan-400 to-teal-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-indigo-500",
];

function DashboardPage() {
  const [salles, setSalles] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const user = getUserFromToken();
  const isAdminUser = user?.role === "admin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [sallesRes, usersRes, reservationsRes] = await Promise.all([
          api.get("/salle"),
          api.get("/utilisateur"),
          api.get("/reservation"),
        ]);

        setSalles(Array.isArray(sallesRes.data) ? sallesRes.data : []);
        setUtilisateurs(Array.isArray(usersRes.data) ? usersRes.data : []);
        setReservations(
          Array.isArray(reservationsRes.data) ? reservationsRes.data : []
        );
      } catch (err) {
        console.error("Erreur dashboard :", err);
        setError("Erreur lors du chargement du dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sallesValides = salles.filter(
    (salle) => salle.nom_salle && salle.capacite && salle.localisation
  );

  const filteredSalles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return sallesValides;

    return sallesValides.filter((salle) => {
      const nom = salle.nom_salle?.toLowerCase() || "";
      const localisation = salle.localisation?.toLowerCase() || "";
      const description = salle.description?.toLowerCase() || "";

      return (
        nom.includes(term) ||
        localisation.includes(term) ||
        description.includes(term)
      );
    });
  }, [sallesValides, searchTerm]);

  const totalSalles = sallesValides.length;
  const totalUtilisateurs = utilisateurs.length;
  const totalAdmins = utilisateurs.filter(
    (utilisateur) => utilisateur.role === "admin"
  ).length;
  const totalUsers = Math.max(totalUtilisateurs - totalAdmins, 0);

  const sallesOccupees = new Set(
    reservations
      .filter((reservation) => reservation.nom_salle)
      .map((reservation) => reservation.nom_salle)
  ).size;

  const sallesLibres = Math.max(totalSalles - sallesOccupees, 0);

  const occupation =
    totalSalles > 0 ? Math.round((sallesOccupees / totalSalles) * 100) : 0;

  const stats = [
    {
      title: "Salles",
      value: String(totalSalles),
      subtitle: `${sallesLibres} libres · ${sallesOccupees} occupées`,
      icon: <DoorOpen size={18} className="text-orange-300" />,
      valueColor: "text-cyan-400",
    },
    {
      title: "Utilisateurs",
      value: String(totalUtilisateurs),
      subtitle: `${totalUsers} utilisateurs · ${totalAdmins} admins`,
      icon: <Users size={18} className="text-violet-300" />,
      valueColor: "text-emerald-400",
    },
    {
      title: "Occupation",
      value: `${occupation}%`,
      subtitle: "Taux d'occupation des salles",
      icon: <Power size={18} className="text-red-200" />,
      valueColor: "text-orange-400",
    },
  ];

  const liveOccupation = filteredSalles.slice(0, 4).map((salle) => {
    const reservationTrouvee = reservations.find(
      (reservation) => reservation.nom_salle === salle.nom_salle
    );

    return {
      name: salle.nom_salle,
      percent: reservationTrouvee ? 100 : 25,
      color: reservationTrouvee ? "bg-pink-500" : "bg-emerald-400",
    };
  });

  const rooms = filteredSalles.map((salle) => {
    const reservationTrouvee = reservations.find(
      (reservation) => reservation.nom_salle === salle.nom_salle
    );

    let statut = "LIBRE";
    let statutColor =
      "bg-emerald-500/15 text-emerald-400 border-emerald-400/20";

    if (reservationTrouvee) {
      const statutReservation = reservationTrouvee.statut?.toLowerCase();

      if (
        statutReservation === "confirmée" ||
        statutReservation === "confirmee"
      ) {
        statut = "OCCUPÉE";
        statutColor = "bg-red-500/15 text-red-400 border-red-400/20";
      } else {
        statut = "BIENTÔT";
        statutColor = "bg-orange-500/15 text-orange-400 border-orange-400/20";
      }
    }

    return {
      id: salle.id_salle,
      name: salle.nom_salle || `Salle ${salle.id_salle}`,
      code: `S${salle.id_salle}`,
      cap: salle.capacite ? `${salle.capacite} p.` : "-",
      etage: salle.localisation || "-",
      statut,
      statutColor,
    };
  });

  const todayBookings = reservations
    .filter((reservation) => {
      if (!reservation.date_reservation) return false;

      const today = new Date().toLocaleDateString("fr-CA");
      const reservationDate = new Date(
        reservation.date_reservation
      ).toLocaleDateString("fr-CA");

      return reservationDate === today;
    })
    .slice(0, 4)
    .map((reservation, index) => {
      const prenom = reservation.prenom || "";
      const nom = reservation.nom || "";
      const initials = `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase();

      return {
        room: reservation.nom_salle || `Salle ${index + 1}`,
        time:
          reservation.heure_debut && reservation.heure_fin
            ? `${reservation.heure_debut.slice(0, 5)} - ${reservation.heure_fin.slice(0, 5)}`
            : "Créneau réservé",
        person: `${prenom} ${nom}`.trim() || "Utilisateur",
        initials: initials || "RS",
        color: BOOKING_COLORS[index] || "from-cyan-400 to-blue-500",
      };
    });

  if (loading) {
    return (
      <div className="mt-10 flex min-h-screen items-center justify-center bg-[#030817] text-white">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220]/80 px-6 py-4 text-cyan-400">
          Chargement du dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030817] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.06),transparent_35%)]" />

          <div className="relative z-10 px-6 py-4 lg:px-8">
            <header className="mt-20 mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
                  Dashboard
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 w-[240px] items-center gap-2 rounded-xl border border-cyan-400/10 bg-[#09111f]/90 px-4 text-slate-400">
                  <Search size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une salle..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                  />
                </div>

                {isAdminUser && (
                  <button
                    onClick={() => navigate("/utilisateurs")}
                    className="flex h-10 items-center gap-2 rounded-lg border border-cyan-400/10 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:scale-[1.02]"
                  >
                    <Zap size={14} className="text-orange-500" />
                    Utilisateurs
                  </button>
                )}

                <button
                  onClick={() => navigate("/profil")}
                  className="flex h-10 items-center gap-2 rounded-lg border border-cyan-400/10 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:scale-[1.02]"
                >
                  <User size={14} className="text-violet-500" />
                  Profil
                </button>

                <button
                  onClick={() => navigate("/reservations")}
                  className="flex h-10 items-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
                >
                  <Plus size={14} />
                  Réserver
                </button>
              </div>
            </header>

            {isAdminUser && (
              <div className="mb-5 rounded-2xl border border-orange-400/20 bg-[#0b1220]/80 px-4 py-3 text-sm text-slate-200">
                <span className="font-semibold text-orange-300">
                  ⚡ Vue Administrateur
                </span>{" "}
                — Toutes les statistiques globales, tous les utilisateurs et
                toutes les réservations sont visibles.
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <section className="mb-5 grid gap-4 lg:grid-cols-3">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </section>

            <section className="mb-5">
              <OccupancyCard items={liveOccupation} />
            </section>

            <section className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <RoomsTable rooms={rooms} />

              <div className="space-y-5">
                <CalendarCard />
                <TodayBookings bookings={todayBookings} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/dashboard/Sidebar";
import { getUserFromToken } from "../utils/auth";
import { Plus, Pencil, Trash2, CalendarDays, Clock3 } from "lucide-react";

function ReservationsPage() {
  const currentUser = getUserFromToken();
  const isAdminUser = currentUser?.role === "admin";

  const [reservations, setReservations] = useState([]);
  const [salles, setSalles] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const [form, setForm] = useState({
    date_reservation: "",
    heure_debut: "",
    heure_fin: "",
    statut: "confirmée",
    id_utilisateur: "",
    id_salle: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reservationsRes, sallesRes, utilisateursRes] = await Promise.all([
        api.get("/reservation"),
        api.get("/salle"),
        api.get("/utilisateur"),
      ]);

      setReservations(Array.isArray(reservationsRes.data) ? reservationsRes.data : []);
      setSalles(Array.isArray(sallesRes.data) ? sallesRes.data : []);
      setUtilisateurs(Array.isArray(utilisateursRes.data) ? utilisateursRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des réservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sallesValides = useMemo(() => {
    return salles.filter((salle) => salle.nom_salle);
  }, [salles]);

  const utilisateursValides = useMemo(() => {
    return utilisateurs.filter((user) => user.nom && user.prenom);
  }, [utilisateurs]);

  const totalConfirmees = useMemo(() => {
    return reservations.filter((reservation) =>
      reservation.statut?.toLowerCase().includes("confirm")
    ).length;
  }, [reservations]);

  const resetForm = () => {
    setForm({
      date_reservation: "",
      heure_debut: "",
      heure_fin: "",
      statut: "confirmée",
      id_utilisateur: isAdminUser ? "" : String(currentUser?.id_utilisateur || ""),
      id_salle: "",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReservation(null);
    resetForm();
  };

  const openCreate = () => {
    setEditingReservation(null);
    setError("");
    setSuccess("");
    resetForm();
    setShowModal(true);
  };

  const openEdit = (reservation) => {
    setEditingReservation(reservation);
    setError("");
    setSuccess("");

    const matchedUser = utilisateursValides.find(
      (user) =>
        `${user.prenom} ${user.nom}`.trim() ===
        `${reservation.prenom} ${reservation.nom}`.trim()
    );

    const matchedSalle = sallesValides.find(
      (salle) => salle.nom_salle === reservation.nom_salle
    );

    const dateOnly = reservation.date_reservation
      ? new Date(reservation.date_reservation).toLocaleDateString("fr-CA")
      : "";

    setForm({
      date_reservation: dateOnly,
      heure_debut: reservation.heure_debut?.slice(0, 5) || "",
      heure_fin: reservation.heure_fin?.slice(0, 5) || "",
      statut: reservation.statut || "confirmée",
      id_utilisateur: isAdminUser
        ? String(matchedUser?.id_utilisateur || "")
        : String(currentUser?.id_utilisateur || ""),
      id_salle: String(matchedSalle?.id_salle || ""),
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (
      !form.date_reservation ||
      !form.heure_debut ||
      !form.heure_fin ||
      !form.id_salle
    ) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }

    if (isAdminUser && !form.id_utilisateur) {
      setError("Veuillez sélectionner un utilisateur.");
      return false;
    }

    if (!isAdminUser && !currentUser?.id_utilisateur) {
      setError("Utilisateur connecté introuvable.");
      return false;
    }

    if (form.heure_debut >= form.heure_fin) {
      setError("L'heure de fin doit être après l'heure de début.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const payload = {
      date_reservation: form.date_reservation,
      heure_debut: form.heure_debut,
      heure_fin: form.heure_fin,
      statut: form.statut,
      id_utilisateur: isAdminUser
        ? Number(form.id_utilisateur)
        : Number(currentUser?.id_utilisateur),
      id_salle: Number(form.id_salle),
    };

    try {
      if (editingReservation) {
        await api.put(`/reservation/${editingReservation.id_reservation}`, payload);
        setSuccess("Réservation mise à jour avec succès.");
      } else {
        await api.post("/reservation", payload);
        setSuccess("Réservation créée avec succès.");
      }

      closeModal();
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de l'enregistrement de la réservation."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cette réservation ?");
    if (!confirmed) return;

    try {
      await api.delete(`/reservation/${id}`);
      setSuccess("Réservation supprimée avec succès.");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030817] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.06),transparent_35%)]" />

          <div className="relative z-10 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
                  Réservations
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">
                  Gestion des réservations
                </h1>
              </div>

              <button
                onClick={openCreate}
                className="flex h-11 items-center gap-2 self-start rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
              >
                <Plus size={18} />
                Nouvelle réservation
              </button>
            </div>

            {success && (
              <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="mb-5 grid gap-4 md:grid-cols-3">
              <InfoCard
                title="Total réservations"
                value={String(reservations.length)}
                icon={<CalendarDays size={18} className="text-cyan-400" />}
              />
              <InfoCard
                title="Salles utilisées"
                value={String(new Set(reservations.map((r) => r.nom_salle)).size)}
                icon={<Clock3 size={18} className="text-orange-400" />}
              />
              <InfoCard
                title="Réservations confirmées"
                value={String(totalConfirmees)}
                icon={<CalendarDays size={18} className="text-emerald-400" />}
              />
            </div>

            <div className="overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85">
              <div className="border-b border-slate-800 px-5 py-5">
                <h2 className="text-2xl font-bold text-white">
                  Liste des réservations
                </h2>
              </div>

              <div className="hidden xl:grid grid-cols-[80px_130px_120px_120px_1fr_1fr_120px_100px] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
                <span>ID</span>
                <span>Date</span>
                <span>Début</span>
                <span>Fin</span>
                <span>Utilisateur</span>
                <span>Salle</span>
                <span>Statut</span>
                <span>Action</span>
              </div>

              {loading ? (
                <div className="px-5 py-8 text-slate-400">Chargement...</div>
              ) : reservations.length === 0 ? (
                <div className="px-5 py-8 text-slate-400">
                  Aucune réservation trouvée.
                </div>
              ) : (
                <>
                  <div className="xl:hidden space-y-3 p-4">
                    {reservations.map((reservation) => (
                      <div
                        key={reservation.id_reservation}
                        className="rounded-2xl border border-cyan-400/10 bg-[#09111f] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-white">
                              #{reservation.id_reservation} · {reservation.nom_salle}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {formatDate(reservation.date_reservation)}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {reservation.heure_debut?.slice(0, 5)} - {reservation.heure_fin?.slice(0, 5)}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {reservation.prenom} {reservation.nom}
                            </p>
                            <div className="mt-3">
                              <StatusBadge status={reservation.statut} />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEdit(reservation)}
                              className="text-slate-400 transition hover:text-cyan-400"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(reservation.id_reservation)}
                              className="text-slate-400 transition hover:text-red-400"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden xl:block">
                    {reservations.map((reservation) => (
                      <div
                        key={reservation.id_reservation}
                        className="grid grid-cols-[80px_130px_120px_120px_1fr_1fr_120px_100px] items-center border-t border-slate-800 px-5 py-5"
                      >
                        <span className="font-semibold text-white">
                          #{reservation.id_reservation}
                        </span>

                        <span className="text-slate-300">
                          {formatDate(reservation.date_reservation)}
                        </span>

                        <span className="text-slate-300">
                          {reservation.heure_debut?.slice(0, 5)}
                        </span>

                        <span className="text-slate-300">
                          {reservation.heure_fin?.slice(0, 5)}
                        </span>

                        <span className="text-slate-300">
                          {reservation.prenom} {reservation.nom}
                        </span>

                        <span className="text-slate-300">
                          {reservation.nom_salle}
                        </span>

                        <span>
                          <StatusBadge status={reservation.statut} />
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(reservation)}
                            className="text-slate-400 transition hover:text-cyan-400"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(reservation.id_reservation)}
                            className="text-slate-400 transition hover:text-red-400"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/10 bg-[#0b1220] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingReservation
                  ? "Modifier la réservation"
                  : "Créer une réservation"}
              </h2>

              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Date">
                <input
                  type="date"
                  name="date_reservation"
                  value={form.date_reservation}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-300 outline-none"
                />
              </FormField>

              <FormField label="Statut">
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-300 outline-none"
                >
                  <option value="confirmée">confirmée</option>
                  <option value="en attente">en attente</option>
                  <option value="annulée">annulée</option>
                </select>
              </FormField>

              <FormField label="Heure de début">
                <input
                  type="time"
                  name="heure_debut"
                  value={form.heure_debut}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-300 outline-none"
                />
              </FormField>

              <FormField label="Heure de fin">
                <input
                  type="time"
                  name="heure_fin"
                  value={form.heure_fin}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-300 outline-none"
                />
              </FormField>

              {isAdminUser ? (
                <FormField label="Utilisateur">
                  <select
                    name="id_utilisateur"
                    value={form.id_utilisateur}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-300 outline-none"
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {utilisateursValides.map((user) => (
                      <option key={user.id_utilisateur} value={user.id_utilisateur}>
                        {user.prenom} {user.nom}
                      </option>
                    ))}
                  </select>
                </FormField>
              ) : (
                <FormField label="Utilisateur connecté">
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || "Utilisateur"}
                    className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-500 outline-none"
                  />
                </FormField>
              )}

              <FormField label="Salle">
                <select
                  name="id_salle"
                  value={form.id_salle}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-cyan-400/10 bg-[#09111f] px-4 text-slate-300 outline-none"
                >
                  <option value="">Sélectionner une salle</option>
                  {sallesValides.map((salle) => (
                    <option key={salle.id_salle} value={salle.id_salle}>
                      {salle.nom_salle}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-xl border border-cyan-400/10 px-4 py-2 text-slate-300"
              >
                Annuler
              </button>

              <button
                onClick={handleSubmit}
                className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950"
              >
                {editingReservation ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value, icon }) {
  return (
    <div className="rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
          {title}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
          {icon}
        </div>
      </div>

      <p className="text-4xl font-extrabold text-cyan-400">{value}</p>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const value = status?.toLowerCase() || "";

  let classes = "bg-slate-500/15 text-slate-300 border-slate-400/20";

  if (value.includes("confirm")) {
    classes = "bg-emerald-500/15 text-emerald-400 border-emerald-400/20";
  } else if (value.includes("attente")) {
    classes = "bg-orange-500/15 text-orange-400 border-orange-400/20";
  } else if (value.includes("annul")) {
    classes = "bg-red-500/15 text-red-400 border-red-400/20";
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${classes}`}>
      {status}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

export default ReservationsPage;
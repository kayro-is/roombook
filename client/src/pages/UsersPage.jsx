import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/dashboard/Sidebar";
import { Plus, Pencil, Trash2, Shield, User } from "lucide-react";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/utilisateur");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalAdmins = useMemo(() => {
    return users.filter((user) => user.role === "admin").length;
  }, [users]);

  const totalUsers = useMemo(() => {
    return users.length;
  }, [users]);

  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      mot_de_passe: "",
      role: "user",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    resetForm();
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openCreate = () => {
    setEditingUser(null);
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setError("");
    setSuccess("");

    setForm({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email?.trim() || "",
      mot_de_passe: "",
      role: user.role || "user",
    });

    setShowModal(true);
  };

  const validateForm = () => {
    if (!form.prenom || !form.nom || !form.email) {
      setError("Veuillez remplir les champs obligatoires.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    if (!editingUser && !form.mot_de_passe) {
      setError("Le mot de passe est obligatoire pour créer un utilisateur.");
      return false;
    }

    if (form.mot_de_passe && form.mot_de_passe.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      if (editingUser) {
        const payload = {
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          email: form.email.trim(),
          role: form.role,
        };

        if (form.mot_de_passe.trim()) {
          payload.mot_de_passe = form.mot_de_passe;
        }

        await api.put(`/utilisateur/${editingUser.id_utilisateur}`, payload);
        setSuccess("Utilisateur modifié avec succès.");
      } else {
        const payload = {
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          email: form.email.trim(),
          mot_de_passe: form.mot_de_passe,
          role: form.role,
        };

        await api.post("/utilisateur", payload);
        setSuccess("Utilisateur créé avec succès.");
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de l'enregistrement de l'utilisateur."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cet utilisateur ?");
    if (!confirmed) return;

    try {
      await api.delete(`/utilisateur/${id}`);
      setSuccess("Utilisateur supprimé avec succès.");
      fetchUsers();
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

          <div className="relative z-10 px-6 py-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
                  Utilisateurs
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">
                  Gestion des utilisateurs
                </h1>
              </div>

              <button
                onClick={openCreate}
                className="flex h-11 items-center gap-2 rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
              >
                <Plus size={18} />
                Nouvel utilisateur
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
                title="Total utilisateurs"
                value={String(totalUsers)}
                icon={<User size={18} className="text-cyan-400" />}
              />
              <InfoCard
                title="Administrateurs"
                value={String(totalAdmins)}
                icon={<Shield size={18} className="text-orange-400" />}
              />
              <InfoCard
                title="Utilisateurs standard"
                value={String(totalUsers - totalAdmins)}
                icon={<User size={18} className="text-emerald-400" />}
              />
            </div>

            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220]/80 px-6 py-4 text-cyan-400">
                  Chargement des utilisateurs...
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id_utilisateur}
                    className="rounded-2xl border border-cyan-400/10 bg-[#0b1220]/85 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-white">
                          {user.prenom} {user.nom}
                        </h2>
                        <p className="mt-1 truncate text-sm text-slate-400">
                          {user.email?.trim() || "Email non renseigné"}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                            user.role === "admin"
                              ? "border-orange-400/20 bg-orange-500/15 text-orange-400"
                              : "border-cyan-400/20 bg-cyan-500/10 text-cyan-400"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(user)}
                          className="text-slate-400 transition hover:text-cyan-400"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(user.id_utilisateur)}
                          className="text-slate-400 transition hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220]/85 p-6 text-slate-400">
                    Aucun utilisateur trouvé.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan-400/10 bg-[#0b1220] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              {editingUser ? "Modifier" : "Créer"} un utilisateur
            </h2>

            <div className="space-y-4">
              <input
                name="prenom"
                placeholder="Prénom"
                value={form.prenom}
                onChange={handleChange}
                className="w-full rounded-xl bg-black px-4 py-3 text-white outline-none"
              />

              <input
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full rounded-xl bg-black px-4 py-3 text-white outline-none"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-black px-4 py-3 text-white outline-none"
              />

              <input
                name="mot_de_passe"
                type="password"
                placeholder={
                  editingUser
                    ? "Nouveau mot de passe (optionnel)"
                    : "Mot de passe"
                }
                value={form.mot_de_passe}
                onChange={handleChange}
                className="w-full rounded-xl bg-black px-4 py-3 text-white outline-none"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl bg-black px-4 py-3 text-white outline-none"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
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
                {editingUser ? "Mettre à jour" : "Créer"}
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

export default UsersPage;
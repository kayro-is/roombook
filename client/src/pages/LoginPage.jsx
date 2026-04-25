import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.mot_de_passe.trim()) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post("/utilisateur/login", {
        email: formData.email.trim(),
        mot_de_passe: formData.mot_de_passe,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="grid min-h-screen lg:grid-cols-[600px_1fr]">
        <div className="relative hidden lg:flex flex-col justify-between border-r border-cyan-500/10 bg-gradient-to-b from-[#07162d] via-[#05101f] to-[#020817] p-10">
          <div>
            <div className="mb-16 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/60 text-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                <span className="text-sm font-bold">RB</span>
              </div>

              <div>
                <p className="text-lg font-bold tracking-[0.10em] text-slate-200">
                  ROOMBOOK
                </p>
              </div>
            </div>

            <div className="max-w-md">
              <h1 className="text-5xl font-extrabold leading-tight text-slate-200">
                Gérez vos
                <br />
                <span className="text-cyan-400">salles avec</span>
                <br />
                précision.
              </h1>

              <p className="mt-8 text-lg leading-8 text-slate-400">
                Plateforme de réservation intelligente pour les équipes
                modernes. Sécurisée, rapide, intuitive.
              </p>
            </div>

            <div className="mt-14 space-y-4">
              <FeatureCard
                icon="🔒"
                title="Authentification sécurisée"
                subtitle="JWT · bcrypt · HTTPS"
              />
              <FeatureCard
                icon="⚡"
                title="Réservation instantanée"
                subtitle="Disponibilité en temps réel"
              />
              <FeatureCard
                icon="📊"
                title="Dashboard complet"
                subtitle="Stats & historique"
              />
              <FeatureCard
                icon="👥"
                title="Gestion des rôles"
                subtitle="Admin · Utilisateur"
              />
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Connexion
            </p>

            <h2 className="text-4xl font-bold text-white">
              Bonjour <span className="inline-block">👋</span>
            </h2>

            <p className="mt-3 text-slate-400">
              Connectez-vous à votre espace de réservation.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="test@test.com"
                  className="w-full rounded-xl border border-cyan-400/10 bg-[#081120] px-4 py-4 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Mot de passe
                  </label>
                  
                </div>

                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-cyan-400/10 bg-[#081120] px-4 py-4 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-400 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Connexion..." : "Se connecter →"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800"></div>
              <span className="text-sm uppercase tracking-[0.25em] text-slate-500">
                ou
              </span>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <p className="text-center text-slate-400">
              Pas encore de compte ?{" "}
              <Link
                to="/inscription"
                className="font-semibold text-cyan-400 hover:underline"
              >
                S’inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-5 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/30 text-emerald-400">
        ✓
      </div>
    </div>
  );
}

export default LoginPage;
import { useMemo, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import {Eye, EyeOff, Lock, ShieldCheck, Zap} from "lucide-react";

function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    departement: "",
    mot_de_passe: "",
    confirmPassword: "",
    conditions: false,
    notifications: true,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = [
    "Développement",
    "Ressources humaines",
    "Marketing",
    "Commercial",
    "Support",
  ];

  const passwordRules = useMemo(
    () => [
      {
        label: "8 caractères minimum",
        valid: formData.mot_de_passe.length >= 8,
      },
      {
        label: "Une majuscule",
        valid: /[A-Z]/.test(formData.mot_de_passe),
      },
      {
        label: "Un chiffre",
        valid: /[0-9]/.test(formData.mot_de_passe),
      },
      {
        label: "Un caractère spécial (!@#$...)",
        valid: /[^A-Za-z0-9]/.test(formData.mot_de_passe),
      },
    ],
    [formData.mot_de_passe]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (
      !formData.prenom.trim() ||
      !formData.nom.trim() ||
      !formData.email.trim() ||
      !formData.departement.trim()
    ) {
      setError("Veuillez remplir tous les champs du profil.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.mot_de_passe || !formData.confirmPassword) {
      setError("Veuillez remplir les deux champs mot de passe.");
      return false;
    }

    if (passwordRules.some((rule) => !rule.valid)) {
      setError("Le mot de passe ne respecte pas toutes les règles.");
      return false;
    }

    if (formData.mot_de_passe !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    setError("");
    setMessage("");

    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setMessage("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!formData.conditions) {
      setError("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        mot_de_passe: formData.mot_de_passe,
      };

      const response = await api.post("/utilisateur/", payload);

      setMessage(response.data.message || "Compte créé avec succès.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la création du compte.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#030817] text-white">
      <div className="grid min-h-screen lg:grid-cols-[600px_1fr]">
        <LeftPanel step={step} />

        <section className="relative flex items-center justify-center overflow-hidden px-6 py-10 sm:px-10 lg:px-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,170,255,0.06),transparent_42%)]" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.4))]" />
          </div>

          <div className="relative z-10 w-full max-w-[520px]">
            <TopProgress step={step} />

            {step === 1 && (
              <div>
                <SectionTag>Étape 01 / 03</SectionTag>
                <h2 className="mt-4 text-[42px] font-extrabold leading-none tracking-tight text-white sm:text-[52px]">
                  Votre profil
                </h2>
                <p className="mt-4 text-[18px] leading-7 text-slate-400">
                  Commençons par vos informations de base.
                </p>

                <div className="mt-10 space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Prénom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Alice"
                    />
                    <Field
                      label="Nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Lemaire"
                    />
                  </div>

                  <Field
                    label="Adresse email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alice@entreprise.com"
                  />

                  <SelectField
                    label="Département"
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    options={departments}
                  />

                  <PrimaryButton onClick={nextStep}>
                    Continuer <span className="ml-2">→</span>
                  </PrimaryButton>

                  <Separator />

                  <p className="text-center text-[17px] text-slate-400">
                    Déjà un compte ?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <SectionTag>Étape 02 / 03</SectionTag>
                <h2 className="mt-4 text-[42px] font-extrabold leading-none tracking-tight text-white sm:text-[52px]">
                  Sécurité
                </h2>
                <p className="mt-4 text-[18px] leading-7 text-slate-400">
                  Choisissez un mot de passe robuste.
                </p>

                <div className="mt-10 space-y-6">
                  <PasswordField
                    label="Mot de passe"
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    placeholder="Min. 8 caractères"
                    show={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                    
                    
                  />
                  
                  

                  <PasswordField
                    label="Confirmer"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Répéter..."
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  />

                  <div className="rounded-[20px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(16,24,40,0.92),rgba(10,16,28,0.96))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
                      Règles de sécurité
                    </p>

                    <div className="space-y-3">
                      {passwordRules.map((rule) => (
                        <RuleItem
                          key={rule.label}
                          label={rule.label}
                          valid={rule.valid}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SecondaryButton onClick={prevStep}>
                      ← Retour
                    </SecondaryButton>
                    <PrimaryButton onClick={nextStep}>
                      Continuer <span className="ml-2">→</span>
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <SectionTag>Étape 03 / 03</SectionTag>
                <h2 className="mt-4 text-[42px] font-extrabold leading-none tracking-tight text-white sm:text-[52px]">
                  Confirmation
                </h2>
                <p className="mt-4 text-[18px] leading-7 text-slate-400">
                  Vérifiez vos informations avant création.
                </p>

                <div className="mt-10 space-y-5">
                  <div className="rounded-[26px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(16,24,40,0.92),rgba(10,16,28,0.96))] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                    <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
                      Récapitulatif
                    </p>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <SummaryItem label="Prénom" value={formData.prenom} />
                      <SummaryItem label="Nom" value={formData.nom} />
                      <SummaryItem
                        label="Email"
                        value={formData.email}
                        highlight
                      />
                      <SummaryItem
                        label="Mot de passe"
                        value="••••••••"
                        highlight
                      />
                      <SummaryItem
                        label="Département"
                        value={`💻 ${formData.departement}`}
                      />
                    </div>
                  </div>

                  <CheckCard
                    checked={formData.conditions}
                    onChange={handleChange}
                    name="conditions"
                    title="Conditions d'utilisation"
                    description={
                      <>
                        J&apos;accepte les{" "}
                        <span className="text-cyan-400">
                          conditions générales
                        </span>{" "}
                        et la{" "}
                        <span className="text-cyan-400">
                          politique de confidentialité
                        </span>
                        .
                      </>
                    }
                  />

                  <CheckCard
                    checked={formData.notifications}
                    onChange={handleChange}
                    name="notifications"
                    title="Notifications email"
                    description="Recevoir confirmations et rappels de réservation."
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <SecondaryButton onClick={prevStep}>
                      ← Retour
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit} disabled={loading}>
                      {loading ? "Création..." : "Créer mon compte ✓"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            )}

            {(error || message) && (
              <div className="mt-6">
                {error && (
                  <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-[15px] text-red-400">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="rounded-[18px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-[15px] text-emerald-400">
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function LeftPanel({ step }) {
  return (
    <aside className="relative hidden overflow-hidden border-r border-cyan-400/10 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(86,88,255,0.16),transparent_26%),linear-gradient(to_bottom,#0b1a2d,#071221_56%,#020817)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:38px_38px]" />
      <div className="absolute -bottom-28 left-1/2 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 p-10">
        <div className="mb-14 flex items-center gap-4">
          <div className="flex h-13 w-13 items-center justify-center rounded-[16px] border border-cyan-400/80 text-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.18)]">
            <span className="text-[12px] font-bold tracking-[0.25em]">RM</span>
          </div>

          <div>
            <p className="text-[20px] font-bold tracking-[0.10em] text-slate-100">
              ROOM
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
               BOOKING
            </p>
          </div>
        </div>

        <div className="max-w-[300px]">
          <h1 className="text-[61px] font-extrabold leading-[0.94] tracking-tight text-slate-300">
            Rejoignez
            <br />
            <span className="text-cyan-400">l&apos;espace de</span>
            <br />
            travail.
          </h1>

          <p className="mt-8 text-[16px] leading-8 text-slate-400">
            Créez votre compte en quelques secondes et accédez à la plateforme
            de réservation de votre entreprise.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <FeatureCard
            icon="🔐"
            title="Mot de passe chiffré"
            subtitle="bcrypt hashing"
          />
          <FeatureCard
            icon="💳"
            title="Token JWT sécurisé"
            subtitle="Expiration automatique"
          />
          <FeatureCard
            icon="⚡"
            title="Accès immédiat"
            subtitle="Réservez dès l'inscription"
          />
        </div>
      </div>

      <div className="relative z-10 px-10 pb-10">
        <div className="flex items-center gap-3">
          <StepNode number={1} label="Profil" active={step >= 1} />
          <div className={`h-px w-14 ${step >= 2 ? "bg-cyan-400" : "bg-slate-700"}`} />
          <StepNode number={2} label="Sécurité" active={step >= 2} />
          <div className={`h-px w-14 ${step >= 3 ? "bg-cyan-400" : "bg-slate-700"}`} />
          <StepNode number={3} label="Confirm." active={step >= 3} />
        </div>
      </div>
    </aside>
  );
}

function TopProgress({ step }) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`h-[3px] flex-1 rounded-full transition ${
            step >= item
              ? "bg-[linear-gradient(90deg,#39f3ff,#15bfff)] shadow-[0_0_10px_rgba(34,211,238,0.25)]"
              : "bg-slate-700/80"
          }`}
        />
      ))}
    </div>
  );
}

function SectionTag({ children }) {
  return (
    <p className="inline-block border-l-2 border-cyan-400 pl-4 text-[11px] font-semibold uppercase tracking-[0.36em] text-cyan-400">
      {children}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
        {label}
      </label>
      <div className="group relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-[58px] w-full rounded-[18px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(16,24,40,0.92),rgba(10,16,28,0.96))] px-5 pr-12 text-[18px] text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
        />
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-700 group-focus-within:text-cyan-400/60">
          ◇
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-[58px] w-full appearance-none rounded-[18px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(16,24,40,0.92),rgba(10,16,28,0.96))] px-5 pr-12 text-[18px] text-slate-300 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
        >
          <option value="">Sélectionner...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-600">
          ▾
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-[58px] w-full rounded-[18px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(16,24,40,0.92),rgba(10,16,28,0.96))] px-5 pr-14 text-[18px] text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
        />

      <button
  type="button"
  onClick={onToggle}
  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-cyan-400"
>
  {show ? <EyeOff size={20} /> : <Eye size={20} />}
</button>
      </div>
    </div>
  );
}

function RuleItem({ label, valid }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
          valid
            ? "border-cyan-400/70 text-cyan-400"
            : "border-slate-600 text-slate-600"
        }`}
      >
        {valid ? "✓" : "○"}
      </div>
      <span className={valid ? "text-slate-300" : "text-slate-500"}>
        {label}
      </span>
    </div>
  );
}

function CheckCard({ checked, onChange, name, title, description }) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-[20px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(16,24,40,0.92),rgba(10,16,28,0.96))] px-5 py-5">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-cyan-400"
      />
      <div>
        <p className="text-[25px] font-semibold leading-none text-slate-100">
          {title}
        </p>
        <p className="mt-2 text-[15px] leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </label>
  );
}

function SummaryItem({ label, value, highlight = false }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
        {label}
      </p>
      <p
        className={`text-[17px] font-semibold ${
          highlight ? "text-cyan-400" : "text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-cyan-400/10 bg-cyan-400/5 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-cyan-400/10 text-cyan-400">
          <span className="text-[18px]">{icon}</span>
        </div>

        <div>
          <p className="text-[15px] font-semibold text-white">{title}</p>
          <p className="text-[14px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/30 text-emerald-400">
        ✓
      </div>
    </div>
  );
}

function StepNode({ number, label, active }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold ${
          active
            ? "border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.18)]"
            : "border-slate-600 text-slate-600"
        }`}
      >
        {number}
      </div>
      <span
        className={`text-[13px] font-semibold ${
          active ? "text-cyan-400" : "text-slate-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-[60px] w-full rounded-[18px] bg-[linear-gradient(90deg,#2de2ff,#11c5ff)] text-[22px] font-semibold text-slate-950 shadow-[0_8px_30px_rgba(0,200,255,0.12)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[60px] w-full rounded-[18px] border border-cyan-400/15 bg-transparent text-[20px] font-medium text-slate-300 transition hover:border-cyan-400/35 hover:text-white"
    >
      {children}
    </button>
  );
}

function Separator() {
  return (
    <div className="flex items-center gap-4 pt-1">
      <div className="h-px flex-1 bg-slate-800" />
      <span className="text-[11px] uppercase tracking-[0.3em] text-slate-600">
        ou
      </span>
      <div className="h-px flex-1 bg-slate-800" />
    </div>
  );
}

export default RegisterPage;
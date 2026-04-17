import Sidebar from "../components/dashboard/Sidebar";
import { getUserFromToken } from "../utils/auth";
import { Shield, Mail, KeyRound, BadgeCheck } from "lucide-react";

function ProfilePage() {
  const user = getUserFromToken();

  const displayName = user?.email || "Utilisateur";
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "US";
  const role = user?.role || "user";

  return (
    <div className="min-h-screen bg-[#030817] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.06),transparent_35%)]" />

          <div className="relative mt-15 mb-10 p-6 lg:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Profil
            </p>

            <h1 className="mt-2 text-3xl font-bold">Mon profil</h1>

            <div className="mt-8 max-w-3xl rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 p-6">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-xl font-bold text-white">
                  {initials}
                </div>

                <div>
                  <p className="text-2xl font-bold text-white">{displayName}</p>
                  <p className="text-slate-400">{role}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ProfileItem
                  icon={<KeyRound size={18} className="text-cyan-400" />}
                  label="ID utilisateur"
                  value={user?.id_utilisateur || "-"}
                />
                <ProfileItem
                  icon={<Mail size={18} className="text-cyan-400" />}
                  label="Email"
                  value={user?.email || "-"}
                />
                <ProfileItem
                  icon={<Shield size={18} className="text-orange-400" />}
                  label="Rôle"
                  value={role}
                />
                <ProfileItem
                  icon={<BadgeCheck size={18} className="text-emerald-400" />}
                  label="Session active"
                  value={user ? "Oui" : "Non"}
                />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f] p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default ProfilePage;
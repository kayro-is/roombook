import { useState } from "react";
import {
  LayoutDashboard,
  DoorOpen,
  Clock3,
  Users,
  UserCircle2,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken, removeToken } from "../../utils/auth";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.email?.trim() || "Utilisateur";
  const initials = user?.email
    ? user.email.trim().slice(0, 2).toUpperCase()
    : "US";
  const role = user?.role || "user";
  const isAdmin = role === "admin";

  const menu = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Salles",
      path: "/salles",
      icon: <DoorOpen size={18} />,
    },
    {
      label: "Réservations",
      path: "/reservations",
      icon: <Clock3 size={18} />,
    },
    {
      label: "Utilisateurs",
      path: "/utilisateurs",
      icon: <Users size={18} />,
      adminOnly: true,
    },
    {
      label: "Mon profil",
      path: "/profil",
      icon: <UserCircle2 size={18} />,
    },
  ];

  const visibleMenu = menu.filter((item) => !item.adminOnly || isAdmin);

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };

  const handleMobileNavigate = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="fixed inset-x-0 top-0  z-50 border-b border-cyan-400/10 bg-[#08111f]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/70 text-cyan-400">
              <span className="text-xs font-bold tracking-[0.2em]">RB</span>
            </div>

            <div>
              <p className="text-sm font-bold tracking-[0.12em] text-slate-100">
                ROOMBOOK
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Navigation
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-cyan-400/10 p-2 text-slate-300"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] w-[280px] transform border-r border-cyan-400/10 bg-[radial-gradient(circle_at_bottom,rgba(80,120,255,0.14),transparent_26%),linear-gradient(to_bottom,#0a1a2d,#071221_56%,#020817)] transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:38px_38px]" />

        <div className="relative z-10 flex h-full flex-col px-4 py-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/70 text-cyan-400">
                <span className="text-xs font-bold tracking-[0.2em]">RB</span>
              </div>

              <div>
                <p className="text-sm font-bold tracking-[0.12em] text-slate-100">
                  ROOMBOOK
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Menu
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-cyan-400/10 p-2 text-slate-300"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-3">
            {visibleMenu.map((item) => {
              const active = isActivePath(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleMobileNavigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
                    active
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-cyan-400/5 hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  <span className="text-[16px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220]/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {displayName}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                      {role}
                    </p>

                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        <ShieldCheck size={10} />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-red-500/10 px-4 py-4 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
            >
              <LogOut size={18} />
              <span className="text-[16px] font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="relative hidden w-[220px] shrink-0 border-r border-cyan-400/10 bg-[radial-gradient(circle_at_bottom,rgba(80,120,255,0.14),transparent_26%),linear-gradient(to_bottom,#0a1a2d,#071221_56%,#020817)] lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:38px_38px]" />

        <div className="relative z-10 flex flex-1 flex-col px-4 py-6">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/80 text-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
              <span className="text-sm font-bold tracking-[0.25em]">RB</span>
            </div>
          </div>

          <nav className="space-y-3">
            {visibleMenu.map((item) => {
              const active = isActivePath(item.path);

              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 transition ${
                      active
                        ? "bg-cyan-400/10 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.08)]"
                        : "text-slate-500 hover:bg-cyan-400/5 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span className="text-[16px] font-medium">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1220]/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {displayName}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                      {role}
                    </p>

                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        <ShieldCheck size={10} />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-red-500/10 px-4 py-4 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
            >
              <LogOut size={18} />
              <span className="text-[16px] font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
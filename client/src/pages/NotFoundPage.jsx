import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030817] px-6 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
        Erreur 404
      </p>
      <h1 className="mt-4 text-5xl font-bold">Page introuvable</h1>
      <p className="mt-4 text-slate-400">
        La page demandée n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
      >
        Retour au dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
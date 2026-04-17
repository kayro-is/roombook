import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StatCard({
  title = "Statistique",
  value = "0",
  subtitle = "",
  icon,
  valueColor = "text-cyan-400",
  trend, // Exemple : { value: "+12%", positive: true }
  linkTo, // Route de redirection optionnelle
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  const isClickable = Boolean(linkTo);

  return (
    <div
      onClick={handleClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={title}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          handleClick();
        }
      }}
      className={`rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 p-5 
        shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition
        ${isClickable ? "cursor-pointer hover:border-cyan-400/30 hover:bg-[#0d1628]" : ""}
      `}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600">
          {title}
        </p>

        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <p className={`text-5xl font-extrabold leading-none ${valueColor}`}>
          {value}
        </p>

        {/* Trend indicator */}
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend.value}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

export default StatCard;
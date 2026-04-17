import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CalendarCard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Jours de la semaine (format français)
  const daysOfWeek = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  // Mois et année affichés
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Nom du mois en français
  const monthName = currentDate.toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  // Premier jour du mois
  const firstDayOfMonth = new Date(year, month, 1);

  // Nombre de jours dans le mois
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Ajustement pour que la semaine commence le lundi
  let startingDay = firstDayOfMonth.getDay();
  startingDay = startingDay === 0 ? 6 : startingDay - 1;

  // Navigation entre les mois
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Date actuelle (pour mise en évidence)
  const today = new Date();

  // Génération des cellules du calendrier
  const calendarDays = [];

  // Cases vides avant le premier jour
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} />);
  }

  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const isSelected =
      selectedDate &&
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear();

    calendarDays.push(
      <button
        key={day}
        onClick={() => setSelectedDate(new Date(year, month, day))}
        className={`flex h-9 items-center justify-center rounded-xl transition ${
          isSelected
            ? "bg-cyan-400 text-slate-950 font-bold"
            : isToday
            ? "border border-cyan-400 text-cyan-400 font-semibold"
            : "text-slate-400 hover:bg-cyan-400/10 hover:text-white"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-400/10 bg-[#0b1220]/85 p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white capitalize">
          {monthName}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-widest text-slate-600">
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {calendarDays}
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <div className="mt-4 rounded-xl border border-cyan-400/10 bg-[#09111f] p-3 text-center text-sm text-slate-300">
          Date sélectionnée :{" "}
          <span className="font-semibold text-cyan-400">
            {selectedDate.toLocaleDateString("fr-FR")}
          </span>
        </div>
      )}
    </div>
  );
}

export default CalendarCard;
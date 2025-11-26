interface User {
  name: string;
  avatar?: string;
}

interface UniversalCardProps {
  title: string; // e.g. "Po 1 valandos" or "Kaunas!"
  subtitle?: string; // e.g. "Rytoj"
  time: string; // e.g. "13:00–15:00"
  users: User[]; // 1 or more users
  icon?: string; // emoji e.g. "🏀"
  highlighted?: boolean; // yellowish background for selected card
}

function EventCard({
  title,
  subtitle,
  time,
  users,
  icon,
  highlighted,
}: UniversalCardProps) {
  return (
    <div
      className={
        "px-4 py-3 w-48 rounded-xl shadow flex flex-col gap-1 border transition " +
        (highlighted
          ? "bg-yellow-50 border-yellow-200"
          : "bg-white border-gray-200")
      }
    >
      <div className="flex items-center gap-2">
        {/* Avatar(s) */}
        <div className="flex -space-x-2">
          {users.map((u) => (
            <img
              alt="User profile"
              key={u.name}
              src={u.avatar || "/default-avatar.png"}
              className="w-6 h-6 rounded-full border border-white"
            />
          ))}
        </div>

        {/* Emoji */}
        {icon && <span className="text-lg ml-auto">{icon}</span>}
      </div>

      {/* Title + Time */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
        <span className="text-xs text-gray-700">{time}</span>
      </div>

      {/* User list label */}
      <span className="text-xs text-gray-600 truncate">
        {users.map((u) => u.name).join(", ")}
      </span>
    </div>
  );
}

export default EventCard;

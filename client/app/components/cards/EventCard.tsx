import { FaUserCircle } from "react-icons/fa";

export default function EventCard({
  title,
  subtitle,
  startDateTime,
  endDateTime,
  users,
  onClick,
}) {
  const inviter = users[0];

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="px-4 py-3 w-64 rounded-xl shadow flex gap-4 border bg-white border-gray-200 cursor-pointer hover:shadow-lg transition text-left"
    >
      <div className="flex flex-col items-center w-16">
        {inviter?.avatar ? (
          <img
            src={inviter.avatar}
            alt={`${inviter.name} avatar`}
            className="w-8 h-8 rounded-full mb-1"
          />
        ) : (
          <FaUserCircle
            className="w-8 h-8 text-gray-400 mb-1"
            aria-hidden="true"
          />
        )}
        <span className="text-xs text-gray-600 text-center">
          {inviter.name}
        </span>
      </div>

      <div className="flex flex-col flex-1">
        <span className="font-semibold text-base">{title}</span>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        <span className="font-semibold text-lg mt-1">
          {startDateTime.slice(11, 16)}–{endDateTime.slice(11, 16)}
        </span>
      </div>
    </button>
  );
}

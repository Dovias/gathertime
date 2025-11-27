import { X } from "react-feather";
import { FaUserCircle } from "react-icons/fa";

export default function EventDetails({
  meeting,
  onClose,
  onConfirm,
  onDecline,
}) {
  if (!meeting) return null;

  const start = new Date(meeting.startDateTime);
  const end = new Date(meeting.endDateTime);

  const participants =
    meeting.participants?.map((p) => ({
      name: `${p.firstName} ${p.lastName}`,
      avatar: null,
    })) || [];

  return (
    <div
      className="p-10 bg-white rounded-3xl border border-gray-300 shadow-lg max-w-5xl mx-auto relative"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
        aria-label="Uždaryti"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      <h1 className="text-3xl font-semibold mb-10 text-center">
        {meeting.summary}
      </h1>

      <div className="grid grid-cols-[150px_1fr_160px] gap-10">
        <div className="flex flex-col gap-10">
          {participants.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-1">
              {p.avatar ? (
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <FaUserCircle
                  className="w-16 h-16 text-gray-400"
                  aria-hidden="true"
                />
              )}
              <span className="text-sm">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          <div className="text-left">
            <p className="text-sm text-gray-600">Pradžia</p>
            <p className="font-semibold text-lg">
              {start.toLocaleString("lt-LT", {
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                weekday: "long",
              })}{" "}
              val.
            </p>
          </div>

          <div className="text-left">
            <p className="text-sm text-gray-600">Pabaiga</p>
            <p className="font-semibold text-lg">
              {end.toLocaleString("lt-LT", {
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                weekday: "long",
              })}{" "}
              val.
            </p>
          </div>

          <div className="text-left">
            <p className="text-sm text-gray-600">Lokacija</p>
            {meeting.location ? (
              <iframe
                title="Lokacija"
                src={meeting.location}
                className="w-full h-48 rounded-xl mt-3 border"
              />
            ) : (
              <p className="text-gray-500 italic mt-2">Nenurodyta</p>
            )}
          </div>

          <div className="text-left">
            <p className="text-sm text-gray-600">Aprašymas</p>
            <p className="mt-2">{meeting.description || "Nėra aprašymo"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={onConfirm}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg shadow"
          >
            Sutikti
          </button>

          <button
            type="button"
            onClick={onDecline}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg shadow"
          >
            Atšaukti
          </button>
        </div>
      </div>
    </div>
  );
}

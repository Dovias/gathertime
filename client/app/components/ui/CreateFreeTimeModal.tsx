import { useMemo, useState } from "react";
import type { PastimeType } from "../../models/enums/PastimeType";
import type { CreateFreeTimeRequestDTO } from "../../models/CreateFreeTimeRequestDTO";

type Props = {
  isOpen: boolean;
  userId: number;
  onClose: () => void;
  onSubmit: (payload: CreateFreeTimeRequestDTO) => Promise<void>;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Backend expects: "yyyy-MM-dd'T'HH:mm"
const toBackendLocalDateTimeNoSeconds = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;

export default function CreateFreeTimeModal({ isOpen, userId, onClose, onSubmit }: Props) {
  const now = useMemo(() => new Date(), []);
  const [start, setStart] = useState(() => toBackendLocalDateTimeNoSeconds(now));
  const [end, setEnd] = useState(() => {
    const e = new Date(now);
    e.setHours(e.getHours() + 1);
    return toBackendLocalDateTimeNoSeconds(e);
  });

  const [pastimeType, setPastimeType] = useState<PastimeType>("NEUTRAL");
  const [publicForAllFriends, setPublicForAllFriends] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <button
      type="button"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Enter" && onClose()}
      className="fixed inset-0 bg-black/40 backdrop-blur flex justify-center items-center z-50"
    >
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="bg-white rounded-lg w-[520px] p-6 text-left shadow-lg outline-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Registruoti laiką</h2>
          <button type="button" onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Pradžia</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="datetime-local"
              value={start.replace("T", "T")} // keep as is
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Pabaiga</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipas</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={pastimeType}
              onChange={(e) => setPastimeType(e.target.value as PastimeType)}
            >
              <option value="ENERGETIC">ENERGETIC</option>
              <option value="NEUTRAL">NEUTRAL</option>
              <option value="RELAX">RELAX</option>
              <option value="SHOPPING">SHOPPING</option>
              <option value="TRAVEL">TRAVEL</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-50"
              disabled={saving}
            >
              Atšaukti
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setError(null);
                try {
                  await onSubmit({
                    userId,
                    startDateTime: start,
                    endDateTime: end,
                    publicForAllFriends,
                    pastimeType,
                    activityIds: [],
                  });
                  onClose();
                } catch (e: any) {
                  setError(e?.response?.data?.message ?? "Nepavyko sukurti laiko.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saugoma..." : "Išsaugoti"}
            </button>
          </div>
        </div>
      </button>
    </button>
  );
}

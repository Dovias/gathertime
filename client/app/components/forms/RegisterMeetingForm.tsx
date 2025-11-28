import { useState } from "react";
import type { MeetingStatus } from "../../models/enums/MeetingStatus.ts";
import type { FreeTime } from "../../models/FreeTime.ts";

export type RegisterMeetingFormData = {
  summary: string | null;
  description: string | null;
  location: string | null;
  freeTimeId: number;
  maxParticipants: number;
};

export type RegisterMeetingFormProps = {
  freeTimes: FreeTime[];
  onClose: () => void;
  onSubmit: (data: RegisterMeetingFormData) => void;
};

export default function ({
  freeTimes,
  onClose,
  onSubmit,
}: RegisterMeetingFormProps) {
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    location: "",
    freeTimeId: freeTimes.filter((freeTime) => freeTime.meeting === null).pop()
      ?.id,
    maxParticipants: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const meetingData = {
      summary: formData.summary || null,
      description: formData.description || null,
      location: formData.location || null,
      freeTimeId: formData.freeTimeId,
      maxParticipants: formData.maxParticipants,
      status: "ARRANGED" as MeetingStatus,
      activityIds: null,
    };

    onSubmit(meetingData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({
      ...formData,
      [name]:
        name === "maxParticipants"
          ? value
            ? parseInt(value, 10)
            : null
          : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Registruoti susitikimą
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pavadinimas
            </label>
            <input
              id="summary"
              type="text"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aprašymas
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vieta
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Laisvas laikas
            </label>
            <select
              name="freeTimeId"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {freeTimes
                .filter((freeTime) => freeTime.meeting === null)
                .map((freeTime) => (
                  <option value={freeTime.id} key={freeTime.id}>
                    {freeTime.startDateTime.toString().replace("T", ", ")}
                    {" – "}
                    {freeTime.endDateTime.toString().replace("T", ", ")}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="maxParticipants"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maksimalus dalyvių skaičius
            </label>
            <input
              id="maxParticipants"
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants || ""}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Išssaugoti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

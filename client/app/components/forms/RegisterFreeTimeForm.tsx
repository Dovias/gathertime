import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type RegisterFreeTimeFormData = {
  startDateTime: string;
  endDateTime: string;
};

export type RegisterFreeTimeFormProps = {
  onClose: () => void;
  onSubmit: (data: RegisterFreeTimeFormData) => void;
};

export default function ({ onClose, onSubmit }: RegisterFreeTimeFormProps) {
  const [formData, setFormData] = useState({
    startDateTime: null as Date | null,
    endDateTime: null as Date | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDateTime || !formData.endDateTime) {
      alert("Prašome pasirinkti pradžios ir pabaigos laiką");
      return;
    }

    if (formData.endDateTime <= formData.startDateTime) {
      alert("Pabaigos laikas turi būti vėlesnis už pradžios laiką");
      return;
    }

    const freeTimeData = {
      startDateTime: formData.startDateTime.toISOString().slice(0, 16),
      endDateTime: formData.endDateTime.toISOString().slice(0, 16),
    };

    onSubmit(freeTimeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {"Registruoti laisvą laiką"}
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
              htmlFor="startDateTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pradžios laikas
            </label>
            <DatePicker
              id="startDateTime"
              selected={formData.startDateTime}
              onChange={(date) =>
                setFormData({ ...formData, startDateTime: date })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyy-MM-dd HH:mm"
              locale="lt"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Pasirinkite pradžios laiką"
            />
          </div>

          <div>
            <label
              htmlFor="endDateTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pabaigos laikas
            </label>
            <DatePicker
              id="endDateTime"
              selected={formData.endDateTime}
              onChange={(date) =>
                setFormData({ ...formData, endDateTime: date })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyy-MM-dd HH:mm"
              locale="lt"
              minDate={formData.startDateTime || undefined}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Pasirinkite pabaigos laiką"
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

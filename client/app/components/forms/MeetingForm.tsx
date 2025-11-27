import { useState } from "react";
import { MeetingFormProps } from "../../models/MeetingFormProps.ts";
import { MeetingStatus } from "../../models/enums/MeetingStatus.ts";
import DatePicker, { registerLocale } from "react-datepicker";
import { lt } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css";

registerLocale("lt", lt);

export default function MeetingForm({ onClose, onSubmit, formType }: MeetingFormProps ) {
    const [formData, setFormData] = useState({
        summary: "",
        description: "",
        location: "",
        startDateTime: null as Date | null,
        endDateTime: null as Date | null,
        maxParticipants: formType === "meeting" ? 10 : null as number | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.startDateTime || !formData.endDateTime) {
            alert("Prašome pasirinkti pradžios ir pabaigos laiką");
            return;
        }

        const meetingData = {
            startDateTime: formData.startDateTime.toISOString().slice(0, 19),
            endDateTime: formData.endDateTime.toISOString().slice(0, 19),
            summary: formData.summary || null,
            description: formData.description || null,
            location: formData.location || null,
            maxParticipants: formData.maxParticipants,
            status: "ARRANGED" as MeetingStatus,
            freeTimeId: null,
            activityIds: null,
        };

        onSubmit(meetingData);
        onClose();
    };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         const { name, value } = e.target;
         setFormData({
             ...formData,
             [name]: name === "maxParticipants" ? (value ? parseInt(value) : null) : value,
         });
     }

     return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold text-gray-800">
                         {formType === "meeting" ? "Registruoti susitikimą" : "Registruoti laisvą laiką"}
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
                     {formType === "meeting" && (
                         <>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                             Pavadinimas
                         </label>
                         <input
                             type="text"
                             name="summary"
                             value={formData.summary}
                             onChange={handleChange}
                             required
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                     </div>

                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                             Aprašymas
                         </label>
                         <textarea
                             name="description"
                             value={formData.description}
                             onChange={handleChange}
                             rows={3}
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                     </div>

                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                             Vieta
                         </label>
                         <input
                             type="text"
                             name="location"
                             value={formData.location}
                             onChange={handleChange}
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                     </div>
                     </>
             )}

                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                             Pradžios laikas
                         </label>
                         <DatePicker
                             selected={formData.startDateTime}
                             onChange={(date) => setFormData({ ...formData, startDateTime: date})}
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
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                             Pabaigos laikas
                         </label>
                         <DatePicker
                         selected={formData.endDateTime}
                         onChange={(date) => setFormData({ ...formData, endDateTime: date})}
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

                     {formType === "meeting" && (
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Maksimalus dalyvių skaičius
                             </label>
                             <input
                                 type="number"
                                 name="maxParticipants"
                                 value={formData.maxParticipants || ""}
                                 onChange={handleChange}
                                 min="1"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                         </div>
                     )}

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
     )
}

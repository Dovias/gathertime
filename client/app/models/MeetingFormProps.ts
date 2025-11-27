import {Meeting, MeetingOwner} from "./Meeting.ts";

export type MeetingFormProps = {
    onClose: () => void;
    onSubmit: (meeting: Omit<Meeting, 'id' | 'owner' | 'participants'>) => void;
    formType: "meeting" | "free-time";
    owner: MeetingOwner;
};
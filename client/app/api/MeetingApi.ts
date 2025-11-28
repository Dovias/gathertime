import axios from "axios";

export const meetingStatus = {
	arranged: "ARRANGED",
	confirmed: "CONFIRMED",
	canceled: "CANCELED",
	timeout: "TIMEOUT",
} as const;

export type MeetingStatus = (typeof meetingStatus)[keyof typeof meetingStatus];

export type MeetingParticipant = {
	id: number;
	firstName: string;
	lastName: string;
};

export type MeetingOwner = MeetingParticipant;

export type Meeting = {
	id: number;

	startDateTime: string;
	endDateTime: string;

	summary: string | null;
	description: string | null;
	location: string | null;

	maxParticipants: number | null;
	status: MeetingStatus;

	freeTimeId: number | null;
	owner: MeetingOwner;

	participants: MeetingParticipant[];
	activityIds: number[] | null;
};

export const getMeeting = async (meetingId: number): Promise<Meeting> => {
	const res = await axios.get<Meeting>(`/meeting/${meetingId}`);
	return res.data;
};

export const confirmInvitation = async (invitationId: number) => {
	await axios.put(`/meeting/invitation/${invitationId}/confirm`);
};

export const declineInvitation = async (invitationId: number) => {
	await axios.put(`/meeting/invitation/${invitationId}/decline`);
};

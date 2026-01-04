import type { Meeting } from "../models/Meeting";
import type { Invitation } from "../models/Invitation.ts";

export type InvitationItem = {
    invitation: Invitation;
    meeting: Meeting;
};

export function getFriendForInvitation(item: InvitationItem) {
    const inviterId = item.invitation.inviterId;
    const meeting = item.meeting;

    if (Number(meeting.owner.id) === inviterId) {
        return meeting.owner;
    }

    return meeting.participants.find((p) => Number(p.id) === inviterId) || null;
}

export function getFriendForMeeting(meeting: Meeting, userId: number) {
    return (meeting as any)?.owner?.id === userId
        ? (meeting as any)?.participants?.find((u: any) => Number(u.id) !== userId)
        : (meeting as any)?.owner;
}
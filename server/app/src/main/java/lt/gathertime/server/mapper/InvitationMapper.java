package lt.gathertime.server.mapper;

import java.time.LocalDateTime;

import lt.gathertime.server.dto.invitation.InvitationRequestDTO;
import lt.gathertime.server.dto.invitation.InvitationResponseDTO;
import lt.gathertime.server.entity.Invitation;
import lt.gathertime.server.entity.Meeting;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.enums.InvitationStatus;

public class InvitationMapper {

    public static Invitation fromRequest(final InvitationRequestDTO dto, final Meeting meeting, final User inviter, final User invitee) {
        return Invitation.builder()
                .createdDateTime(LocalDateTime.now())
                .modifiedDateTime(LocalDateTime.now())
                .status(InvitationStatus.SENT)
                .meeting(meeting)
                .inviter(inviter)
                .invitee(invitee)
                .build();
    }

    public static InvitationResponseDTO toResponse(final Invitation inv) {
        return InvitationResponseDTO.builder()
                .id(inv.getId())
                .createdDateTime(inv.getCreatedDateTime())
                .modifiedDateTime(inv.getModifiedDateTime())
                .status(inv.getStatus())
                .meetingId(inv.getMeeting().getId())
                .inviterId(inv.getInviter().getId())
                .inviteeId(inv.getInvitee().getId())
                .build();
    }
}

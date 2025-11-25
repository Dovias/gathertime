package lt.gathertime.server.mapper;

import java.time.LocalDateTime;
import lt.gathertime.server.dto.invitationDTOs.InvitationRequestDTO;
import lt.gathertime.server.dto.invitationDTOs.InvitationResponseDTO;
import lt.gathertime.server.model.Invitation;
import lt.gathertime.server.model.Meeting;
import lt.gathertime.server.model.User;
import lt.gathertime.server.model.enums.InvitationStatus;

public class InvitationMapper {

    public static Invitation fromRequest(InvitationRequestDTO dto, Meeting meeting, User inviter, User invitee) {
        return Invitation.builder()
                .createdDateTime(LocalDateTime.now())
                .modifiedDateTime(LocalDateTime.now())
                .status(InvitationStatus.SENT)
                .meeting(meeting)
                .inviter(inviter)
                .invitee(invitee)
                .build();
    }

    public static InvitationResponseDTO toResponse(Invitation inv) {
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

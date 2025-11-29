package lt.gathertime.server.dto.invitation;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lt.gathertime.server.enums.InvitationStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationResponseDTO {

    private Long id;
    private LocalDateTime createdDateTime;
    private LocalDateTime modifiedDateTime;
    private InvitationStatus status;
    private Long meetingId;
    private Long inviterId;
    private Long inviteeId;
}

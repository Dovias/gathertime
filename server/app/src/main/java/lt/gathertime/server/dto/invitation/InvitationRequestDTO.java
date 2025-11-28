package lt.gathertime.server.dto.invitation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class InvitationRequestDTO {

    @NotNull(message = "Meeting ID must not be null")
    private Long meetingId;

    @NotNull(message = "Inviter ID must not be null")
    private Long inviterId;

    @NotNull(message = "Invitee ID must not be null")
    private Long inviteeId;
}

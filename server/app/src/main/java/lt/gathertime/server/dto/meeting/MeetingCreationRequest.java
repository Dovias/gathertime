package lt.gathertime.server.dto.meeting;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.model.enums.MeetingStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class MeetingCreationRequest {
    private String summary;
    private String description;
    private String location;
    private Integer maxParticipants;
    private MeetingStatus status;
    private Long ownerId;
    private Long freeTimeId;
}
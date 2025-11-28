package lt.gathertime.server.dto.meeting;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lt.gathertime.server.dto.user.UserFullNameDTO;
import lt.gathertime.server.model.enums.MeetingStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingResponse {

    private Long id;

    private String summary;
    private String description;
    private String location;

    private Integer maxParticipants;
    private MeetingStatus status;

    private List<UserFullNameDTO> participants;
    private List<Long> activityIds;
}

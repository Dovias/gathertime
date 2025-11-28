package lt.gathertime.server.dto.meeting;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.dto.user.UserFullNameDTO;
import lt.gathertime.server.model.enums.MeetingStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class MeetingSummaryDTO {
    Long id;

    private String summary;

    private MeetingStatus status;

    private List<Long> meetingActivityIds;

    private List<UserFullNameDTO> participants;
}

package lt.gathertime.server.dto.meetingDTOs;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.dto.userDTOs.UserFullNameDTO;
import lt.gathertime.server.model.enums.MeetingStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class MeetingSummaryDTO {

    Long id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "Start date and time must not be null")
    private LocalDateTime startDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "End date and time must not be null")
    @Future(message = "End date and time must be in the future")
    private LocalDateTime endDateTime;

    private String summary;

    private MeetingStatus status;

    private List<Long> meetingActivityIds;

    private List<UserFullNameDTO> participants;
}

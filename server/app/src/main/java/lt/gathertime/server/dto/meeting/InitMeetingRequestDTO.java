package lt.gathertime.server.dto.meeting;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class InitMeetingRequestDTO {

    @NotNull
    private Long userId;

    @NotNull
    private Long freeTimeId;
}

package lt.gathertime.server.dto.freetime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.enums.PastimeType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CreateFreeTimeRequestDTO {

    private Long userId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "Start date and time must not be null")
    private LocalDateTime startDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "End date and time must not be null")
    @Future(message = "End date and time must be in the future")
    private LocalDateTime endDateTime;

    @Builder.Default
    private Boolean publicForAllFriends = true;

    @Builder.Default
    private PastimeType pastimeType = PastimeType.NEUTRAL;

    @Builder.Default
    private List<Long> activityIds = new ArrayList<>();

    @AssertTrue(message = "End date and time must be after start date and time")
    public boolean isEndAfterStart() {
        if (startDateTime == null || endDateTime == null) {
            return true;
        }
        return endDateTime.isAfter(startDateTime);
    }
}

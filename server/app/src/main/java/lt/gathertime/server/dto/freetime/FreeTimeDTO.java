package lt.gathertime.server.dto.freetime;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.enums.PastimeType;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class FreeTimeDTO {
    Long id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "Start date and time must not be null")
    private LocalDateTime startDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "End date and time must not be null")
    @Future(message = "End date and time must be in the future")
    private LocalDateTime endDateTime;

    private PastimeType pastimeType;

    private List<Long> momentaryInterestIds;
}

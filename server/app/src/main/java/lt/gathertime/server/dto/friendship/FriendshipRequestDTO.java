package lt.gathertime.server.dto.friendship;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class FriendshipRequestDTO {

    private Long friendshipId;

    private Long friendId;

    private String firstName;

    private String lastName;

    private LocalDateTime requestDateTime;
}

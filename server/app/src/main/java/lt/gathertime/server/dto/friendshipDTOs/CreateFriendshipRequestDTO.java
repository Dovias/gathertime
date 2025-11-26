package lt.gathertime.server.dto.friendshipDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CreateFriendshipRequestDTO {

    private Long userId;

    private Long friendId;
}

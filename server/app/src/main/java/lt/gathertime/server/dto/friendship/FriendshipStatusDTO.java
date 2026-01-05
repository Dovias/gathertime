package lt.gathertime.server.dto.friendship;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lt.gathertime.server.enums.FriendshipStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipStatusDTO {
    
    private FriendshipStatus friendshipStatus;
}

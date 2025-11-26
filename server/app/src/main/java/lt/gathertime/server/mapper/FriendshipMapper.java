package lt.gathertime.server.mapper;

import lt.gathertime.server.dto.friendshipDTOs.FriendshipRequestDTO;
import lt.gathertime.server.model.Friendship;
import lt.gathertime.server.model.User;

public class FriendshipMapper {

    public static FriendshipRequestDTO toFriendshipRequestDTO(Friendship friendship) {
        User friend = friendship.getUser();

        return FriendshipRequestDTO.builder()
                .friendshipId(friendship.getId())
                .friendId(friend.getId())
                .firstName(friend.getFirstName())
                .lastName(friend.getLastName())
                .requestDateTime(friendship.getStarDateTime())
                .build();
    }
    
}

package lt.gathertime.server.mapper;

import lt.gathertime.server.dto.friendship.FriendshipDTO;
import lt.gathertime.server.dto.friendship.FriendshipRequestDTO;
import lt.gathertime.server.entity.Friendship;
import lt.gathertime.server.entity.User;

public class FriendshipMapper {

    public static FriendshipDTO toFriendshipDTO(final Friendship friendship) {
        final User friend = friendship.getUser();

        return FriendshipDTO.builder()
                .friendshipId(friendship.getId())
                .friendId(friend.getId())
                .firstName(friend.getFirstName())
                .lastName(friend.getLastName())
                .build();
    }

    public static FriendshipRequestDTO toFriendshipRequestDTO(final Friendship friendship) {
        final User friend = friendship.getUser();

        return FriendshipRequestDTO.builder()
                .friendshipId(friendship.getId())
                .friendId(friend.getId())
                .firstName(friend.getFirstName())
                .lastName(friend.getLastName())
                .requestDateTime(friendship.getStarDateTime())
                .build();
    }
    
}

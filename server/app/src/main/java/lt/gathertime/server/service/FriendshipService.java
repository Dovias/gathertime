package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.friendship.CreateFriendshipRequestDTO;
import lt.gathertime.server.dto.friendship.FriendshipRequestDTO;
import lt.gathertime.server.mapper.FriendshipMapper;
import lt.gathertime.server.model.Friendship;
import lt.gathertime.server.model.User;
import lt.gathertime.server.repository.FriendshipRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    
    private final FriendshipRepository friendshipRepository;

    private final UserRepository userRepository;

    public void createFriendship(CreateFriendshipRequestDTO payload) {
        User user = userRepository.findById(payload.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + payload.getUserId()));
        User friend = userRepository.findById(payload.getFriendId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + payload.getFriendId()));

        Friendship friendship = Friendship.builder()
            .user(user)
            .friend(friend)
            .starDateTime(LocalDateTime.now())
            .isBestFriends(false)
            .isConfirmed(false)
            .build();

        friendshipRepository.save(friendship);
    }

    public List<FriendshipRequestDTO> getFriendshipRequests(Long userId) {
        List<Friendship> friendshipRequests = friendshipRepository.getFriendshipRequests(userId);

        return friendshipRequests.stream()
                .map(FriendshipMapper::toFriendshipRequestDTO)
                .toList();
    }

    public void confirmFriendship(Long friendshipId) {
        Friendship friendshipRequest = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Friendship not found with ID: " + friendshipId));

        LocalDateTime startDateTime = LocalDateTime.now();

        friendshipRequest.setIsConfirmed(true);
        friendshipRequest.setStarDateTime(startDateTime);

        Friendship friendship = Friendship.builder()
                .user(friendshipRequest.getFriend())
                .friend(friendshipRequest.getUser())
                .starDateTime(startDateTime)
                .isBestFriends(false)
                .isConfirmed(true)
                .build();

        friendshipRepository.save(friendship);
    }
}

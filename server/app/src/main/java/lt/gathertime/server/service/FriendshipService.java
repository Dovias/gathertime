package lt.gathertime.server.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.friendshipDTOs.CreateFriendshipRequestDTO;
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
}

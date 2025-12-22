package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.friendship.CreateFriendshipRequestDTO;
import lt.gathertime.server.dto.friendship.FriendshipDTO;
import lt.gathertime.server.dto.friendship.FriendshipRequestDTO;
import lt.gathertime.server.entity.Chat;
import lt.gathertime.server.entity.Friendship;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.mapper.FriendshipMapper;
import lt.gathertime.server.repository.ChatRepository;
import lt.gathertime.server.repository.FriendshipRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    public void createFriendship(final CreateFriendshipRequestDTO payload) {
        final User user = this.userRepository.findById(payload.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + payload.getUserId()));
        final User friend = this.userRepository.findById(payload.getFriendId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + payload.getFriendId()));

        final Friendship friendship = Friendship.builder()
            .user(user)
            .friend(friend)
            .starDateTime(LocalDateTime.now())
            .isBestFriends(false)
            .isConfirmed(false)
            .build();

        this.friendshipRepository.save(friendship);
    }

    public List<FriendshipRequestDTO> getFriendshipRequests(final Long userId) {
        final User user = this.userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        final List<Friendship> friendshipRequests = this.friendshipRepository.getFriendshipRequests(userId);

        return friendshipRequests.stream()
                .map(FriendshipMapper::toFriendshipRequestDTO)
                .toList();
    }

    public List<FriendshipDTO> getFriendships(final Long userId) {
        final User user = this.userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        final List<Friendship> friendships = this.friendshipRepository.getFriendships(userId);

        return friendships.stream()
                .map(FriendshipMapper::toFriendshipDTO)
                .toList();
    }

    public void confirmFriendship(final Long friendshipId) {
        final Friendship friendshipRequest = this.friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Friendship not found with ID: " + friendshipId));

        final LocalDateTime startDateTime = LocalDateTime.now();

        friendshipRequest.setIsConfirmed(true);
        friendshipRequest.setStarDateTime(startDateTime);

        final Chat chat = new Chat();

        this.chatRepository.save(chat);

        friendshipRequest.setChat(chat);

        final Friendship friendship = Friendship.builder()
                .user(friendshipRequest.getFriend())
                .friend(friendshipRequest.getUser())
                .starDateTime(startDateTime)
                .isBestFriends(false)
                .isConfirmed(true)
                .chat(chat)
                .build();

        this.friendshipRepository.save(friendship);
    }
}

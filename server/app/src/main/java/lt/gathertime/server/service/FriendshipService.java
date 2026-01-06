package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.friendship.CreateFriendshipRequestDTO;
import lt.gathertime.server.dto.friendship.FriendDTO;
import lt.gathertime.server.dto.friendship.FriendshipRequestDTO;
import lt.gathertime.server.entity.Chat;
import lt.gathertime.server.entity.Friendship;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.enums.FriendshipStatus;
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
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with ID: " + payload.getUserId()));
                final User friend = this.userRepository.findById(payload.getFriendId())
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with ID: " + payload.getFriendId()));

                final LocalDateTime startDateTime = LocalDateTime.now();

                final Friendship friendshipRequest = Friendship.builder()
                                .user(user)
                                .friend(friend)
                                .starDateTime(startDateTime)
                                .isBestFriends(false)
                                .status(FriendshipStatus.REQUESTED)
                                .build();
                this.friendshipRepository.save(friendshipRequest);

                final Friendship friendshipToConfirm = Friendship.builder()
                                .user(friend)
                                .friend(user)
                                .starDateTime(startDateTime)
                                .isBestFriends(false)
                                .status(FriendshipStatus.NOT_CONFIRMED)
                                .build();
                this.friendshipRepository.save(friendshipToConfirm);
        }

        public List<FriendshipRequestDTO> getFriendshipRequests(final Long userId) {
                final User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

                final List<Friendship> friendshipRequests = this.friendshipRepository.getFriendshipRequests(userId);

                return friendshipRequests.stream()
                                .map(FriendshipMapper::toFriendshipRequestDTO)
                                .toList();
        }

        public List<FriendDTO> getFriendships(final Long userId) {
                final User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

                final List<Friendship> friendships = this.friendshipRepository.getFriendships(userId);

                return friendships.stream()
                                .map(FriendshipMapper::toFriendDTO)
                                .toList();
        }

        public FriendshipStatus getFriendshipStatus(final Long userId, final Long userId2) {
                final User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
                final User user2 = this.userRepository.findById(userId2)
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

                 return friendshipRepository.getLatestFriendshipByUsers(user.getId(), user2.getId())
                                .map(Friendship::getStatus)
                                .orElse(FriendshipStatus.NOT_FOUND);
        }

        @Transactional
        public void confirmFriendship(final Long friendshipId) {
                final Friendship friendshipToConfirm = this.friendshipRepository.findById(friendshipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Friendship to confirm not found with ID: " + friendshipId));
                final Friendship friendshipRequest = this.friendshipRepository.getLatestFriendshipByUsers(
                        friendshipToConfirm.getFriend().getId(),
                        friendshipToConfirm.getUser().getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Friendship request not found with ID: " + friendshipId));
                
                final Chat chat = new Chat();
                this.chatRepository.save(chat);                

                final LocalDateTime startDateTime = LocalDateTime.now();

                friendshipToConfirm.setStatus(FriendshipStatus.CONFIRMED);
                friendshipToConfirm.setStarDateTime(startDateTime);
                friendshipToConfirm.setChat(chat);

                friendshipRequest.setStatus(FriendshipStatus.CONFIRMED);
                friendshipRequest.setStarDateTime(startDateTime);
                friendshipRequest.setChat(chat); 
        }

        @Transactional
        public void declineFriendship(final Long friendshipId) {
                final Friendship friendshipToConfirm = this.friendshipRepository.findById(friendshipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Friendship to confirm not found with ID: " + friendshipId));
                final Friendship friendshipRequest = this.friendshipRepository.getLatestFriendshipByUsers(
                        friendshipToConfirm.getFriend().getId(),
                        friendshipToConfirm.getUser().getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Friendship request not found with ID: " + friendshipId));
                
                friendshipToConfirm.setStatus(FriendshipStatus.DECLINED);
                friendshipRequest.setStatus(FriendshipStatus.DECLINED);
        }
}

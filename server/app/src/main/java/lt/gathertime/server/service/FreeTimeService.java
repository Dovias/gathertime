package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.freetime.CreateFreeTimeRequestDTO;
import lt.gathertime.server.dto.freetime.FreeTimeDTO;
import lt.gathertime.server.dto.freetime.FriendFreeTimeDTO;
import lt.gathertime.server.entity.Activity;
import lt.gathertime.server.entity.FreeTime;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.mapper.FreeTimeMapper;
import lt.gathertime.server.repository.ActivityRepository;
import lt.gathertime.server.repository.FreeTimeRepository;
import lt.gathertime.server.repository.FriendshipRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FreeTimeService {

    private final FreeTimeRepository freeTimeRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final FriendshipRepository friendshipRepository;

    public void createFreeTime(final CreateFreeTimeRequestDTO requestDto) {
        final User user = this.userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        final List<Activity> activities = requestDto.getActivityIds().isEmpty()
                ? List.of()
                : this.activityRepository.findAllById(requestDto.getActivityIds());

        final FreeTime newFreeTime = FreeTimeMapper.fromCreateRequestDto(requestDto, user, activities);
        this.freeTimeRepository.save(newFreeTime);
    }

    public List<FreeTimeDTO> getFreeTimes(final Long userId, final LocalDateTime startDateTime, final LocalDateTime endDateTime) {
        if (startDateTime.isAfter(endDateTime)) {
            throw new RuntimeException("Start date must be before end date");
        }

        final List<FreeTime> freeTimes = this.freeTimeRepository.getFreeTimesInRange(userId, startDateTime, endDateTime);

        return freeTimes.stream()
                .map(FreeTimeMapper::toFreeTimeDTO)
                .toList();
    }

    public List<FriendFreeTimeDTO> getFreeTimesOfFriends(final Long userId) {
        final List<Long> friendIds = this.friendshipRepository.getFriendships(userId).stream()
            .map(friendship -> friendship.getFriend().getId())
            .toList();

        if(friendIds.isEmpty()) return List.of();

        final List<FreeTime> freeTimes = this.freeTimeRepository.getFutureFreeTimesOfFriends(userId, friendIds);

        return freeTimes.stream()
            .map(FreeTimeMapper::toFriendFreeTimeDTO)
            .toList();
    }

    public List<FriendFreeTimeDTO> getOverlappingFreeTimesOfFriends(final Long userId) {
        final List<Long> friendIds = this.friendshipRepository.getFriendships(userId).stream()
            .map(friendship -> friendship.getFriend().getId())
            .toList();

        if(friendIds.isEmpty()) return List.of();

        final List<FreeTime> freeTimes = this.freeTimeRepository.getOverlappingFutureFreeTimesOfFriends(userId, friendIds);

        return freeTimes.stream()
            .map(FreeTimeMapper::toFriendFreeTimeDTO)
            .toList();
    }

    @Transactional
    public void deleteFreeTime(final Long id) {
        final FreeTime freeTime = this.freeTimeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found"));

        freeTime.getMomentaryInterests().clear();

        this.freeTimeRepository.delete(freeTime);
    }
}

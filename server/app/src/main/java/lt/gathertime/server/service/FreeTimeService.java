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

    public void createFreeTime(CreateFreeTimeRequestDTO requestDto) {
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        List<Activity> activities = requestDto.getActivityIds().isEmpty()
                ? List.of()
                : activityRepository.findAllById(requestDto.getActivityIds());

        FreeTime newFreeTime = FreeTimeMapper.fromCreateRequestDto(requestDto, user, activities);
        freeTimeRepository.save(newFreeTime);
    }

    public List<FreeTimeDTO> getFreeTimes(Long userId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime.isAfter(endDateTime)) {
            throw new RuntimeException("Start date must be before end date");
        }

        List<FreeTime> freeTimes = freeTimeRepository.getFreeTimesInRange(userId, startDateTime, endDateTime);

        return freeTimes.stream()
                .map(FreeTimeMapper::toFreeTimeDTO)
                .toList();
    }

    public List<FriendFreeTimeDTO> getFreeTimesOfFriends(Long userId) {
        List<Long> friendIds = friendshipRepository.getFriendships(userId).stream()
            .map(friendship -> friendship.getFriend().getId())
            .toList();

        if(friendIds.isEmpty()) return List.of();

        List<FreeTime> freeTimes = freeTimeRepository.getFutureFreeTimesOfFriends(userId, friendIds);

        return freeTimes.stream()
            .map(FreeTimeMapper::toFriendFreeTimeDTO)
            .toList();
    }

    public List<FriendFreeTimeDTO> getOverlappingFreeTimesOfFriends(Long userId) {
        List<Long> friendIds = friendshipRepository.getFriendships(userId).stream()
            .map(friendship -> friendship.getFriend().getId())
            .toList();

        if(friendIds.isEmpty()) return List.of();

        List<FreeTime> freeTimes = freeTimeRepository.getOverlappingFutureFreeTimesOfFriends(userId, friendIds);

        return freeTimes.stream()
            .map(FreeTimeMapper::toFriendFreeTimeDTO)
            .toList();
    }

    @Transactional
    public void deleteFreeTime(Long id) {
        FreeTime freeTime = freeTimeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found"));

        freeTime.getMomentaryInterests().clear();

        freeTimeRepository.delete(freeTime);
    }
}

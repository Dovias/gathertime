package lt.gathertime.server.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.freetimeDTOs.CreateFreeTimeRequestDTO;
import lt.gathertime.server.mapper.FreeTimeMapper;
import lt.gathertime.server.model.Activity;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.User;
import lt.gathertime.server.repository.ActivityRepository;
import lt.gathertime.server.repository.FreeTimeRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FreeTimeService {

    private final FreeTimeRepository freeTimeRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public void createFreeTime(CreateFreeTimeRequestDTO requestDto) {
        User user = userRepository.findById(requestDto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        List<Activity> activities = requestDto.getActivityIds().isEmpty()
            ? List.of()
            : activityRepository.findAllById(requestDto.getActivityIds());

        FreeTime newFreeTime = FreeTimeMapper.fromCreateRequestDto(requestDto, user, activities);
        freeTimeRepository.save(newFreeTime);
    }

    @Transactional
    public void deleteFreeTime(Long id) {
        FreeTime freeTime = freeTimeRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Not found"));

        freeTime.getMomentaryInterests().clear();

        freeTimeRepository.delete(freeTime);
    }
}

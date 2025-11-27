package lt.gathertime.server.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.freetimeDTOs.CreateFreeTimeRequestDTO;
import lt.gathertime.server.dto.freetimeDTOs.FreeTimeDTO;
import lt.gathertime.server.dto.freetimeDTOs.FriendFreeTimeDTO;
import lt.gathertime.server.service.FreeTimeService;

@RestController
@RequestMapping("/freetime")
@RequiredArgsConstructor
public class FreeTimeController {

    private final FreeTimeService freeTimeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createFreeTime(@Valid @RequestBody CreateFreeTimeRequestDTO createFreeTimeRequestDTO) {
        freeTimeService.createFreeTime(createFreeTimeRequestDTO);
    }

    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<FreeTimeDTO> getFreeTimes(
        @PathVariable Long userId, 
        @RequestParam LocalDateTime startDateTime,  
        @RequestParam LocalDateTime endDateTime) {
        return freeTimeService.getFreeTimes(userId, startDateTime, endDateTime);
    }

    @GetMapping("/user/{userId}/friends")
    @ResponseStatus(HttpStatus.OK)
    public List<FriendFreeTimeDTO> getFreeTimesOfFriends(@PathVariable Long userId) {
        return freeTimeService.getFreeTimesOfFriends(userId);
    }

    @GetMapping("/user/{userId}/friends/overlapping")
    @ResponseStatus(HttpStatus.OK)
    public List<FriendFreeTimeDTO> getOverlappingFreeTimesOfFriends(@PathVariable Long userId) {
        return freeTimeService.getOverlappingFreeTimesOfFriends(userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFreeTime(@PathVariable Long id) {
        freeTimeService.deleteFreeTime(id);
    }
}

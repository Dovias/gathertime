package lt.gathertime.server.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import lt.gathertime.server.dto.meetingDTOs.CreateMeetingRequestDTO;
import lt.gathertime.server.dto.meetingDTOs.MeetingSummaryDTO;
import lt.gathertime.server.service.MeetingService;

@RestController
@RequestMapping("/meeting")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createMeeting(@Valid @RequestBody CreateMeetingRequestDTO createMeetingRequestDTO) {
        meetingService.createMeeting(createMeetingRequestDTO);
    }
    
    @PutMapping("/invitation/{invitationId}/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmMeeting(@PathVariable Long invitationId) {
        meetingService.confirmMeeting(invitationId);
    }

    @GetMapping("user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<MeetingSummaryDTO> getUserMeetings(
        @PathVariable Long userId, 
        @RequestParam LocalDateTime startDateTime,  
        @RequestParam LocalDateTime endDateTime) {
            return meetingService.getUserMeetings(userId, startDateTime, endDateTime);
    }
}

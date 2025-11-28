package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.meeting.MeetingCreationRequest;
import lt.gathertime.server.dto.meeting.MeetingResponse;
import lt.gathertime.server.dto.meeting.MeetingSummaryDTO;
import lt.gathertime.server.service.MeetingService;

@RestController
@RequestMapping("/meeting")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createMeeting(@Valid @RequestBody MeetingCreationRequest createMeetingRequestDTO) {
        meetingService.createMeeting(createMeetingRequestDTO);
    }
    
    @PutMapping("/invitation/{invitationId}/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmMeeting(@PathVariable Long invitationId) {
        meetingService.confirmMeeting(invitationId);
    }

    @PutMapping("/invitation/{invitationId}/decline")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void declineMeeting(@PathVariable Long invitationId) {
        meetingService.declineMeeting(invitationId);
    }

    @GetMapping("/{meetingId}")
    @ResponseStatus(HttpStatus.OK)
    public MeetingResponse getMeeting(@PathVariable Long meetingId) {
        return meetingService.getMeeting(meetingId);
    }

    @GetMapping("user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<MeetingSummaryDTO> getAllUserMeetings(@PathVariable Long userId) {
            return meetingService.getAllUserMeetings(userId);
    }

}

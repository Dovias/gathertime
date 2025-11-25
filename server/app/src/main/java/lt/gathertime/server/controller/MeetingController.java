package lt.gathertime.server.controller;

import lt.gathertime.server.dto.meetingDTOs.MeetingResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import lt.gathertime.server.dto.meetingDTOs.CreateMeetingRequestDTO;
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

    @GetMapping("/{meetingId}")
    @ResponseStatus(HttpStatus.OK)
    public MeetingResponseDTO getMeeting(@PathVariable Long meetingId) {
        return meetingService.getMeeting(meetingId);
    }

}

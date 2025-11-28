package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.meeting.MeetingCreationRequest;
import lt.gathertime.server.dto.meeting.MeetingResponse;
import lt.gathertime.server.dto.meeting.MeetingSummaryDTO;
import lt.gathertime.server.mapper.MeetingMapper;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.Invitation;
import lt.gathertime.server.model.Meeting;
import lt.gathertime.server.model.User;
import lt.gathertime.server.model.enums.InvitationStatus;
import lt.gathertime.server.model.enums.MeetingStatus;
import lt.gathertime.server.repository.FreeTimeRepository;
import lt.gathertime.server.repository.InvitationRepository;
import lt.gathertime.server.repository.MeetingRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final FreeTimeRepository freeTimeRepository;
    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;
    private final InvitationRepository invitationRepository;

    @Transactional
    public void createMeeting(MeetingCreationRequest request) {
        System.out.println(request.getOwnerId());
        User author = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getOwnerId()));

        FreeTime freeTime = freeTimeRepository.findById(request.getFreeTimeId())
                .orElseThrow(() -> new RuntimeException("Free time not found with ID: " + request.getFreeTimeId()));

        if (freeTime.getOwner() != author) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        } else if (freeTime.getMeeting() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        Meeting meeting = meetingRepository.save(Meeting.builder()
            .summary(request.getSummary())
            .description(request.getDescription())
            .location(request.getLocation())
            .maxParticipants(request.getMaxParticipants())
            .status(MeetingStatus.ARRANGED)
            .build()
        );

        freeTime.setMeeting(meeting);

        freeTimeRepository.save(freeTime);
    }

    @Transactional
    public void confirmMeeting(Long invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with ID: " + invitationId));

        Meeting meeting = invitation.getMeeting();

        List<User> participants = meeting.getMeetingParticipants();
        participants.add(invitation.getInvitee());
        if (participants.size() > 1) {
            meeting.setStatus(MeetingStatus.CONFIRMED);
        }

        invitation.setStatus(InvitationStatus.CONFIRMED);
        invitation.setModifiedDateTime(LocalDateTime.now());
    }

    @Transactional
    public void declineMeeting(Long invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with ID: " + invitationId));

        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setModifiedDateTime(LocalDateTime.now());
    }

    public MeetingResponse getMeeting(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found with ID: " + meetingId));

        return MeetingMapper.toResponse(meeting);
    }
    
    public List<MeetingSummaryDTO> getAllUserMeetings(Long userId) {
        return meetingRepository.findAllByOwnerId(userId).stream()
            .map(meeting -> MeetingMapper.toMeetingSummaryDTO(meeting, meeting.getMeetingParticipants()))
            .toList();
    }
}

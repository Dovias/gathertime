package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.meeting.CreateMeetingRequestDTO;
import lt.gathertime.server.dto.meeting.MeetingResponseDTO;
import lt.gathertime.server.dto.meeting.MeetingSummaryDTO;
import lt.gathertime.server.mapper.MeetingMapper;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.Invitation;
import lt.gathertime.server.model.Meeting;
import lt.gathertime.server.model.User;
import lt.gathertime.server.model.enums.FreeTimeStatus;
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
    public void createMeeting(CreateMeetingRequestDTO requestDto) {
        LocalDateTime createdDateTime = LocalDateTime.now();

        User inviter = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        FreeTime freeTime = freeTimeRepository.findById(requestDto.getFreeTimeId())
                .orElseThrow(() -> new RuntimeException("Free time not found with ID: " + requestDto.getFreeTimeId()));

        Meeting meeting = MeetingMapper.fromCreateRequestDto(freeTime.getStartDateTime(), freeTime.getEndDateTime(),
                freeTime, inviter);
        meetingRepository.save(meeting);

        User invitee = freeTime.getUser();

        Invitation invitation = Invitation.builder()
                .meeting(meeting)
                .inviter(inviter)
                .invitee(invitee)
                .createdDateTime(createdDateTime)
                .modifiedDateTime(createdDateTime)
                .status(InvitationStatus.SENT)
                .build();

        invitationRepository.save(invitation);
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

        meeting.getFreeTime().setStatus(FreeTimeStatus.PLANNED);

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

    public MeetingResponseDTO getMeeting(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found with ID: " + meetingId));

        return MeetingMapper.toResponse(meeting);
    }
    
    public List<MeetingSummaryDTO> getUserMeetings(Long userId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Meeting> meetings = meetingRepository.findUserMeetingsInRange(userId, startDateTime, endDateTime);
        return meetings.stream()
                .map(meeting -> MeetingMapper.toMeetingSummaryDTO(meeting, meeting.getMeetingParticipants()))
                .toList();
    }

}

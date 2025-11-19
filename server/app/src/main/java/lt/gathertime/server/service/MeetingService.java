package lt.gathertime.server.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.meetingDTOs.CreateMeetingRequestDTO;
import lt.gathertime.server.mapper.MeetingMapper;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.Invitation;
import lt.gathertime.server.model.Meeting;
import lt.gathertime.server.model.User;
import lt.gathertime.server.model.enums.InvitationStatus;
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


    public void createMeeting(CreateMeetingRequestDTO requestDto) {
        LocalDateTime createdDateTime = LocalDateTime.now();

        User inviter = userRepository.findById(requestDto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        FreeTime freeTime = freeTimeRepository.findById(requestDto.getFreeTimeId())
            .orElseThrow(() -> new RuntimeException("Free time not found with ID: " + requestDto.getFreeTimeId()));

        Meeting meeting = MeetingMapper.fromCreateRequestDto(freeTime.getStartDateTime(), freeTime.getEndDateTime(), freeTime, inviter);
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

}

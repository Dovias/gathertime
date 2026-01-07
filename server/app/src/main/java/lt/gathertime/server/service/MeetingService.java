package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.meeting.InitMeetingRequestDTO;
import lt.gathertime.server.dto.meeting.MeetingResponseDTO;
import lt.gathertime.server.dto.meeting.MeetingSummaryDTO;
import lt.gathertime.server.entity.FreeTime;
import lt.gathertime.server.entity.Invitation;
import lt.gathertime.server.entity.Meeting;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.enums.FreeTimeStatus;
import lt.gathertime.server.enums.InvitationStatus;
import lt.gathertime.server.enums.MeetingStatus;
import lt.gathertime.server.mapper.MeetingMapper;
import lt.gathertime.server.repository.FreeTimeRepository;
import lt.gathertime.server.repository.InvitationRepository;
import lt.gathertime.server.repository.MeetingRepository;
import lt.gathertime.server.repository.UserJpaRepository;

@Service
@RequiredArgsConstructor
public class MeetingService {

        private final FreeTimeRepository freeTimeRepository;
        private final UserJpaRepository userJpaRepository;
        private final MeetingRepository meetingRepository;
        private final InvitationRepository invitationRepository;

        @Transactional
        public void initMeeting(final InitMeetingRequestDTO requestDto) {
                final LocalDateTime createdDateTime = LocalDateTime.now();

                final User inviter = this.userJpaRepository.findById(requestDto.getUserId())
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with ID: " + requestDto.getUserId()));

                final FreeTime freeTime = this.freeTimeRepository.findById(requestDto.getFreeTimeId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Free time not found with ID: " + requestDto.getFreeTimeId()));

                final Meeting meeting = MeetingMapper.fromCreateRequestDto(freeTime.getStartDateTime(),
                                freeTime.getEndDateTime(),
                                freeTime, inviter);
            this.meetingRepository.save(meeting);

                final User invitee = freeTime.getUser();

                final Invitation invitation = Invitation.builder()
                                .meeting(meeting)
                                .inviter(inviter)
                                .invitee(invitee)
                                .createdDateTime(createdDateTime)
                                .modifiedDateTime(createdDateTime)
                                .status(InvitationStatus.SENT)
                                .build();

            this.invitationRepository.save(invitation);
        }

        @Transactional
        public void confirmMeeting(final Long invitationId) {
                final Invitation invitation = this.invitationRepository.findById(invitationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Invitation not found with ID: " + invitationId));

                final Meeting meeting = invitation.getMeeting();

                final List<User> participants = meeting.getMeetingParticipants();
                participants.add(invitation.getInvitee());
                if (participants.size() > 1) {
                        meeting.setStatus(MeetingStatus.CONFIRMED);
                }

                final FreeTime freeTime = Optional.ofNullable(meeting.getFreeTime().getId())
                        .map(id -> this.freeTimeRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Free time not found with ID: " + id)))
                        .orElse(null);

                if (freeTime != null) {
                        freeTime.setStatus(FreeTimeStatus.PLANNED);
                }

                invitation.setStatus(InvitationStatus.CONFIRMED);
                invitation.setModifiedDateTime(LocalDateTime.now());
        }

        @Transactional
        public void declineMeeting(final Long invitationId) {
                final Invitation invitation = this.invitationRepository.findById(invitationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Invitation not found with ID: " + invitationId));

                invitation.setStatus(InvitationStatus.DECLINED);
                invitation.setModifiedDateTime(LocalDateTime.now());
        }

        public MeetingResponseDTO getMeeting(final Long meetingId) {
                final Meeting meeting = this.meetingRepository.findById(meetingId)
                                .orElseThrow(() -> new RuntimeException("Meeting not found with ID: " + meetingId));

                return MeetingMapper.toResponse(meeting);
        }

        public List<MeetingSummaryDTO> getUserMeetings(final Long userId, final LocalDateTime startDateTime,
                                                       final LocalDateTime endDateTime) {
                final List<Meeting> meetings = this.meetingRepository.findUserMeetingsInRange(userId, startDateTime, endDateTime);
                return meetings.stream()
                                .map(meeting -> MeetingMapper.toMeetingSummaryDTO(meeting,
                                                meeting.getMeetingParticipants()))
                                .toList();
        }

}

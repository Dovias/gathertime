package lt.gathertime.server.mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lt.gathertime.server.dto.meetingDTOs.MeetingSummaryDTO;
import lt.gathertime.server.dto.userDTOs.UserFullNameDTO;
import lt.gathertime.server.model.Activity;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.Meeting;
import lt.gathertime.server.model.User;
import lt.gathertime.server.model.enums.MeetingStatus;

public class MeetingMapper {

    public static Meeting fromCreateRequestDto(
        LocalDateTime start, 
        LocalDateTime end, 
        FreeTime freeTime, 
        User inviter) {
        return Meeting.builder()
                .startDateTime(start)
                .endDateTime(end)
                .status(MeetingStatus.ARRANGED)
                .maxParticipants(2)
                .freeTime(freeTime)
                .owner(inviter)
                .meetingParticipants(List.of(inviter))
                .build();
    }
    
    public static MeetingSummaryDTO toMeetingSummaryDTO(Meeting meeting, List<User> participants) {
        return MeetingSummaryDTO.builder()
                .id(meeting.getId())
                .startDateTime(meeting.getStartDateTime())
                .endDateTime(meeting.getEndDateTime())
                .summary(meeting.getSummary())
                .meetingActivityIds(
                    meeting.getMeetingActivities() == null
                    ? List.of()
                    : meeting.getMeetingActivities()
                        .stream()
                        .map(Activity::getId)
                        .toList()
                )
                .participants(
                    participants == null
                    ? List.of()
                    : participants
                        .stream()
                        .map(user -> UserFullNameDTO.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .build())
                        .collect(Collectors.toList())
                )
                .build();
    }
}

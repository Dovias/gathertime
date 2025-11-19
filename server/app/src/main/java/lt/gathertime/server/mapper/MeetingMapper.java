package lt.gathertime.server.mapper;

import java.time.LocalDateTime;
import java.util.List;

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
    
}

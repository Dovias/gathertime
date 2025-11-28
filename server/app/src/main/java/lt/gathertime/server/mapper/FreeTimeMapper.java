package lt.gathertime.server.mapper;

import java.util.List;

import lt.gathertime.server.dto.freetime.UserFreeTimeCreationRequest;
import lt.gathertime.server.dto.freetime.UserFreeTimeResponse;
import lt.gathertime.server.dto.freetime.FriendFreeTimeDTO;
import lt.gathertime.server.model.Activity;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.Meeting;
import lt.gathertime.server.model.User;

public class FreeTimeMapper {

    public static FreeTime fromCreateRequestDto(UserFreeTimeCreationRequest createFreeTimeRequestDto, User user, List<Activity> activities) {
        return FreeTime.builder()
                .startDateTime(createFreeTimeRequestDto.getStartDateTime())
                .endDateTime(createFreeTimeRequestDto.getEndDateTime())
                .publicForAllFriends(createFreeTimeRequestDto.getPublicForAllFriends())
                .pastimeType(createFreeTimeRequestDto.getPastimeType())
                .owner(user)
                .momentaryInterests(activities)
                .build();
    }

    public static UserFreeTimeResponse toResponse(FreeTime freeTime) {
        Meeting meeting = freeTime.getMeeting();
        return UserFreeTimeResponse.builder()
                .id(freeTime.getId())
                .meeting(meeting == null ? null : MeetingMapper.toResponse(meeting))
                .startDateTime(freeTime.getStartDateTime())
                .endDateTime(freeTime.getEndDateTime())
                .pastimeType(freeTime.getPastimeType())
                .momentaryInterestIds(
                    freeTime.getMomentaryInterests() == null
                    ? null
                    : freeTime.getMomentaryInterests()
                        .stream()
                        .map(Activity::getId)
                        .toList()
                )
                .build();
    }

    public static FriendFreeTimeDTO toFriendFreeTimeDTO(FreeTime freeTime) {
        return FriendFreeTimeDTO.builder()
                .id(freeTime.getId())
                .startDateTime(freeTime.getStartDateTime())
                .endDateTime(freeTime.getEndDateTime())
                .pastimeType(freeTime.getPastimeType())
                .momentaryInterestIds(
                    freeTime.getMomentaryInterests() == null
                    ? null
                    : freeTime.getMomentaryInterests()
                        .stream()
                        .map(Activity::getId)
                        .toList()
                )
                .friendId(freeTime.getOwner().getId())
                .firstName(freeTime.getOwner().getFirstName())
                .lastName(freeTime.getOwner().getLastName())
                .build();
    }
}

package lt.gathertime.server.mapper;

import java.util.List;

import lt.gathertime.server.dto.freetime.CreateFreeTimeRequestDTO;
import lt.gathertime.server.dto.freetime.FreeTimeDTO;
import lt.gathertime.server.dto.freetime.FriendFreeTimeDTO;
import lt.gathertime.server.entity.Activity;
import lt.gathertime.server.entity.FreeTime;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.enums.FreeTimeStatus;

public class FreeTimeMapper {

    public static FreeTime fromCreateRequestDto(CreateFreeTimeRequestDTO createFreeTimeRequestDto, User user, List<Activity> activities) {
        return FreeTime.builder()
                .startDateTime(createFreeTimeRequestDto.getStartDateTime())
                .endDateTime(createFreeTimeRequestDto.getEndDateTime())
                .publicForAllFriends(createFreeTimeRequestDto.getPublicForAllFriends())
                .pastimeType(createFreeTimeRequestDto.getPastimeType())
                .status(FreeTimeStatus.FREE)
                .user(user)
                .momentaryInterests(activities)
                .build();
    }

    public static FreeTimeDTO toFreeTimeDTO(FreeTime freeTime) {
        return FreeTimeDTO.builder()
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
                .friendId(freeTime.getUser().getId())
                .firstName(freeTime.getUser().getFirstName())
                .lastName(freeTime.getUser().getLastName())
                .build();
    }
}

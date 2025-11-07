package lt.gathertime.server.mapper;

import java.util.List;

import lt.gathertime.server.dto.freetimeDTOs.CreateFreeTimeRequestDTO;
import lt.gathertime.server.model.Activity;
import lt.gathertime.server.model.FreeTime;
import lt.gathertime.server.model.User;
import lt.gathertime.server.model.enums.FreeTimeStatus;

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

}

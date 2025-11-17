package lt.gathertime.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.freetimeDTOs.CreateFreeTimeRequestDTO;
import lt.gathertime.server.service.FreeTimeService;

@RestController
@RequestMapping("/freetime")
@RequiredArgsConstructor
public class FreeTimeController {

    private final FreeTimeService freeTimeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createFreeTime(@Valid @RequestBody CreateFreeTimeRequestDTO createFreeTimeRequestDTO) {
        freeTimeService.createFreeTime(createFreeTimeRequestDTO);
    }
}

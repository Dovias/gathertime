package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.invitation.InvitationRequestDTO;
import lt.gathertime.server.dto.invitation.InvitationResponseDTO;
import lt.gathertime.server.service.InvitationService;

@RestController
@RequestMapping("/invitation")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createInvitation(@Valid @RequestBody final InvitationRequestDTO dto) {
        this.invitationService.createInvitation(dto);
    }

    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<InvitationResponseDTO> getInvitations(@PathVariable final Long userId) {
        return this.invitationService.getInvitationsForUser(userId);
    }
}

package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.friendship.CreateFriendshipRequestDTO;
import lt.gathertime.server.dto.friendship.FriendshipDTO;
import lt.gathertime.server.dto.friendship.FriendshipRequestDTO;
import lt.gathertime.server.service.FriendshipService;

@RestController
@RequestMapping("/friendship")
@RequiredArgsConstructor
public class FriendshipController {
    
    private final FriendshipService friendshipService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createFriendship(@Valid @RequestBody final CreateFriendshipRequestDTO payload) {
        this.friendshipService.createFriendship(payload);
    }

    @PostMapping("/{friendshipId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void confirmFriendship(@PathVariable final Long friendshipId) {
        this.friendshipService.confirmFriendship(friendshipId);
    }

    @PutMapping("/{friendshipId}/decline")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void declineFriendship(@PathVariable final Long friendshipId) {
        this.friendshipService.declineFriendship(friendshipId);
    }

    @GetMapping("/user/{userId}") 
    @ResponseStatus(HttpStatus.OK)
    public List<FriendshipDTO> getFriendships(@PathVariable final Long userId) {
        return this.friendshipService.getFriendships(userId);
    }

    @GetMapping("/user/{userId}/requests") 
    @ResponseStatus(HttpStatus.OK)
    public List<FriendshipRequestDTO> getFriendshipRequests(@PathVariable final Long userId) {
        return this.friendshipService.getFriendshipRequests(userId);
    }
}

package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    public void createFriendship(@Valid @RequestBody CreateFriendshipRequestDTO payload) {
        friendshipService.createFriendship(payload);
    }

    @PostMapping("/{friendshipId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void confirmFriendship(@PathVariable Long friendshipId) {
        friendshipService.confirmFriendship(friendshipId);
    }

    @GetMapping("/user/{userId}") 
    @ResponseStatus(HttpStatus.OK)
    public List<FriendshipDTO> getFriendships(@PathVariable Long userId) {
        return friendshipService.getFriendships(userId);
    }

    @GetMapping("/user/{userId}/requests") 
    @ResponseStatus(HttpStatus.OK)
    public List<FriendshipRequestDTO> getFriendshipRequests(@PathVariable Long userId) {
        return friendshipService.getFriendshipRequests(userId);
    }
}

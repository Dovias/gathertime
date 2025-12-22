package lt.gathertime.server.controller;

import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.user.PasswordChangeDTO;
import lt.gathertime.server.dto.user.UpdateInfoDTO;
import lt.gathertime.server.dto.user.UserResponseDTO;
import lt.gathertime.server.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable final Long id) {
        return this.userService.getUserById(id);
    }

    @PutMapping("/update-profile")
    public UserResponseDTO updateProfile(@RequestBody final UpdateInfoDTO request) {
        return this.userService.updateUserProfile(request);
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody final PasswordChangeDTO request) {
        this.userService.changePassword(request.getId(), request.getPassword());
    }
}

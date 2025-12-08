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
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update-profile")
    public UserResponseDTO updateProfile(@RequestBody UpdateInfoDTO request) {
        return userService.updateUserProfile(request);
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO request) {
        userService.changePassword(request.getId(), request.getPassword());
    }
}

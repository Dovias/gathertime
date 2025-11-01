package lt.gathertime.server.controller;

import lt.gathertime.server.dto.userDTOs.AuthenticationResponseDTO;
import lt.gathertime.server.dto.userDTOs.LoginRequestDTO;
import lt.gathertime.server.dto.userDTOs.RegistrationRequestDTO;
import lt.gathertime.server.dto.userDTOs.UserResponseDTO;
import lt.gathertime.server.mapper.UserMapper;
import lt.gathertime.server.repository.UserRepository;
import lt.gathertime.server.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    @PostMapping("/registration")
    public ResponseEntity<UserResponseDTO> createUser(
            @RequestBody RegistrationRequestDTO registrationRequestDTO
    ){
        return ResponseEntity.ok(authenticationService.register(registrationRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(
            @RequestBody LoginRequestDTO request
    ){
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<UserResponseDTO> checkEmail(@PathVariable("email") String email){
        return ResponseEntity.ok(UserMapper.toDto(userRepository.findByEmail(email).orElseThrow()));
    }
}

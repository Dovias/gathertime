package lt.gathertime.server.controller;

import lt.gathertime.server.dto.user.*;
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

    @PostMapping("/send-code")
    public ResponseEntity<Void> sendCode(@RequestBody SendCodeRequestDTO request) {
        authenticationService.sendVerificationCode(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-code-and-register")
    public ResponseEntity<AuthenticationResponseDTO> verifyAndRegister(
            @RequestBody VerifyCodeAndRegisterDTO request
    ) {
        return ResponseEntity.ok(authenticationService.verifyCodeAndRegister(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(
            @RequestBody LoginRequestDTO request
    ) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmail(@PathVariable("email") String email) {
        return ResponseEntity.ofNullable(
                userRepository.findByEmail(email).orElse(null)
        );
    }
}

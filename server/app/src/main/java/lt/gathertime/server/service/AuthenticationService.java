package lt.gathertime.server.service;

import lt.gathertime.server.dto.userDTOs.*;
import lt.gathertime.server.model.EmailVerificationCode;
import lt.gathertime.server.model.User;
import lt.gathertime.server.repository.EmailVerificationCodeRepository;
import lt.gathertime.server.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final EmailVerificationCodeRepository codeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;

    public void sendVerificationCode(String email) {
        String code = String.format("%06d", new Random().nextInt(1_000_000));

        EmailVerificationCode entity = EmailVerificationCode.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();
        codeRepository.save(entity);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("GatherTime – Registration Code");
        message.setText("Your verification code is: " + code);

        mailSender.send(message);
    }

    @Transactional
    public AuthenticationResponseDTO verifyCodeAndRegister(VerifyCodeAndRegisterDTO request) {
        EmailVerificationCode verification = codeRepository
                .findTopByEmailAndUsedIsFalseOrderByExpiresAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Code not found"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code expired");
        }

        if (!verification.getCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid code");
        }

        verification.setUsed(true);
        codeRepository.save(verification);

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(jwtToken)
                .build();
    }
}

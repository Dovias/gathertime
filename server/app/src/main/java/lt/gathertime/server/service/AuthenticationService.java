package lt.gathertime.server.service;

import lt.gathertime.server.data.Digestible;
import lt.gathertime.server.data.Hash;
import lt.gathertime.server.data.Password;
import lt.gathertime.server.dto.user.*;
import lt.gathertime.server.entity.EmailVerificationCode;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.repository.EmailVerificationCodeRepository;
import lt.gathertime.server.repository.UserJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserJpaRepository userJpaRepository;
    private final EmailVerificationCodeRepository codeRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;

    public void sendVerificationCode(final String email) {
        final String code = String.format("%06d", new Random().nextInt(1_000_000));

        final EmailVerificationCode entity = EmailVerificationCode.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();
        this.codeRepository.save(entity);

        final SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("GatherTime – Registration Code");
        message.setText("Your verification code is: " + code);

        this.mailSender.send(message);
    }

    @Transactional
    public AuthenticationResponseDTO verifyCodeAndRegister(final VerifyCodeAndRegisterDTO request) {
        final EmailVerificationCode verification = this.codeRepository
                .findTopByEmailAndUsedIsFalseOrderByExpiresAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Code not found"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code expired");
        }

        if (!verification.getCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid code");
        }

        verification.setUsed(true);
        this.codeRepository.save(verification);

        final User user = User.builder()
                .email(request.getEmail())
                .password(Hash.from(Digestible.of(Password.of(request.getPassword()).value())).value())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
        this.userJpaRepository.save(user);

        final var jwtToken = this.jwtService.generateToken(user);

        return AuthenticationResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponseDTO login(final LoginRequestDTO request) {
        this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        final var user = this.userJpaRepository.findByEmail(request.getEmail())
                .orElseThrow();

        final var jwtToken = this.jwtService.generateToken(user);

        return AuthenticationResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(jwtToken)
                .build();
    }
}

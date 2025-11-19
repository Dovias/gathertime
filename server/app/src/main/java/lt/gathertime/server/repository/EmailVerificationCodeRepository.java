package lt.gathertime.server.repository;

import lt.gathertime.server.model.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {

    Optional<EmailVerificationCode> findTopByEmailAndUsedIsFalseOrderByExpiresAtDesc(String email);
}

package lt.gathertime.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import lt.gathertime.server.entity.EmailVerificationCode;

import java.util.Optional;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {

    Optional<EmailVerificationCode> findTopByEmailAndUsedIsFalseOrderByExpiresAtDesc(String email);
}

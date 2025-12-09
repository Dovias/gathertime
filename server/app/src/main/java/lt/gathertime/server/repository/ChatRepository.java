package lt.gathertime.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import lt.gathertime.server.entity.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}


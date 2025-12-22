package lt.gathertime.server.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import lt.gathertime.server.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("""
            SELECT c 
            FROM Comment c
            WHERE c.chat.id = :chatId
            ORDER BY c.sentDateTime DESC
            """)
    List<Comment> findChatComments(@Param("chatId") Long chatId, Pageable pageable);
}


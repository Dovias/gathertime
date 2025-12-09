package lt.gathertime.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import lt.gathertime.server.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}


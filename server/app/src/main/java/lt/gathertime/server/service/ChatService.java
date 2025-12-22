package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

import lt.gathertime.server.data.Password;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.comment.CommentDTO;
import lt.gathertime.server.entity.Chat;
import lt.gathertime.server.entity.Comment;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.mapper.CommentMapper;
import lt.gathertime.server.repository.ChatRepository;
import lt.gathertime.server.repository.CommentRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ChatService {
        private final CommentRepository commentRepository;
        private final ChatRepository chatRepository;
        private final UserRepository userRepository;

        @Transactional
        public CommentDTO createComment(final Long chatId, final Long userId, final String content) {
                final Chat chat = this.chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));

                final User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

                final Comment comment = Comment.builder()
                                .content(content)
                                .sentDateTime(LocalDateTime.now())
                                .chat(chat)
                                .user(user)
                                .build();

            this.commentRepository.save(comment);

                return CommentMapper.toCommentDTO(comment);
        }

        public List<CommentDTO> getChatComments(final Long chatId) {

                final Chat chat = this.chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));


                final List<Comment> comments = this.commentRepository.findChatComments(chat.getId(), PageRequest.of(0, 20));
                
                return comments.stream()
                        .map(CommentMapper::toCommentDTO)
                        .toList();
        }

        @Transactional
        public void updateComment(final Long chatId, final Long userId, final Long commentId, final String content) {
                final Chat chat = this.chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));

                final User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

                final Comment comment = this.commentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("Comment not found with id " + commentId));

                if(user.getId() != comment.getUser().getId()) {
                        throw new AccessDeniedException("You cannot edit someone else's comment");
                }

                comment.setContent(content);
        }

        @Transactional
        public void deleteComment(final Long chatId, final Long userId, final Long commentId) {
                final Chat chat = this.chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));

                final User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

                final Comment comment = this.commentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("Comment not found with id " + commentId));

                if(user.getId() != comment.getUser().getId()) {
                        throw new AccessDeniedException("You cannot delete someone else's comment");
                }

            this.commentRepository.delete(comment);
        }
}

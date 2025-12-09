package lt.gathertime.server.service;

import java.time.LocalDateTime;
import java.util.List;

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
        public CommentDTO createComment(Long chatId, Long userId, String content) {

                Chat chat = chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

                Comment comment = Comment.builder()
                                .content(content)
                                .sentDateTime(LocalDateTime.now())
                                .chat(chat)
                                .user(user)
                                .build();

                commentRepository.save(comment);

                return CommentMapper.toCommentDTO(comment);
        }

        public List<CommentDTO> getChatComments(Long chatId) {

                Chat chat = chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));


                List<Comment> comments = commentRepository.findChatComments(chat.getId(), PageRequest.of(0, 20));
                
                return comments.stream()
                        .map(CommentMapper::toCommentDTO)
                        .toList();
        }

        @Transactional
        public void updateComment(Long chatId, Long userId, Long commentId, String content) {
                Chat chat = chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat not found with id " + chatId));

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

                Comment comment = commentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("Comment not found with id " + commentId));

                if(user.getId() != comment.getUser().getId()) {
                        throw new AccessDeniedException("You cannot edit someone else's comment");
                }

                comment.setContent(content);
        }
}

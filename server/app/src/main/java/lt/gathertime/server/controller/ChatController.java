package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.comment.CommentDTO;
import lt.gathertime.server.dto.comment.CreateCommentRequestDTO;
import lt.gathertime.server.service.ChatService;

@RestController
@RequestMapping("/chat/{chatId}")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;

    @PostMapping("/user/{userId}/comment")
    public CommentDTO createComment(
        @PathVariable Long chatId,
        @PathVariable Long userId,
        @Valid @RequestBody CreateCommentRequestDTO payload) {
            return chatService.createComment(chatId, userId, payload.getContent());
    }

    @GetMapping
    public List<CommentDTO> getChatComments(@PathVariable Long chatId) {
        return chatService.getChatComments(chatId);
    }
}

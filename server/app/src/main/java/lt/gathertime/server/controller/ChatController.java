package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.comment.CommentDTO;
import lt.gathertime.server.dto.comment.UpsertCommentRequestDTO;
import lt.gathertime.server.service.ChatService;

@RestController
@RequestMapping("/chat/{chatId}")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;

    @PostMapping("/user/{userId}/comment")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentDTO createComment(
        @PathVariable Long chatId,
        @PathVariable Long userId,
        @Valid @RequestBody UpsertCommentRequestDTO payload) {
            return chatService.createComment(chatId, userId, payload.getContent());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CommentDTO> getChatComments(@PathVariable Long chatId) {
        return chatService.getChatComments(chatId);
    }

    @PutMapping("/user/{userId}/comment/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void editComment(
        @PathVariable Long chatId,
        @PathVariable Long userId,
        @PathVariable Long commentId,
        @Valid @RequestBody UpsertCommentRequestDTO payload
    ) {
        chatService.updateComment(chatId, userId, commentId, payload.getContent());
    }
}

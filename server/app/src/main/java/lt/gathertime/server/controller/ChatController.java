package lt.gathertime.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
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
        @PathVariable final Long chatId,
        @PathVariable final Long userId,
        @Valid @RequestBody final UpsertCommentRequestDTO payload) {
            return this.chatService.createComment(chatId, userId, payload.getContent());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CommentDTO> getChatComments(@PathVariable final Long chatId) {
        return this.chatService.getChatComments(chatId);
    }

    @PutMapping("/user/{userId}/comment/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void editComment(
        @PathVariable final Long chatId,
        @PathVariable final Long userId,
        @PathVariable final Long commentId,
        @Valid @RequestBody final UpsertCommentRequestDTO payload
    ) {
        this.chatService.updateComment(chatId, userId, commentId, payload.getContent());
    }

    @DeleteMapping("/user/{userId}/comment/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(
        @PathVariable final Long chatId,
        @PathVariable final Long userId,
        @PathVariable final Long commentId
    ) {
        this.chatService.deleteComment(chatId, userId, commentId);
    }
}

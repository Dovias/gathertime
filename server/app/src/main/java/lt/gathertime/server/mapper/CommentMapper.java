package lt.gathertime.server.mapper;

import lt.gathertime.server.dto.comment.CommentDTO;
import lt.gathertime.server.entity.Comment;

public class CommentMapper {

    public static CommentDTO toCommentDTO(final Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .sentDateTime(comment.getSentDateTime())
                .userId(comment.getUser().getId())
                .chatId(comment.getChat().getId())
                .build();
    }
}

package lt.gathertime.server.dto.comment;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CommentDTO {

    @NotNull
    private Long id;
    
    @NotBlank
    private String content;

    @NotNull
    private LocalDateTime sentDateTime;

    @NotNull
    private long chatId;

    @NotNull
    private long userId;
}

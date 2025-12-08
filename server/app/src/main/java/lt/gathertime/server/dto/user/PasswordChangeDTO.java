package lt.gathertime.server.dto.user;

import lombok.Data;

@Data
public class PasswordChangeDTO {
    private Long id;
    private String password;
}

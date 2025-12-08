package lt.gathertime.server.dto.user;

import lombok.Data;

@Data
public class UpdateInfoDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
}

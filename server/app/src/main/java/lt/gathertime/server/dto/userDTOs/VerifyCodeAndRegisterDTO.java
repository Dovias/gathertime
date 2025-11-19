package lt.gathertime.server.dto.userDTOs;

import lombok.Data;

@Data
public class VerifyCodeAndRegisterDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String code;
}

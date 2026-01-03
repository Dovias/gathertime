package lt.gathertime.server.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileInfoDTO {
    
    private Long id;

    private String firstName;
    
    private String lastName;
}

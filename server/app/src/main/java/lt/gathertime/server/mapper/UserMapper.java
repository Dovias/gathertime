package lt.gathertime.server.mapper;

import lt.gathertime.server.dto.user.RegistrationRequestDTO;
import lt.gathertime.server.dto.user.UserResponseDTO;
import lt.gathertime.server.entity.User;

public class UserMapper {

    public static UserResponseDTO toDto(final User user){

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public static User fromDto(final RegistrationRequestDTO registrationRequestDTO){

        return User.builder()
                .email(registrationRequestDTO.getEmail())
                .password(registrationRequestDTO.getPassword())
                .firstName(registrationRequestDTO.getFirstName())
                .lastName(registrationRequestDTO.getLastName())
                .build();
    }
}

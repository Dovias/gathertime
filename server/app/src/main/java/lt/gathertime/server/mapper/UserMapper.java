package lt.gathertime.server.mapper;

import lt.gathertime.server.dto.userDTOs.RegistrationRequestDTO;
import lt.gathertime.server.dto.userDTOs.UserResponseDTO;
import lt.gathertime.server.model.User;

public class UserMapper {

    public static UserResponseDTO toDto(User user){

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public static User fromDto(RegistrationRequestDTO registrationRequestDTO){

        return User.builder()
                .email(registrationRequestDTO.getEmail())
                .password(registrationRequestDTO.getPassword())
                .firstName(registrationRequestDTO.getFirstName())
                .lastName(registrationRequestDTO.getLastName())
                .build();
    }
}

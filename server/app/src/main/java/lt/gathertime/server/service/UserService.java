package lt.gathertime.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.user.UpdateInfoDTO;
import lt.gathertime.server.dto.user.UserFullNameDTO;
import lt.gathertime.server.dto.user.UserResponseDTO;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.mapper.UserMapper;
import lt.gathertime.server.repository.UserRepository;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO getUserById(final Long id) {
        final User user = this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return UserMapper.toDto(user);
    }

    public List<UserFullNameDTO> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        List<User> users = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);

        return users.stream()
                .map(user -> new UserFullNameDTO(user.getId(), user.getFirstName(), user.getLastName()))
                .toList();
    }

    public UserResponseDTO updateUserProfile(final UpdateInfoDTO request) {

        final User user = this.userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getId()));

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        final User saved = this.userRepository.save(user);

        return UserMapper.toDto(saved);
    }

    @Transactional
    public void changePassword(final Long id, final String newPassword) {
        final User user = this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        user.setPassword(this.passwordEncoder.encode(newPassword));

        this.userRepository.save(user);
    }

}

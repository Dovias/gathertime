package lt.gathertime.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.user.UpdateInfoDTO;
import lt.gathertime.server.dto.user.UserResponseDTO;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.mapper.UserMapper;
import lt.gathertime.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return UserMapper.toDto(user);
    }

    public UserResponseDTO updateUserProfile(UpdateInfoDTO request) {

        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getId()));

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User saved = userRepository.save(user);

        return UserMapper.toDto(saved);
    }

    @Transactional
    public void changePassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

}

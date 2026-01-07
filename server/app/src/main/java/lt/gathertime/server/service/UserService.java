package lt.gathertime.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.data.Digestible;
import lt.gathertime.server.data.Hash;
import lt.gathertime.server.data.Password;
import lt.gathertime.server.dto.user.*;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.exception.DigestibleViolationException;
import lt.gathertime.server.exception.EquivalentHashException;
import lt.gathertime.server.exception.PasswordViolationException;
import lt.gathertime.server.exception.UserNotFoundException;
import lt.gathertime.server.mapper.UserMapper;
import lt.gathertime.server.repository.UserJpaRepository;

import java.util.List;

import lt.gathertime.server.repository.UserRepository;
import lt.gathertime.server.type.PasswordViolation;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserJpaRepository userJpaRepository;
    private final UserRepository repository;

    public UserResponseDTO getUserById(final Long id) {
        final User user = this.userJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return UserMapper.toDto(user);
    }

    public UserProfileInfoDTO getUserProfileInfo(final Long id) {
        final User user = this.userJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return UserMapper.tProfileInfoDto(user);
    }

    public List<UserFullNameDTO> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        List<User> users = userJpaRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);

        return users.stream()
                .map(user -> new UserFullNameDTO(user.getId(), user.getFirstName(), user.getLastName()))
                .toList();
    }

    public UserResponseDTO updateUserProfile(final UpdateInfoDTO request) {

        final User user = this.userJpaRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getId()));

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        final User saved = this.userJpaRepository.save(user);

        return UserMapper.toDto(saved);
    }

    @Transactional
    public void changePassword(final PasswordChangeDTO request) {
        try {
            final Password password = Password.of(request.getPassword());
            final Digestible digestible = Digestible.of(password.value());

            final long id = request.getId();
            final Hash current = this.repository.findPasswordHashById(id);
            if (current == null) {
                throw new UserNotFoundException("user with id: " + id + " was not found");
            }

            final Hash changed = current.change(digestible);
            this.repository.updatePasswordHashById(id, changed);
        } catch (final DigestibleViolationException exception) {
            throw new PasswordViolationException("provided password is not valid", PasswordViolation.INVALID);
        } catch (final EquivalentHashException exception) {
            throw new PasswordViolationException("provided password is identical", PasswordViolation.IDENTICAL);
        }
    }

}

package lt.gathertime.server.repository;

import jakarta.annotation.Nullable;
import lt.gathertime.server.data.Hash;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.exception.UserNotFoundException;
import org.jspecify.annotations.NullMarked;
import org.springframework.stereotype.Service;

@Service
@NullMarked
public final class UserRepository {
    private final UserJpaRepository repository;

    public UserRepository(final UserJpaRepository repository) {
        this.repository = repository;
    }

    public @Nullable Hash findPasswordHashById(final long id) {
        return this.repository.findById(id).map(User::getPassword).map(Hash::of).orElse(null);
    }

    public void updatePasswordHashById(final long id, final Hash password) {
        this.repository.save(
            this.repository.findById(id).map(user -> {
                user.setPassword(password.value());

                return user;
            }).orElseThrow(() -> new UserNotFoundException("user with id: " + id + " was not found"))
        );
    }
}

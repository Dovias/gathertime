package lt.gathertime.server.value;

import java.util.Objects;

import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder.BCryptVersion;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.google.common.base.Preconditions;

@NullMarked
public final class Password {
    private final static PasswordEncoder ENCODER = new BCryptPasswordEncoder(BCryptVersion.$2A, 10);

    private final PasswordEncoder encoder;
    private final String value;

    private Password(final PasswordEncoder encoder, final String value) {
        this.encoder = encoder;
        this.value = value;
    }

    public boolean validate(final String value) {
        return this.encoder.matches(this.value, value);
    }

    @Override
    public String toString() {
        return this.value;
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (this == object) return true;
        if (!(object instanceof Password password)) return false;
        return Objects.equals(this.value, password.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.value);
    }

    public static Password encode(final String password) {
        Preconditions.checkNotNull(password, "password cannot be null");
        return new Password(Password.ENCODER, Password.ENCODER.encode(password));
    }
    

    public static Password encoded(final String password) {
        Preconditions.checkNotNull(password, "password cannot be null");
        return new Password(Password.ENCODER, password);
    }
}

package lt.gathertime.server.data;

import lt.gathertime.server.exception.DataConflictException;
import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NullMarked
public final class Email {
    private final static Pattern PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private final String value;

    private Email(String name) {
        this.value = name;
    }

    public String value() {
        return this.value;
    }

    public Email change(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value is null");
        }

        if (this.value.equals(value)) {
            throw new DataConflictException("provided value is equivalent");
        }

        return Email.of(value);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.value);
    }

    @Override
    public String toString() {
        return "Email{value='" + value + "'}";
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (!(object instanceof final Email name)) return false;
        return Objects.equals(this.value, name.value);
    }

    public static Email of(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value is null");
        }

        final Matcher matcher = Email.PATTERN.matcher(value);
        if (!matcher.matches()) {
            throw new InvalidDataException("provided value is invalid");
        }

        return new Email(value);
    }
}

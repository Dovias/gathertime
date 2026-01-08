package lt.gathertime.server.data;

import lt.gathertime.server.exception.DataConflictException;
import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NullMarked
public final class Name {
    private final static Pattern PATTERN = Pattern.compile("^\\p{L}(?:[\\p{L}\\p{M}\\s'-]*\\p{L})?$");
    private final String value;

    private Name(String name) {
        this.value = name;
    }

    public String value() {
        return this.value;
    }

    public Name change(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value is null");
        }

        if (this.value.equals(value)) {
            throw new DataConflictException("provided value is equivalent");
        }

        return Name.of(value);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.value);
    }

    @Override
    public String toString() {
        return "Name{value='" + value + "'}";
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (!(object instanceof final Name name)) return false;
        return Objects.equals(this.value, name.value);
    }

    public static Name of(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value is null");
        }

        final Matcher matcher = Name.PATTERN.matcher(value);
        if (!matcher.matches()) {
            throw new InvalidDataException("provided value is invalid");
        }

        return new Name(value);
    }
}

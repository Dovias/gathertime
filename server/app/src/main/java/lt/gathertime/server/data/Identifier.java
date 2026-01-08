package lt.gathertime.server.data;

import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

import java.util.Objects;

@NullMarked
public final class Identifier {
    private final long value;

    private Identifier(long value) {
        this.value = value;
    }

    public long value() {
        return this.value;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.value);
    }

    @Override
    public String toString() {
        return "Identifier{value='" + this.value + "'}";
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (!(object instanceof final Identifier identifier)) return false;
        return Objects.equals(this.value, identifier.value);
    }

    public static Identifier of(final long value) {
        if (value < 0) {
            throw new InvalidDataException("provided value is invalid");
        }

        return new Identifier(value);
    }
}

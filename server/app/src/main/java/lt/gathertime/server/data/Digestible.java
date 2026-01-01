package lt.gathertime.server.data;

import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

@NullMarked
public final class Digestible {
    private final String value;

    private Digestible(final String value) {
        this.value = value;
    }

    /**
     * Returns representative value of this {@link Digestible}.
     *
     * @return representative value
     */
    public String value() {
        return this.value;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.value);
    }

    @Override
    public String toString() {
        return "Digestible{value='" + this.value + "'}";
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (!(object instanceof final Digestible digestible)) return false;
        return Objects.equals(this.value, digestible.value);
    }

    /**
     * Creates new {@link Digestible} from the provided acceptable value.
     *
     * <p>Acceptable value size should not exceed <b>72 bytes</b> in UTF-8 encoding.</li>
     * @param value representative value
     * @return newly created {@link Digestible}
     * @throws NullPointerException if the provided value is null
     * @throws IllegalArgumentException if the provided value is not acceptable
     */
    public static Digestible of(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value cannot be null");
        }
        if (value.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("provided value is too long");
        }

        return new Digestible(value);
    }
}

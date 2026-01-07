package lt.gathertime.server.data;

import lt.gathertime.server.exception.PasswordViolationException;
import lt.gathertime.server.type.PasswordViolation;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NullMarked
public final class Password {
    private final static Pattern PATTERN = Pattern.compile("^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9]).{5,})\\S$");

    private final String value;

    private Password(final String value) {
        this.value = value;
    }

    /**
     * Returns representative value of this {@link Password}.
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
        return "Password{value='********'}";
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (!(object instanceof final Password password)) return false;
        return Objects.equals(this.value, password.value);
    }

    /**
     * Creates new {@link Password} from the representative value.
     * <p>Acceptable representative values consist of at least:</p>
     * <ul>
     *     <li><b>6</b> characters</li>
     *     <li><b>one</b> uppercase letter</li>
     *     <li><b>one</b> lowercase letter</li>
     *     <li><b>one</b> digit</li>
     * </ul>
     *
     * @param value representative value
     * @return newly created {@link Password}
     * @throws NullPointerException representative value is null
     * @throws PasswordViolationException representative value is not acceptable
     */
    public static Password of(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value is null");
        }

        final Matcher matcher = Password.PATTERN.matcher(value);
        if (!matcher.matches()) {
            throw new PasswordViolationException("provided value is not acceptable", PasswordViolation.INVALID);
        }

        return new Password(value);
    }
}

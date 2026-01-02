package lt.gathertime.server.data;

import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NullMarked
public final class Hash {
    private static final Pattern PATTERN = Pattern.compile("\\A\\$2([ayb])?\\$(\\d\\d)\\$[./0-9A-Za-z]{53}");
    private final static PasswordEncoder ENCODER = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2A, 10);

    private final PasswordEncoder encoder;
    private final String value;

    private Hash(final PasswordEncoder encoder, final String value) {
        this.encoder = encoder;
        this.value = value;
    }

    /**
     * Returns representative value of this {@link Hash}.
     *
     * @return representative value
     */
    public String value() {
        return this.value;
    }

    /**
     * Checks whether comparison value matches the value being used to compute this hash.
     *
     * @param value comparison value
     * @throws NullPointerException comparison value is null
     * @return whether comparison value is equivalent to the computation value of this hash
     */
    public boolean matches(final Digestible value) {
        if (value == null) {
            throw new NullPointerException("provided value cannot be null");
        }

        return this.encoder.matches(value.value(), this.value);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.value);
    }

    @Override
    public String toString() {
        return "Hash{encoder='bcrypt', value='********'";
    }

    @Override
    public boolean equals(final @Nullable Object object) {
        if (!(object instanceof final Hash hash)) return false;
        return Objects.equals(this.value, hash.value);
    }

    /**
     * Creates new {@link Hash} from the representative value.
     *
     * <p>Valid representative value is equivalent to the result of {@link #value()} method.</p>
     * @param value representative value
     * @return newly created {@link Hash}
     * @throws NullPointerException representative value is null
     * @throws IllegalArgumentException representative value is not valid
     */
    public static Hash of(final String value) {
        if (value == null) {
            throw new NullPointerException("provided value cannot be null");
        }

        final Matcher matcher = Hash.PATTERN.matcher(value);
        if (!matcher.matches()) {
            throw new IllegalArgumentException("provided value is not valid");
        }

        return new Hash(Hash.ENCODER, value);
    }

    /**
     * Computes new {@link Hash} from the representative value.
     *
     * @param value representative value
     * @return newly computed {@link Hash}
     * @throws NullPointerException representative value is null
     */
    public static Hash from(final Digestible value) {
        if (value == null) {
            throw new NullPointerException("provided value cannot be null");
        }

        return new Hash(Hash.ENCODER, Hash.ENCODER.encode(value.value()));
    }
}

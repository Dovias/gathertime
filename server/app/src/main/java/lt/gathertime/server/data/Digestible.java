package lt.gathertime.server.data;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import lt.gathertime.server.exception.DigestibleViolationException;

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
   * Creates new {@link Digestible} from the provided representative value.
   *
   * <p>Valid representative value length should not exceed <b>72 bytes</b> in UTF-8 encoding.</li>
   * @param value representative value
   * @return newly created {@link Digestible}
   * @throws NullPointerException if the provided value is null
   * @throws DigestibleViolationException if the provided value is not valid
   */
  public static Digestible of(final String value) {
      if (value == null) {
        throw new NullPointerException("provided value is null");
      }
      if (value.getBytes(StandardCharsets.UTF_8).length > 72) {
        throw new DigestibleViolationException("provided value is not valid");
      }

      return new Digestible(value);
  }
}

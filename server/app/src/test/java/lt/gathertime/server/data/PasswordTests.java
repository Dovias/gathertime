package lt.gathertime.server.data;

import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

@NullMarked
public final class PasswordTests {
    @ParameterizedTest
    @ValueSource(strings = {"Abc123", "Password147!", "{\"Key\":1}", "^[a-zA-Z0-9]$", "\"B0'b`,🔑" })
    public void successInCreatingPasswordWithValidValue(final String value) {
        final Password password = Password.of(value);
        Assertions.assertNotNull(password);
        Assertions.assertEquals(password.value(), value);
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "", "b", ":f", "b1", "@1e",
        "Eoc", "Fg@#", "Cod1", "RoT_1",
        "tunnel", "ab.cde", "abcd12", "4cdab!",
        "a,rehnf", "ebd1'ef", "asdbme1`",
        "enderMN", "baTmn\"", "mayDeF🏦",
        "' OR '1'='1", "cat /etc/passwd", "ssh://root@localhost"
    })
    public void failureInCreatingPasswordWithInvalidValue(final String value) {
        Assertions.assertThrows(InvalidDataException.class, () -> Password.of(value));
    }

    @Test
    public void failureInCreatingPasswordWithNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Password.of(null));
    }

    @Test
    public void successInReturningPasswordValue() {
        final Password password = Password.of("T0ksT1!");
        final String value = Assertions.assertDoesNotThrow(password::value);

        Assertions.assertNotNull(value);
    }

    @Test
    public void successInComputingPasswordHashCode() {
        final Password password = Password.of("L~💎'0a!");

        Assertions.assertDoesNotThrow(password::toString);
    }

    @Test
    public void successInComputingUserFriendlyPasswordRepresentation() {
        final Password password = Password.of("1=1&Drop;");
        final String representation = Assertions.assertDoesNotThrow(password::toString);

        Assertions.assertNotNull(representation);
    }

    @Test
    public void successInComparingEquivalentPasswords() {
        final String value = "\u0000;Br0k3n!";
        final Password password1 = Password.of(value);
        final Password password2 = Password.of(value);

        Assertions.assertEquals(password1, password2);
        Assertions.assertEquals(password1.hashCode(), password2.hashCode());
    }

    @Test
    public void successInComparingNonEquivalentPasswords() {
        final Password password1 = Password.of("Null!🧨1");
        final Password password2 = Password.of("https://H0ll0w.com");

        Assertions.assertNotEquals(password1, password2);
        Assertions.assertNotEquals(password2, password1);
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = "PieBrain5#,🧠'")
    public void successInComparingNonEquivalentObjects(final String value) {
        Assertions.assertNotEquals(Password.of("\\x1b[31M'--"), value);
    }
}

package lt.gathertime.server.data;

import lt.gathertime.server.exception.DataConflictException;
import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

@NullMarked
public final class EmailTests {
    @ParameterizedTest
    @ValueSource(strings = {"dovidas.zablockis@stud.vilniustech.lt", "foo@bar.com", "a@yahoo.com"})
    public void successInCreatingEmailFromValidValue(final String value) {
        final Email email = Email.of(value);
        Assertions.assertNotNull(email);
        Assertions.assertEquals(value, email.value());
    }

    @Test
    public void failureInCreatingEmailFromNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Email.of(null));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "cherry!", "@", " Lukas@", "@redas ", "foo@bar ", "李@bar.com", "root@localhost", "root@127.0.0.1"})
    public void failureInCreatingEmailFromInvalidValue(final String value) {
        Assertions.assertThrows(InvalidDataException.class, () -> Email.of(value));
    }

    @Test
    public void successInReturningEmailValue() {
        final Email email = Email.of("lukas@duck.me");
        final String value = Assertions.assertDoesNotThrow(email::value);
        Assertions.assertNotNull(value);
    }

    @Test
    public void successInChangingEmailWithNonEquivalentValue() {
        final Email current = Email.of("admin@riebuskatinas.lt");
        final String value = "gaben@steampowered.com";
        final Email changed = current.change(value);

        Assertions.assertNotEquals(current, changed);
        Assertions.assertEquals(value, changed.value());
    }

    @Test
    public void failureInChangingEmailWithEquivalentValue() {
        final String value = "monkey@vienna.zoo";
        final Email email = Email.of(value);

        Assertions.assertThrows(DataConflictException.class, () -> email.change(value));
    }

    @Test
    public void failureInChangingEmailWithNullValue() {
        final Email email = Email.of("noreply@microsoft.com");

        Assertions.assertThrows(NullPointerException.class, () -> email.change(null));
    }

    @Test
    public void successInComparingEquivalentEmails() {
        final String value = "dov1as@proton.me";
        final Email email1 = Email.of(value);
        final Email email2 = Email.of(value);

        Assertions.assertEquals(email1, email2);
        Assertions.assertEquals(email1.hashCode(), email2.hashCode());
    }

    @Test
    public void successInComparingNonEquivalentEmails() {
        final Email email1 = Email.of("dumb-and-dumber@disney.com");
        final Email email2 = Email.of("vaxry@hyprland.dev");

        Assertions.assertNotEquals(email1, email2);
        Assertions.assertNotEquals(email2, email1);
    }

    @ParameterizedTest
    @NullAndEmptySource
    public void successInComparingNonEquivalentObjects(final String value) {
        Assertions.assertNotEquals(Email.of("notifications@word.microsoft"), value);
    }
}

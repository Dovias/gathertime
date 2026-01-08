package lt.gathertime.server.data;

import lt.gathertime.server.exception.DataConflictException;
import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

@NullMarked
public final class NameTests {
    @ParameterizedTest
    @ValueSource(strings = {"Dovidas", "A", "b", "李"})
    public void successInCreatingNameFromValidValue(final String value) {
        final Name name = Name.of(value);
        Assertions.assertNotNull(name);
        Assertions.assertEquals(value, name.value());
    }

    @Test
    public void failureInCreatingNameFromNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Name.of(null));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "_", " Lukas", "Birutė "})
    public void failureInCreatingNameFromInvalidValue(final String value) {
        Assertions.assertThrows(InvalidDataException.class, () -> Name.of(value));
    }

    @Test
    public void successInReturningNameValue() {
        final Name name = Name.of("Rytis");
        final String value = Assertions.assertDoesNotThrow(name::value);
        Assertions.assertNotNull(value);
    }

    @Test
    public void successInChangingNameWithNonEquivalentValue() {
        final Name current = Name.of("Urtė");
        final String value = "Pavardenė";
        final Name changed = current.change(value);

        Assertions.assertNotEquals(current, changed);
        Assertions.assertEquals(value, changed.value());
    }

    @Test
    public void failureInChangingNameWithEquivalentValue() {
        final String value = "Dominykas";
        final Name name = Name.of(value);

        Assertions.assertThrows(DataConflictException.class, () -> name.change(value));
    }

    @Test
    public void failureInChangingNameWithNullValue() {
        final Name name = Name.of("Tomas");

        Assertions.assertThrows(NullPointerException.class, () -> name.change(null));
    }

    @Test
    public void successInComparingEquivalentHashes() {
        final String value = "Zablockis";
        final Name name1 = Name.of(value);
        final Name name2 = Name.of(value);

        Assertions.assertEquals(name1, name2);
        Assertions.assertEquals(name1.hashCode(), name2.hashCode());
    }

    @Test
    public void successInComparingNonEquivalentHashes() {
        final Name name1 = Name.of("Jonas");
        final Name name2 = Name.of("Valančiūnas");

        Assertions.assertNotEquals(name1, name2);
        Assertions.assertNotEquals(name2, name1);
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(ints = {5})
    public void successInComparingNonEquivalentObjects(final Integer value) {
        Assertions.assertNotEquals(Name.of("Javtokas"), value);
    }
}

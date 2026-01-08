package lt.gathertime.server.data;

import lt.gathertime.server.exception.InvalidDataException;
import org.jspecify.annotations.NullMarked;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

@NullMarked
public final class IdentifierTests {
    @ParameterizedTest
    @ValueSource(longs = {0, Long.MAX_VALUE / 2, Long.MAX_VALUE})
    public void successInCreatingIdentifierFromValidValue(final long value) {
        final Identifier identifier = Identifier.of(value);
        Assertions.assertNotNull(identifier);
        Assertions.assertEquals(value, identifier.value());
    }

    @ParameterizedTest
    @ValueSource(longs = {-1, Long.MIN_VALUE / 2, Long.MIN_VALUE})
    public void failureInCreatingIdentifierFromInvalidValue(final long value) {
        Assertions.assertThrows(InvalidDataException.class, () -> Identifier.of(value));
    }

    @Test
    public void successInReturningIdentifierValue() {
        final Identifier identifier = Identifier.of(3);
        Assertions.assertDoesNotThrow(identifier::value);
    }

    @Test
    public void successInComparingEquivalentIdentifiers() {
        final long value = 80;
        final Identifier identifier1 = Identifier.of(value);
        final Identifier identifier2 = Identifier.of(value);

        Assertions.assertEquals(identifier1, identifier2);
        Assertions.assertEquals(identifier1.hashCode(), identifier2.hashCode());
    }

    @Test
    public void successInComparingNonEquivalentIdentifiers() {
        final Identifier identifier1 = Identifier.of(9999);
        final Identifier identifier2 = Identifier.of(Long.MAX_VALUE - 1);

        Assertions.assertNotEquals(identifier1, identifier2);
        Assertions.assertNotEquals(identifier2, identifier1);
    }

    @ParameterizedTest
    @NullAndEmptySource
    public void successInComparingNonEquivalentObjects(final String value) {
        Assertions.assertNotEquals(Identifier.of(340), value);
    }
}

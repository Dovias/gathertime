package lt.gathertime.server.data;

import org.jspecify.annotations.NullMarked;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.stream.Stream;

@NullMarked
public final class DigestibleTests {
    // Emojis here might seem weird, but they're 4 bytes each in UTF-8 so it produces readable
    // edge case (72 byte) strings (range: [0; 72] bytes)
    @ParameterizedTest
    @ValueSource(strings = {"", "Testas123!@._;", "🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽"})
    public void successInCreatingDigestibleWithValidValue(final String value) {
        final Digestible digestible = Assertions.assertDoesNotThrow(() -> Digestible.of(value));
        Assertions.assertNotNull(digestible);
    }

    @Test
    public void failureInCreatingDigestibleWithNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Digestible.of(null));
    }

    @Test
    public void failureInCreatingDigestibleWithTooLongValue() {
        // 73 bytes of garbage data (16 emojis * 4 bytes + 1 dot * 1 byte = 73 bytes)
        Assertions.assertThrows(IllegalArgumentException.class, () -> Digestible.of("🌈🎨🎭🎪🎤🎧🎼🎹🥁🎷🎺🎸🎻🪕🎬🎮🎯🎲."));
    }

    @Test
    public void successInReturningDigestibleValue() {
        final String value = "BlueSky42#!";
        Assertions.assertEquals(value, Digestible.of(value).value());
    }

    @Test
    public void successInComputingDigestibleHashCode() {
        final Digestible digestible = Digestible.of("GreenTree1@");

        Assertions.assertDoesNotThrow(digestible::hashCode);
    }

    @Test
    public void successInComputingUserFriendlyDigestibleRepresentation() {
        final Digestible digestible = Digestible.of("FastCar88%");
        final String representation = digestible.toString();

        Assertions.assertNotNull(representation);
    }

    @Test
    public void successInComparingIdenticalDigestibles() {
        final Digestible digestible = Digestible.of("CoffeeMug9$");

        Assertions.assertEquals(digestible, digestible);
    }

    @Test
    public void successInComparingEquivalentDigestibles() {
        final String value = "WarmRain6!";
        final Digestible digestible1 = Digestible.of(value);
        final Digestible digestible2 = Digestible.of(value);

        Assertions.assertEquals(digestible1, digestible2);
        Assertions.assertEquals(digestible1.hashCode(), digestible2.hashCode());
    }

    @Test
    public void successInComparingNonEquivalentDigestibles() {
        final Digestible digestible1 = Digestible.of("GreenTree1@");
        final Digestible digestible2 = Digestible.of("C0coaCUP8&");

        Assertions.assertNotEquals(digestible1, digestible2);
        Assertions.assertNotEquals(digestible2, digestible1);
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = "ChaiMug5^")
    public void successInComparingNonEquivalentObjects(final String value) {
        Assertions.assertNotEquals(Digestible.of("RedApple5&"), value);
    }
}

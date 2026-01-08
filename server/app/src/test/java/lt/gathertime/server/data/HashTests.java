package lt.gathertime.server.data;

import lt.gathertime.server.exception.DataConflictException;
import org.jspecify.annotations.NullMarked;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

@NullMarked
public final class HashTests {
    @Test
    public void successInCreatingHashFromValidValue() {
        final Hash current = Hash.compute(Digestible.of("r0Ka5_14!"));
        final String value = current.value();

        final Hash deserialized = Assertions.assertDoesNotThrow(() -> Hash.of(value));
        Assertions.assertNotNull(deserialized);
        Assertions.assertEquals(deserialized.value(), value);
    }

    @Test
    public void failureInCreatingHashFromNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Hash.of(null));
    }

    @Test
    public void successInComputingHashFromValidValue() {
        final Hash hash = Assertions.assertDoesNotThrow(() -> Hash.compute(Digestible.of("Kavex321!#._;")));
        Assertions.assertNotNull(hash);
    }

    @Test
    public void failureInComputingHashFromNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Hash.compute(null));
    }

    @Test
    public void successInReturningHashValue() {
        final Hash hash = Hash.compute(Digestible.of("ZeNtis904$@"));
        final String serialized = Assertions.assertDoesNotThrow(hash::value);
        Assertions.assertNotNull(serialized);
    }

    @Test
    public void successInComputingHashCode() {
        final Hash hash = Hash.compute(Digestible.of("GreenTree1@"));

        Assertions.assertDoesNotThrow(hash::hashCode);
    }

    @Test
    public void successInComputingUserFriendlyHashRepresentation() {
        final Hash hash = Hash.compute(Digestible.of("JunK13603_"));

        Assertions.assertDoesNotThrow(hash::toString);
    }

    @Test
    public void successInMatchingEquivalentHashes() {
        final Digestible digestible = Digestible.of("QeNvis80_!");
        final Hash hash = Hash.compute(Digestible.of("QeNvis80_!"));

        Assertions.assertTrue(hash.matches(digestible));
    }

    @Test
    public void successInNotMatchingNonEquivalentHashes() {
        final Digestible digestible = Digestible.of("TeNqos214&!");
        final Hash hash = Hash.compute(Digestible.of("ReNtiv603#"));

        Assertions.assertFalse(hash.matches(digestible));
    }

    @Test
    public void failureInMatchingNullDigestible() {
        final Hash hash = Hash.compute(Digestible.of("QeNvis80_!"));

        Assertions.assertThrows(NullPointerException.class, () -> hash.matches(null));
    }

    @Test
    public void successInChangingHashWithNonEquivalentValue() {
        final Digestible digestible1 = Digestible.of("MiQtep206$");
        final Digestible digestible2 = Digestible.of("ZeNlus904%");

        final Hash current = Hash.compute(digestible1);
        final Hash changed = Assertions.assertDoesNotThrow(() -> current.change(digestible2));
        Assertions.assertNotEquals(current, changed);
    }

    @Test
    public void failureInChangingHashWithEquivalentValue() {
        final String value = "KoJrix831*";
        final Digestible digestible1 = Digestible.of(value);
        final Digestible digestible2 = Digestible.of(value);

        final Hash current = Hash.compute(digestible1);
        Assertions.assertThrows(DataConflictException.class, () -> current.change(digestible2));
    }

    @Test
    public void failureInChangingHashWithNullValue() {
        final Digestible digestible = Digestible.of("KoJrix831*");
        final Hash hash = Hash.compute(digestible);

        Assertions.assertThrows(NullPointerException.class, () -> hash.change(null));
    }

    @Test
    public void successInComparingEquivalentHashes() {
        final Hash hash1 = Hash.compute(Digestible.of("QeNvis80_!"));
        final Hash hash2 = Hash.of(hash1.value());

        Assertions.assertEquals(hash1, hash2);
        Assertions.assertEquals(hash1.hashCode(), hash2.hashCode());
        Assertions.assertEquals(hash1.value(), hash2.value());
    }

    @Test
    public void successInComparingNonEquivalentHashes() {
        final Hash hash1 = Hash.compute(Digestible.of("ReNtiv603#"));
        final Hash hash2 = Hash.compute(Digestible.of("TeNqos214."));

        Assertions.assertNotEquals(hash1, hash2);
        Assertions.assertNotEquals(hash2, hash1);
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = "JeNtoqq915%")
    public void successInComparingNonEquivalentObjects(final String value) {
        Assertions.assertNotEquals(Hash.compute(Digestible.of("ZeLpix702__&")), value);
    }
}

package lt.gathertime.server.data;

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
        final Hash hash = Hash.from(Digestible.of("r0Ka5_14!"));
        final String value = hash.value();

        final Hash deserialized = Assertions.assertDoesNotThrow(() -> Hash.of(value));
        Assertions.assertNotNull(deserialized);
    }

    @Test
    public void failureInCreatingHashFromNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Hash.of(null));
    }

    @Test
    public void successInComputingHashFromValidValue() {
        final Hash hash = Assertions.assertDoesNotThrow(() -> Hash.from(Digestible.of("Kavex321!#._;")));
        Assertions.assertNotNull(hash);
    }

    @Test
    public void failureInComputingHashFromNullValue() {
        Assertions.assertThrows(NullPointerException.class, () -> Hash.from(null));
    }

    @Test
    public void successInReturningHashValue() {
        final Hash hash = Hash.from(Digestible.of("ZeNtis904$@"));
        final String serialized = Assertions.assertDoesNotThrow(hash::value);
        Assertions.assertNotNull(serialized);
    }

    @Test
    public void successInComputingHashCode() {
        final Hash hash = Hash.from(Digestible.of("GreenTree1@"));

        Assertions.assertDoesNotThrow(hash::hashCode);
    }

    @Test
    public void successInComputingUserFriendlyHashRepresentation() {
        final Hash hash = Hash.from(Digestible.of("JunK13603_"));

        Assertions.assertDoesNotThrow(hash::toString);
    }

    @Test
    public void successInMatchingIdenticalHashes() {
        final Digestible digestible = Digestible.of("KeNfys308&!");
        final Hash hash = Hash.from(digestible);

        Assertions.assertTrue(hash.matches(digestible));
    }

    @Test
    public void successInMatchingEquivalentHashes() {
        final Digestible digestible = Digestible.of("QeNvis80_!");
        final Hash hash = Hash.from(Digestible.of("QeNvis80_!"));

        Assertions.assertTrue(hash.matches(digestible));
    }

    @Test
    public void successInNotMatchingNonEquivalentHashes() {
        final Digestible digestible = Digestible.of("TeNqos214&!");
        final Hash hash = Hash.from(Digestible.of("ReNtiv603#"));

        Assertions.assertFalse(hash.matches(digestible));
    }

    @Test
    public void failureInMatchingNullDigestible() {
        final Hash hash = Hash.from(Digestible.of("QeNvis80_!"));

        Assertions.assertThrows(NullPointerException.class, () -> hash.matches(null));
    }

    @Test
    public void successInComparingIdenticalHashes() {
        final Hash hash = Hash.from(Digestible.of("KeNfys308&!"));

        Assertions.assertEquals(hash, hash);
    }

    @Test
    public void successInComparingEquivalentHashes() {
        final Hash hash1 = Hash.from(Digestible.of("QeNvis80_!"));
        final Hash hash2 = Hash.of(hash1.value());

        Assertions.assertEquals(hash1, hash2);
        Assertions.assertEquals(hash1.hashCode(), hash2.hashCode());
    }

    @Test
    public void successInComparingNonEquivalentHashes() {
        final Hash hash1 = Hash.from(Digestible.of("ReNtiv603#"));
        final Hash hash2 = Hash.from(Digestible.of("TeNqos214."));

        Assertions.assertNotEquals(hash1, hash2);
        Assertions.assertNotEquals(hash2, hash1);
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = "JeNtoqq915%")
    public void successInComparingNonEquivalentObjects(final String value) {
        Assertions.assertNotEquals(Hash.from(Digestible.of("ZeLpix702__&")), value);
    }
}

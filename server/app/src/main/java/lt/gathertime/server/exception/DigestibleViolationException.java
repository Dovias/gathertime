package lt.gathertime.server.exception;

import org.jspecify.annotations.NullMarked;

@NullMarked
public final class DigestibleViolationException extends ResourceViolationException {
    public DigestibleViolationException(final String message) {
        super(message);
    }
}

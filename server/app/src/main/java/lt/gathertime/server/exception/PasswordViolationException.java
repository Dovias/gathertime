package lt.gathertime.server.exception;

import lt.gathertime.server.type.PasswordViolation;
import org.jspecify.annotations.NullMarked;

@NullMarked
public final class PasswordViolationException extends ResourceViolationException {
    private final PasswordViolation violation;
    public PasswordViolationException(final String message, final PasswordViolation violation) {
        super(message);
        this.violation = violation;
    }

    public PasswordViolation value() {
        return this.violation;
    }
}

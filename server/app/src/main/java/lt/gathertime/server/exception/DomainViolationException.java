package lt.gathertime.server.exception;

import lt.gathertime.server.type.DomainViolation;

public class DomainViolationException extends RuntimeException {
    private final DomainViolation violation;

    private DomainViolationException(final String message, DomainViolation violation) {
        super(message);
        this.violation = violation;
    }

    public DomainViolation violation() {
        return this.violation;
    }


    public static DomainViolationException of(final String message, DomainViolation violation) {
        if (message == null) {
            throw new NullPointerException("provided message is null");
        }
        if (violation == null) {
            throw new NullPointerException("provided violation is null");
        }

        return new DomainViolationException(message, violation);
    }
}

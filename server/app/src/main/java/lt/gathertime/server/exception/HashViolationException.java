package lt.gathertime.server.exception;

public final class HashViolationException extends ResourceViolationException {
    public HashViolationException(String message) {
        super(message);
    }
}

package lt.gathertime.server.exception;

public class ResourceViolationException extends RuntimeException {
    public ResourceViolationException(String message) {
        super(message);
    }
}

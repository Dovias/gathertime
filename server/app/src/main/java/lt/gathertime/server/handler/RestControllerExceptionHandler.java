package lt.gathertime.server.handler;

import lt.gathertime.server.exception.DomainViolationException;
import lt.gathertime.server.type.DomainViolation;
import lt.gathertime.server.type.DomainViolationCategory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestControllerExceptionHandler {
public record RestControllerError(String code, String message) {}

@ExceptionHandler(DomainViolationException.class)
public ResponseEntity<RestControllerError> handleViolation(final DomainViolationException exception) {
    final DomainViolation violation = exception.violation();
    final DomainViolationCategory category = violation.category();
    final HttpStatusCode status = switch (category) {
        case INVALID -> HttpStatus.BAD_REQUEST;
        case CONFLICT -> HttpStatus.CONFLICT;
        case NOT_FOUND -> HttpStatus.NOT_FOUND;
    };

    return ResponseEntity.status(status).body(new RestControllerError(violation.name(), exception.getMessage()));
}
}
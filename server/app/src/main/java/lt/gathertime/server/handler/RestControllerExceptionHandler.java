package lt.gathertime.server.handler;

import lt.gathertime.server.exception.PasswordViolationException;
import lt.gathertime.server.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestControllerExceptionHandler {
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public void handleNotFound() {}

    public record RestControllerError(String code) {}

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PasswordViolationException.class)
    public RestControllerError handleViolation(final PasswordViolationException exception) {
        return new RestControllerError(exception.value().name());
    }
}
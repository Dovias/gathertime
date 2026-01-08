package lt.gathertime.server.type;

public enum DomainViolation {
    PASSWORD_INVALID(DomainViolationCategory.INVALID),
    PASSWORD_CONFLICT(DomainViolationCategory.CONFLICT),
    NAME_INVALID(DomainViolationCategory.INVALID),
    NAME_CONFLICT(DomainViolationCategory.CONFLICT),
    USER_NOT_FOUND(DomainViolationCategory.NOT_FOUND);

    private final DomainViolationCategory category;
    DomainViolation(final DomainViolationCategory category) {
        this.category = category;
    }

    public DomainViolationCategory category() {
        return this.category;
    }
}

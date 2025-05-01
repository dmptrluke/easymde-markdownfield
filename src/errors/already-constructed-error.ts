export class AlreadyConstructedError extends Error {
    public constructor() {
        super("EasyMDE is already initialized.");
        this.name = "AlreadyConstructedError";
    }
}

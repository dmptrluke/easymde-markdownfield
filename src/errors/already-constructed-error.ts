export class AlreadyConstructedError extends Error {
    constructor() {
        super("EasyMDE is already initialized.");
        this.name = "AlreadyConstructedError";
    }
}

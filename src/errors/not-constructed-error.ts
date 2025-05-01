export class NotConstructedError extends Error {
    public constructor() {
        super(
            'EasyMDE is not initialized, run the "construct()" method to do so.',
        );
        this.name = "NotConstructedError";
    }
}

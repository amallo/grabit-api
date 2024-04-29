type ErrCause = {cause: unknown}
export class Err extends Error{
    private _cause?: unknown
    constructor(message: string, causedBy?: ErrCause){
        super(message)
        this._cause = causedBy?.cause
    }
    get cause() {
        return this._cause
    }
    static NotFound(message: string){
        return new Err(message)
    }
}
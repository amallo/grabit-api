export class Err extends Error{
    private _cause: unknown
    constructor(message: string, {cause}: {cause: unknown}){
        super(message)
        this._cause = cause
    }
    get cause() {
        return this._cause
    }
}
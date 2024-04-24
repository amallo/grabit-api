export class FakeDateProvider{
    private _now!: string
    nowIs(now: Date){
        this._now = now.toISOString()
    }
}
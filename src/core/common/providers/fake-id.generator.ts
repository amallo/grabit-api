import { IdGenerator } from "./id.generator";

export class FakeIdGenerator implements IdGenerator{
    _willGenerateId!: string
    generate(): string {
        return this._willGenerateId
    }
    
}
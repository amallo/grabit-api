import N from "nanoid";
import { IdGenerator } from "./id.generator";

export class NanoIdGenerator implements IdGenerator{
    generate(): string {
        return N.nanoid()
    }

}
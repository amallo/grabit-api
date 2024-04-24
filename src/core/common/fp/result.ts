import { Either } from "fp-ts/lib/Either";
import { Err } from "../errors/err";

export type Result<T> = Either<Err, T>;

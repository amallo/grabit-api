import { AnonymousMessage } from "../../../models/message.model";
import { MessageRepository } from "../../message.repository";

export class FailureMessageRepository implements MessageRepository{
    constructor(private error: Error){}
    retrieve(_: string): Promise<AnonymousMessage | null> {
        throw this.error
    }
    dropAnonymous(_: AnonymousMessage): Promise<void>{
        throw this.error
    }
}
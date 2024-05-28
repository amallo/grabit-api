import { Message } from "../../../models/message.model";
import { MessageRepository } from "../../message.repository";

export class FailureMessageRepository implements MessageRepository{
    constructor(private error: Error){}
    retrieve(_: string): Promise<Message | null> {
        throw this.error
    }
    drop(_: Message): Promise<void>{
        throw this.error
    }
}
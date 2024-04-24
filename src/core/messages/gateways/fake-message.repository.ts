import { AnonymousMessage } from "../models/message.model";
import { MessageRepository } from "./message.repository";

export class FakeMessageRepository implements MessageRepository{
    retrieve(messageId: string): Promise<AnonymousMessage | null> {
        throw new Error("Method not implemented.");
    }
    private _anonymouslyDroppedWith!: AnonymousMessage
    dropAnonymous(message: AnonymousMessage): Promise<void>{
        this._anonymouslyDroppedWith = message
        return Promise.resolve()
    }
    wasAnonymouslyDroppedWith(){
        return this._anonymouslyDroppedWith
    }
}
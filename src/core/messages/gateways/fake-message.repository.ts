import { AnonymousMessage } from "../models/message.model";
import { MessageRepository } from "./message.repository";

export class FakeMessageRepository implements MessageRepository{
    private _messages: Record<string, AnonymousMessage> = {}
    retrieve(messageId: string): Promise<AnonymousMessage | null> {
        return Promise.resolve(this._messages[messageId])
    }
    private _anonymouslyDroppedWith!: AnonymousMessage
    dropAnonymous(message: AnonymousMessage): Promise<void>{
        this._anonymouslyDroppedWith = message
        return Promise.resolve()
    }
    wasAnonymouslyDroppedWith(){
        return this._anonymouslyDroppedWith
    }
    withMessage(message: AnonymousMessage){
        this._messages[message.id] = message
    }
}
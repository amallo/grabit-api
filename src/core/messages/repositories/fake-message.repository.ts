import { AnonymousMessage } from "../models/message.model";
import { MessageRepository } from "./message.repository";

export class FakeMessageRepository implements MessageRepository{
    private _anonymouslyDroppedWith!: AnonymousMessage
    dropAnonymous(message: AnonymousMessage): Promise<void>{
        this._anonymouslyDroppedWith = message
        return Promise.resolve()
    }
    wasAnonymouslyDroppedWith(){
        return this._anonymouslyDroppedWith
    }
}
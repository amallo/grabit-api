import { Message } from "../../../models/message.model";
import { MessageRepository } from "../../message.repository";

export class FakeMessageRepository implements MessageRepository{
    private _messages: Record<string, Message> = {}
    grab(messageId: string): Promise<Message | null> {
        return Promise.resolve(this._messages[messageId])
    }
    private _anonymouslyDroppedWith!: Message
    drop(message: Message): Promise<void>{
        this._anonymouslyDroppedWith = message
        return Promise.resolve()
    }
    wasAnonymouslyDroppedWith(){
        return this._anonymouslyDroppedWith
    }
    withMessage(message: Message){
        this._messages[message.id] = message
    }
}
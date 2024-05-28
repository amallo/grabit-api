import { Message } from "../models/message.model";

export interface MessageRepository{
    drop(message: Message): Promise<void>
    retrieve(messageId: string): Promise<Message | null>
}
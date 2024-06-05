import { Message } from "../models/message.model";

export interface MessageRepository{
    drop(message: Message): Promise<void>
    grab(messageId: string): Promise<Message | null>
}
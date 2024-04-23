import { AnonymousMessage } from "../models/message.model";

export interface MessageRepository{
    dropAnonymous(message: AnonymousMessage): Promise<void>
}
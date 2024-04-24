import { Low } from "lowdb/lib";
import { AnonymousMessage } from "../models/message.model";
import { MessageRepository } from "./message.repository";
import { JSONFilePreset } from 'lowdb/node'
import { LowDbMessageRepository } from "./low-db-message.repository";
import openpgp from 'openpgp'

export class OpenPgpMessageRepository implements MessageRepository{
    constructor(private messageRepository: LowDbMessageRepository, private password: string){}
    async retrieve(messageId: string): Promise<AnonymousMessage | null> {
        return this.messageRepository.retrieve(messageId)
    }
    async dropAnonymous(message: AnonymousMessage): Promise<void> {
        return this.messageRepository.dropAnonymous(message)
    }
}
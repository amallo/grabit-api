import { Message } from "../../models/message.model";
import { MessageRepository } from "../message.repository";
import * as openpgp from 'openpgp';

export class EncryptMessageRepository implements MessageRepository{
    constructor(private messageRepository: MessageRepository, private password: string){}
    async drop(message: Message): Promise<void> {
        const encryptedContent = await openpgp.createMessage({ text: message.content });
        const encrypted = await openpgp.encrypt({
            message: encryptedContent, 
            passwords: [this.password],  
        }) as string; 
        
        const encryptedMessage : Message = {
            at: message.at,
            content: encrypted,
            id: message.id,
            type: message.type
        }
        return this.messageRepository.drop(encryptedMessage)
    }
    async retrieve(messageId: string): Promise<Message | null> {
        const withEncryptedContentMessage = await  this.messageRepository.retrieve(messageId)
        if (!withEncryptedContentMessage) return null
        const encryptedContent = await openpgp.readMessage({
            armoredMessage: withEncryptedContentMessage.content
        });
        if (!encryptedContent) return null
        const { data: decrypted } = await openpgp.decrypt({
            message: encryptedContent,
            passwords: [this.password],
        });
        if (!decrypted) return null
        return {
            at: withEncryptedContentMessage.at,
            id: withEncryptedContentMessage.id,
            content: decrypted.toString(),
            type: withEncryptedContentMessage.type
        }
       
    }
    
}
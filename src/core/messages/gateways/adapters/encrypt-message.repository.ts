import { AnonymousMessage } from "../../models/message.model";
import { MessageRepository } from "../message.repository";
import * as openpgp from 'openpgp';

export class EncryptMessageRepository implements MessageRepository{
    constructor(private messageRepository: MessageRepository, private password: string){}
    async dropAnonymous(message: AnonymousMessage): Promise<void> {
        const encryptedContent = await openpgp.createMessage({ text: message.content });
        const encrypted = await openpgp.encrypt({
            message: encryptedContent, 
            passwords: [this.password], 
        });
        
        const encryptedMessage : AnonymousMessage = {
            at: message.at,
            content: JSON.stringify(encrypted),
            id: message.id
        }
        return this.messageRepository.dropAnonymous(encryptedMessage)

    }
    async retrieve(messageId: string): Promise<AnonymousMessage | null> {
        const withEncryptedContentMessage = await  this.messageRepository.retrieve(messageId)
        if (!withEncryptedContentMessage) return null
        const encryptedContent = await openpgp.readMessage({
            armoredMessage: JSON.parse(withEncryptedContentMessage.content)
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
            content: decrypted.toString()
        }
       
    }
    
}
import { Message } from "../../../models/message.model";
import { MessageRepository } from "../../message.repository";
import {Database, aql} from 'arangojs'


export class ArangoDbMessageRepository implements MessageRepository{
    constructor(private db: Database){}
    async drop(message: Message): Promise<void> {
        const Messages = this.db.collection("messages")
        
        await Messages.save(message)
    }
    async retrieve(messageId: string): Promise<Message | null> {
        const Messages = this.db.collection("messages");
        const messageCursor = await this.db.query(aql`
            FOR message IN ${Messages}
            FILTER message.id == ${messageId}
            RETURN message`
        );
        if (messageCursor.hasNext){
            const messageDoc =  await messageCursor.next()
            return {id: messageDoc.id, at: messageDoc.at, content: messageDoc.content, type: messageDoc.type}
        }
        return null
    }
    
}
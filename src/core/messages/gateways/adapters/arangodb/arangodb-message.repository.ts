import { AnonymousMessage } from "../../../models/message.model";
import { MessageRepository } from "../../message.repository";
import {Database, aql} from 'arangojs'


export class ArangoDbMessageRepository implements MessageRepository{
    constructor(private db: Database){}
    async dropAnonymous(message: AnonymousMessage): Promise<void> {
        const Messages = this.db.collection("messages")
        
        await Messages.save(message)
    }
    async retrieve(messageId: string): Promise<AnonymousMessage | null> {
        const Messages = this.db.collection("messages");
        const messageCursor = await this.db.query(aql`
            FOR message IN ${Messages}
            FILTER message.id == ${messageId}
            RETURN message`
        );
        if (messageCursor.hasNext){
            const messageDoc =  await messageCursor.next()
            return {id: messageDoc.id, at: messageDoc.at, content: messageDoc.content}
        }
        return null
    }
    
}
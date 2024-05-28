import { Message } from "../../../models/message.model";
import { MessageRepository } from "../../message.repository";
import {Database, aql} from 'arangojs'
import { DeliverOptions, ReceiptRepository } from "../../receipt.repository";
import { Receipt } from "../../../models/receipt.model";
import { IdGenerator } from "../../../../common/providers/id.generator";



export class ArangoDbReceiptRepository implements ReceiptRepository{
    constructor(private db: Database, private receiptIdGenerator: IdGenerator){}
    async deliver(messageId: string, options: DeliverOptions): Promise<Receipt> {
        const newId = this.receiptIdGenerator.generate()
        const receipt: Receipt = {
            id: newId,
            messageId,
            validUntil: options.expiresAt
        }
        await this.db.collection("receipts").save({
            ...receipt,
            _key: newId
        })
        return receipt
    }
    async retrieve(receiptId: string): Promise<Receipt> {
        const Receipts = this.db.collection("receipts");
        
        const receiptCursor = await this.db.query(aql`
        FOR receipt IN ${Receipts}
        FILTER receipt.id == ${receiptId}
        RETURN receipt
        `);
        if (receiptCursor.hasNext){
            const receiptDoc =  await receiptCursor.next()
            return {
                id: receiptDoc.id,
                messageId: receiptDoc.messageId,
                validUntil: receiptDoc.validUntil
            }
        }
        throw new Error()
    }
    
    
}
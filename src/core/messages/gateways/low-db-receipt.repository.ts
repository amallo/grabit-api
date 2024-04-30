
import { DeliverOptions, ReceiptRepository } from "./receipt.repository";
import { Receipt } from "../models/receipt.model";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { IdGenerator } from "../../common/providers/id.generator";
type MessageId = string
type Data = {
    receipts: Record<MessageId, string>
}



export class LowDbReceiptRepository implements ReceiptRepository{
    dbReceipts!: Low<Data>
    constructor(private idGenerator: IdGenerator){
        this.dbReceipts = new Low(new JSONFile("receipts.json"),  {receipts: {}})
    }
    retrieve(receiptId: string): Promise<Receipt> {
        throw new Error("Method not implemented.");
    }
    async deliver(messageId: string, options: DeliverOptions): Promise<Receipt> {
        const receiptId = this.idGenerator.generate()
        this.dbReceipts.data.receipts[messageId] = receiptId
        await this.dbReceipts.write()
        return {
            id: receiptId,
            validUntil: options.expiresAt,
            messageId
        }
    }
    
}

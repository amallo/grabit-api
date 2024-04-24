import { Receipt } from "../models/receipt.model";
import {  DeliverOptions, ReceiptRepository } from "./receipt.repository";

type ReceiptId = string
export class FakeReceiptRepository implements ReceiptRepository{
    private _deliveredReceipts: Record<string, ReceiptId> = {}
    
    willDeliverReceipt(messageId: string, receiptId: string){
        this._deliveredReceipts[messageId] = receiptId
    }
    deliver(messageId: string, options: DeliverOptions): Promise<Receipt>{
        if (!this._deliveredReceipts[messageId]) throw "cannot deliver message"
        return Promise.resolve({
            id: this._deliveredReceipts[messageId],
            validUntil: options.expiresAt
        })
    }
}
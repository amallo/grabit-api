import { Receipt } from "../models/receipt.model";
import {  DeliverOptions, ReceiptRepository } from "./receipt.repository";

type ReceiptId = string
export class FakeReceiptRepository implements ReceiptRepository{
    private _receiptsByMessage: Record<string, ReceiptId> = {}
    private _receiptsById: Record<string, Receipt> = {}
    
    willDeliverReceipt(messageId: string, receiptId: string){
        this._receiptsByMessage[messageId] = receiptId
    }
    wasDeliveredReceipt(receipt: Receipt){
        this._receiptsById[receipt.id] = receipt
    }
    deliver(messageId: string, options: DeliverOptions): Promise<Receipt>{
        if (!this._receiptsByMessage[messageId]) throw "cannot deliver message"
        return Promise.resolve({
            id: this._receiptsByMessage[messageId],
            validUntil: options.expiresAt,
            messageId
        })
    }
    retrieve(receiptId: string): Promise<Receipt> {
        return Promise.resolve(this._receiptsById[receiptId])
    }
}
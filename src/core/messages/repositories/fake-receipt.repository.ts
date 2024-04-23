import { Receipt } from "../models/receipt.model";
import {  ReceiptRepository } from "./receipt.repository";


export class FakeReceiptRepository implements ReceiptRepository{
    private _deliveredReceipts: Record<string, Receipt> = {}
    willDeliverReceipt(messageId: string, receipt: Receipt){
        this._deliveredReceipts[messageId] = receipt
    }
    deliver(messageId: string): Promise<Receipt>{
        if (!this._deliveredReceipts[messageId]) throw "cannot deliver message"
        return Promise.resolve(this._deliveredReceipts[messageId])
    }
}
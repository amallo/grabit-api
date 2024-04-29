import { Receipt } from "../models/receipt.model";
import {  ReceiptRepository } from "./receipt.repository";


export class FailureReceiptRepository implements ReceiptRepository{
    constructor(private error: Error){}
    retrieve(_: string): Promise<Receipt> {
        throw this.error
    }
    deliver(messageId: string): Promise<Receipt>{
        throw this.error
    }
}
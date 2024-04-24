import { Receipt } from "../models/receipt.model";
import {  ReceiptRepository } from "./receipt.repository";


export class FailureReceiptRepository implements ReceiptRepository{
    constructor(private error: Error){}
    deliver(messageId: string): Promise<Receipt>{
        throw this.error
    }
}
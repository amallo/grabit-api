import { Receipt } from "../models/receipt.model"


export interface ReceiptRepository{
    deliver(messageId: string): Promise<Receipt>
}
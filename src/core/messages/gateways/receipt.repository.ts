import { Receipt } from "../models/receipt.model"

export type DeliverOptions = {
    expiresAt: string
}
export interface ReceiptRepository{
    deliver(messageId: string, options: DeliverOptions): Promise<Receipt>
}
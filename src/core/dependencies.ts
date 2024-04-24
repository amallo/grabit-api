import { MessageRepository } from "./messages/gateways/message.repository";
import { ReceiptRepository } from "./messages/gateways/receipt.repository";
import { UrlGenerator } from "./messages/gateways/url-generator";

export interface Dependencies {
    messageRepository: MessageRepository, 
    receiptRepository: ReceiptRepository, 
    receiptUrlGenerator: UrlGenerator
}

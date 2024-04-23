
import { AnonymousMessage } from "./models/message.model";
import { MessageRepository } from "./repositories/message.repository";
import { ReceiptRepository } from "./repositories/receipt.repository";

export type DropAnonymousTextMessageResponse = {
    receipt: string
    validUntil: string
}

export const createDropAnonymousTextMessage = (
    {messageRepository, receiptRepository}: {messageRepository: MessageRepository, receiptRepository: ReceiptRepository})=>
        async ({content, at, messageId}: {content: string, at: string, messageId: string}): Promise<DropAnonymousTextMessageResponse>=>{
            const message : AnonymousMessage = {
                at,
                content,
                id: messageId
            }
            await messageRepository.dropAnonymous(message)
            const receipt = await receiptRepository.deliver(message.id)
            return {
                receipt: receipt.id,
                validUntil: receipt.validUntil
            }
}
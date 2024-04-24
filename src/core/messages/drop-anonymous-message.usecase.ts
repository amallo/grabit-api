
import { AnonymousMessage } from "./models/message.model";
import { FakeReceiptLinkGenerator } from "./repositories/fake-link.generator";
import { MessageRepository } from "./repositories/message.repository";
import { ReceiptRepository } from "./repositories/receipt.repository";

export type DropAnonymousTextMessageResponse = {
    receipt: string
    validUntil: string
}

export const createDropAnonymousTextMessage = (
    {messageRepository, receiptRepository, receiptLinkGenerator}: {messageRepository: MessageRepository, receiptRepository: ReceiptRepository, receiptLinkGenerator: FakeReceiptLinkGenerator})=>
        async ({content, at, messageId}: {content: string, at: string, messageId: string}): Promise<DropAnonymousTextMessageResponse>=>{
            const message : AnonymousMessage = {
                at,
                content,
                id: messageId
            }
            await messageRepository.dropAnonymous(message)
            const receipt = await receiptRepository.deliver(message.id)
            const receiptLink = receiptLinkGenerator.generate(receipt.id)
            return {
                receipt: receiptLink,
                validUntil: receipt.validUntil
            }
}
import { expect } from "vitest"
import { DropAnonymousTextMessageResponse, createDropAnonymousTextMessage } from "../drop-anonymous-message.usecase"
import { FakeMessageRepository } from "../repositories/fake-message.repository"
import { FakeReceiptRepository } from "../repositories/fake-receipt.repository"
import { Receipt } from "../models/receipt.model"
import { AnonymousMessage } from "../models/message.model"
import { FakeReceiptLinkGenerator } from "../repositories/fake-link.generator"

export const createMessageFixture = ()=>{
    const receiptRepository = new FakeReceiptRepository()
    const messageRepository = new FakeMessageRepository()
    const receiptLinkGenerator = new FakeReceiptLinkGenerator()
    const useCase = createDropAnonymousTextMessage({messageRepository, receiptRepository, receiptLinkGenerator})
    let response: DropAnonymousTextMessageResponse
    return {
        givenMessageDelivery(messageId: string, receipt: Receipt){
            receiptRepository.willDeliverReceipt(messageId, receipt)
        },
        givenReceiptLinkPrefix(prefix: string){
            receiptLinkGenerator.willGenerateWithPrefix(prefix)
        },
        async whenDroppingAnonymousMessage(params: {content: string, at: string, messageId: string}){
            response = await useCase(params)
        },
        thenDroppedMessageShouldDeliveredWith(expected: DropAnonymousTextMessageResponse ){
            expect(response).toEqual(expected)
        },
        thenAnonymousMessageWasDropped(message: AnonymousMessage){
            expect(messageRepository.wasAnonymouslyDroppedWith()).toEqual(message)
        }
    }
}
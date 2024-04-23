import { expect } from "vitest"
import { DropAnonymousTextMessageResponse, createDropAnonymousTextMessage } from "../drop-anonymous-message.usecase"
import { FakeMessageRepository } from "../repositories/fake-message.repository"
import { FakeReceiptRepository } from "../repositories/fake-receipt.repository"
import { Receipt } from "../models/receipt.model"
import { AnonymousMessage } from "../models/message.model"

export const createMessageFixture = ()=>{
    const receiptRepository = new FakeReceiptRepository()
    const messageRepository = new FakeMessageRepository()
    const useCase = createDropAnonymousTextMessage({messageRepository, receiptRepository})
    let response: DropAnonymousTextMessageResponse
    return {
        givenMessageDelivery(messageId: string, receipt: Receipt){
            receiptRepository.willDeliverReceipt(messageId, receipt)
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
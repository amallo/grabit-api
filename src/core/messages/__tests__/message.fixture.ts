import { expect } from "vitest"
import { DropAnonymousTextMessageResponse, Result, createDropAnonymousTextMessage } from "../drop-anonymous-message.usecase"
import { FakeMessageRepository } from "../repositories/fake-message.repository"
import { FakeReceiptRepository } from "../repositories/fake-receipt.repository"
import { Receipt } from "../models/receipt.model"
import { AnonymousMessage } from "../models/message.model"
import { FakeReceiptUrlGenerator } from "../repositories/fake-url.generator"
import { FailureMessageRepository } from "../repositories/failure-message.repository"
import { isLeft, isRight, left, right } from "fp-ts/lib/Either"

export const createMessageFixture = ()=>{
    const receiptRepository = new FakeReceiptRepository()
    const messageRepository = new FakeMessageRepository()
    const receiptLinkGenerator = new FakeReceiptUrlGenerator()
    let useCase = createDropAnonymousTextMessage({messageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
    let result: Result<DropAnonymousTextMessageResponse>
    return {
        givenMessageDelivery(messageId: string, receipt: Receipt){
            receiptRepository.willDeliverReceipt(messageId, receipt)
        },
        givenReceiptLinkPrefix(prefix: string){
            receiptLinkGenerator.willGenerateWithPrefix(prefix)
        },
        async whenDroppingAnonymousMessage(params: {content: string, at: string, messageId: string}, withError?: Error){
            if (withError){
                const failureMessageRepository = new FailureMessageRepository(withError)
                useCase = createDropAnonymousTextMessage({messageRepository: failureMessageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
            }
            result = await useCase(params)
        },
        thenDroppedMessageShouldDeliveredWith(expected: DropAnonymousTextMessageResponse ){
            expect(isRight(result))
            if (isRight(result))
                expect(result.right).toEqual(expected)
        },
        thenAnonymousMessageWasDropped(message: AnonymousMessage){
            expect(messageRepository.wasAnonymouslyDroppedWith()).toEqual(message)
        },
        thenDropMessageErrorShouldEqual(error: Error){
            expect(isLeft(result))
            if (isLeft(result))
                expect(result.left).toEqual(error)
        }
    }
}
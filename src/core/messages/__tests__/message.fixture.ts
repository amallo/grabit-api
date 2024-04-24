import { expect } from "vitest"
import { DropAnonymousTextMessageRequest, DropAnonymousTextMessageResponse, createDropAnonymousTextMessage } from "../drop-anonymous-message.usecase"
import { FakeMessageRepository } from "../repositories/fake-message.repository"
import { FakeReceiptRepository } from "../repositories/fake-receipt.repository"
import { Receipt } from "../models/receipt.model"
import { AnonymousMessage } from "../models/message.model"
import { FakeReceiptUrlGenerator } from "../repositories/fake-url.generator"
import { FailureMessageRepository } from "../repositories/failure-message.repository"
import { isLeft, isRight } from "fp-ts/lib/Either"
import { Result } from "../../common/fp/result"
import { FailureReceiptRepository } from "../repositories/failure-receipt.repository"

export const createMessageFixture = ()=>{
    const receiptRepository = new FakeReceiptRepository()
    const messageRepository = new FakeMessageRepository()
    const receiptLinkGenerator = new FakeReceiptUrlGenerator()
    let useCase = createDropAnonymousTextMessage({messageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
    let result: Result<DropAnonymousTextMessageResponse>
    return {
        givenWillGenerateReceipt(receiptId: string, forMessageId: string){
            receiptRepository.willDeliverReceipt(forMessageId, receiptId)
        },
        givenReceiptLinkPrefix(prefix: string){
            receiptLinkGenerator.willGenerateWithPrefix(prefix)
        },
        async whenDroppingAnonymousMessage(params: DropAnonymousTextMessageRequest, errors: {dropFailure?: Error, receiptFailure?: Error} = {}){
            if (errors.dropFailure){
                const failureMessageRepository = new FailureMessageRepository(errors.dropFailure)
                useCase = createDropAnonymousTextMessage({messageRepository: failureMessageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
            }
            if (errors.receiptFailure){
                const failureReceiptRepository = new FailureReceiptRepository(errors.receiptFailure)
                useCase = createDropAnonymousTextMessage({messageRepository, receiptRepository: failureReceiptRepository, receiptUrlGenerator: receiptLinkGenerator})                
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
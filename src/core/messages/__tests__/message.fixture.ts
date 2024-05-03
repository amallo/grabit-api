import { expect } from "vitest"
import { DropAnonymousTextMessageRequest, DropAnonymousTextMessageResponse, createDropAnonymousTextMessage } from "../drop-anonymous-message.usecase"
import { FakeMessageRepository } from "../gateways/adapters/test/fake-message.repository"
import { FakeReceiptRepository } from "../gateways/adapters/test/fake-receipt.repository"
import { Receipt } from "../models/receipt.model"
import { AnonymousMessage } from "../models/message.model"
import { FakeReceiptUrlGenerator } from "../gateways/adapters/test/fake-url.generator"
import { FailureMessageRepository } from "../gateways/adapters/test/failure-message.repository"
import { isLeft, isRight } from "fp-ts/lib/Either"
import { Result } from "../../common/fp/result"
import { FailureReceiptRepository } from "../gateways/adapters/test/failure-receipt.repository"
import { GrabMessageResponse, createGrabMessage } from "../grab-message.usecase"
import { Err } from "../../common/errors/err"

export const createMessageFixture = ()=>{
    const receiptRepository = new FakeReceiptRepository()
    const messageRepository = new FakeMessageRepository()
    const receiptLinkGenerator = new FakeReceiptUrlGenerator()
    let dropUseCase = createDropAnonymousTextMessage({messageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
    let dropResult: Result<DropAnonymousTextMessageResponse>

    let grabUseCase = createGrabMessage({messageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
    let grabResult : Result<GrabMessageResponse>
    return {
        givenWillDeliverReceipt(receiptId: string, forMessageId: string){
            receiptRepository.willDeliverReceipt(forMessageId, receiptId)
        },
        givenDeliveredReceipt(receipt: Receipt){
            receiptRepository.wasDeliveredReceipt(receipt)
        },
        givenReceiptLinkPrefix(prefix: string){
            receiptLinkGenerator.willGenerateWithPrefix(prefix)
        },
        givenDroppedMessage(message: AnonymousMessage){
            messageRepository.withMessage(message)
        },
        async whenDroppingAnonymousMessage(params: DropAnonymousTextMessageRequest, errors: {dropFailure?: Error, receiptFailure?: Error} = {}){
            if (errors.dropFailure){
                const failureMessageRepository = new FailureMessageRepository(errors.dropFailure)
                dropUseCase = createDropAnonymousTextMessage({messageRepository: failureMessageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
            }
            if (errors.receiptFailure){
                const failureReceiptRepository = new FailureReceiptRepository(errors.receiptFailure)
                dropUseCase = createDropAnonymousTextMessage({messageRepository, receiptRepository: failureReceiptRepository, receiptUrlGenerator: receiptLinkGenerator})                
            }
            dropResult = await dropUseCase(params)
        },
        async whenGrabbingMessage(receipt: string){
            grabResult = await grabUseCase(receipt)
        },
        async whenGrabbingMessageWithMissingReceipt(receipt: string, error: Error){
            const failureReceiptRepository = new FailureReceiptRepository(error)
            grabUseCase = createGrabMessage({messageRepository, receiptRepository: failureReceiptRepository, receiptUrlGenerator: receiptLinkGenerator})
            grabResult = await grabUseCase(receipt)
        },
        async whenGrabbingMessageWithMissingMessage(receipt: string, error: Error){
            const failureMessageRepository = new FailureMessageRepository(error)
            grabUseCase = createGrabMessage({messageRepository: failureMessageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
            grabResult = await grabUseCase(receipt)
        },
        thenDroppedMessageShouldDeliveredWith(expected: DropAnonymousTextMessageResponse ){
            expect(isRight(dropResult))
            if (isRight(dropResult))
                expect(dropResult.right).toEqual(expected)
        },
        thenAnonymousMessageWasDroppedWithParams(message: AnonymousMessage){
            expect(messageRepository.wasAnonymouslyDroppedWith()).toEqual(message)
        },
        thenDropMessageErrorShouldEqual(error: Error){
            expect(isLeft(dropResult))
            if (isLeft(dropResult))
                expect(dropResult.left).toEqual(error)
        },
        thenGrabMessageErrorShouldEqual(error: Err){
            expect(isLeft(grabResult))
            if (isLeft(grabResult))
                expect(grabResult.left).toEqual(error)
        },
        thenAnonymousMessageWasGrabbed(expected: {content: string}){
            expect(isRight(grabResult))
            if (isRight(grabResult))
                expect(grabResult.right).toEqual(expected)
        },
    }
}
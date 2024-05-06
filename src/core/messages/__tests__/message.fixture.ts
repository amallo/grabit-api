import { expect } from "vitest"
import { DropAnonymousTextMessageRequest, createDropAnonymousTextMessage } from "../drop-anonymous-message.usecase"
import { FakeMessageRepository } from "../gateways/adapters/test/fake-message.repository"
import { FakeReceiptRepository } from "../gateways/adapters/test/fake-receipt.repository"
import { Receipt } from "../models/receipt.model"
import { AnonymousMessage } from "../models/message.model"
import { FakeReceiptUrlGenerator } from "../gateways/adapters/test/fake-url.generator"
import { FailureMessageRepository } from "../gateways/adapters/test/failure-message.repository"
import { isLeft, isRight } from "fp-ts/lib/Either"
import { Result } from "../../common/fp/result"
import { FailureReceiptRepository } from "../gateways/adapters/test/failure-receipt.repository"
import { createGrabMessage } from "../grab-message.usecase"
import { Err } from "../../common/errors/err"

export const createMessageFixture = ()=>{
    const receiptRepository = new FakeReceiptRepository()
    const messageRepository = new FakeMessageRepository()
    const receiptLinkGenerator = new FakeReceiptUrlGenerator()
    let dropUseCase = createDropAnonymousTextMessage({messageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
    let grabUseCase = createGrabMessage({messageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
    return {
        givenWillDeliverReceipt(receiptId: string, forMessageId: string){
            receiptRepository.willDeliverReceipt(forMessageId, receiptId)
        },
        givenDeliveredReceipt(receipt: Receipt){
            receiptRepository.wasDeliveredReceipt(receipt)
        },
        givenWillGenerateReceiptLinkPrefix(prefix: string){
            receiptLinkGenerator.willGenerateWithPrefix(prefix)
        },
        givenDroppedMessage(message: AnonymousMessage){
            messageRepository.withMessage(message)
        },
        whenDroppingAnonymousMessage(params: DropAnonymousTextMessageRequest, errors: {dropFailure?: Error, receiptFailure?: Error} = {}){
            if (errors.dropFailure){
                const failureMessageRepository = new FailureMessageRepository(errors.dropFailure)
                dropUseCase = createDropAnonymousTextMessage({messageRepository: failureMessageRepository, receiptRepository, receiptUrlGenerator: receiptLinkGenerator})
            }
            if (errors.receiptFailure){
                const failureReceiptRepository = new FailureReceiptRepository(errors.receiptFailure)
                dropUseCase = createDropAnonymousTextMessage({messageRepository, receiptRepository: failureReceiptRepository, receiptUrlGenerator: receiptLinkGenerator})                
            }
            return dropUseCase(params)
        },
        async whenGrabbingMessage(receipt: string){
            return grabUseCase(receipt)
        },
        thenResult<T>(result: Result<T>){
            return {
                shouldEqual(expected: T){
                    expect(isRight(result))
                    if (isRight(result))
                        expect(result.right).toEqual(expected)
                },
                shouldFailWith(err: Err){
                    expect(isLeft(result))
                    if (isLeft(result))
                        expect(result.left).toEqual(err)
                }
            }
        },
        thenAnonymousMessageWasDroppedWithParams(message: AnonymousMessage){
            expect(messageRepository.wasAnonymouslyDroppedWith()).toEqual(message)
        },
        
    }
}
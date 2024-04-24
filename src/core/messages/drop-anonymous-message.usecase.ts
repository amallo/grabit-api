
import { Either, right, left } from "fp-ts/lib/Either";
import { AnonymousMessage } from "./models/message.model";
import { FakeReceiptUrlGenerator } from "./repositories/fake-url.generator";
import { MessageRepository } from "./repositories/message.repository";
import { ReceiptRepository } from "./repositories/receipt.repository";
import { Err } from "../common/errors/err";
import { Result } from "../common/fp/result";
import { FakeDateProvider } from "../common/providers/fake-date.provider";

export type DropAnonymousTextMessageResponse = {
    receipt: string
    validUntil: string
}
type MessageHoursExpiration = {
    hours: number
}
type MessageExpiration = MessageHoursExpiration
export type DropAnonymousTextMessageRequest = {
    content: string, 
    at: string, 
    messageId: string,
    expiresIn : MessageExpiration
}

export const createDropAnonymousTextMessage = (
    {messageRepository, receiptRepository, receiptUrlGenerator}: {
        messageRepository: MessageRepository, 
        receiptRepository: ReceiptRepository, 
        receiptUrlGenerator: FakeReceiptUrlGenerator})=>
        async ({content, at, messageId, expiresIn}: DropAnonymousTextMessageRequest): Promise<Result<DropAnonymousTextMessageResponse>>=>{
            const message : AnonymousMessage = {
                at,
                content,
                id: messageId
            }
            try{

                await messageRepository.dropAnonymous(message)
                const atDate = new Date(at)
                atDate.setHours(atDate.getHours() + expiresIn.hours)
                const expiresAt = atDate.toISOString()
                const receipt = await receiptRepository.deliver(message.id, {expiresAt})
                const receiptUrl = receiptUrlGenerator.generate(receipt.id).toString()
                return right({
                    receipt: receiptUrl,
                    validUntil: receipt.validUntil
                })
            }
            catch(e){
                const err = new Err("DROP_MESSAGE_ERROR", {cause: e as Err})
                return Promise.resolve(left(err))
            }
}
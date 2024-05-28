
import { right, left } from "fp-ts/lib/Either";
import { Err } from "../common/errors/err";
import { Result } from "../common/fp/result";
import { Dependencies } from "../dependencies";

export type GrabMessageResponse = {
    content: string,
    type: string
}

export const createGrabMessage = (
    {messageRepository, receiptRepository}: Dependencies)=>
        async (receiptId: string): Promise<Result<GrabMessageResponse>>=>{
            try{
                const receipt = await receiptRepository.retrieve(receiptId)
                if (!receipt){
                    throw Err.NotFound("receipt not found")
                }
                console.info('found receipt id', receiptId)
                const message = await messageRepository.retrieve(receipt.messageId)
                if (!message){
                    throw Err.NotFound("message not found")
                }
                console.info('found message', message.id)
                return Promise.resolve(right({
                    content: message.content,
                    type: message.type
                }))
            }
            catch(e){
                console.error(e)
                const err = new Err("GRAB_MESSAGE_ERROR", {cause: e})
                return left(err)
            }
        }
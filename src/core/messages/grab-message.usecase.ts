
import { right, left } from "fp-ts/lib/Either";
import { Err } from "../common/errors/err";
import { Result } from "../common/fp/result";
import { Dependencies } from "../dependencies";

export type GrabMessageResponse = {
    content: string
}

export const createGrabMessage = (
    {messageRepository, receiptRepository}: Dependencies)=>
        async (receiptId: string): Promise<Result<GrabMessageResponse>>=>{
            try{
                const receipt = await receiptRepository.retrieve(receiptId)
                if (!receipt){
                    throw Err.NotFound("receipt not found")
                }
                const message = await messageRepository.retrieve(receipt.messageId)
                if (!message){
                    throw Err.NotFound("message not found")
                }
                return Promise.resolve(right({
                    content: message?.content as string
                }))
            }
            catch(e){
                const err = new Err("GRAB_MESSAGE_ERROR", {cause: e})
                return left(err)
            }
        }
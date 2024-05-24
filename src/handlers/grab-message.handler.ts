import {  Next, Request, Response } from "restify";
import { ApiCore } from "../core/dependencies";
import { isRight } from "fp-ts/lib/Either";
import Joi from 'joi'
import { createValidator } from "./validator.middleware";

const schema = Joi.object({
    receiptId: Joi.string()
      .min(1)
      .required()
})
export const GrabMessageValidator = createValidator(schema)

export const createGrabMessageHandler = (core: ApiCore)=>async (req: Request, res: Response) =>{
    const result = await core.grab(req.params.receiptId)
    if (isRight(result)){
        res.json(200, result.right)
        return;
    }
    res.json(500, result.left)
}
import {  Next, Request, Response } from "restify";
import { ApiCore } from "../core/dependencies";
import { isRight } from "fp-ts/lib/Either";
import Joi from 'joi'
import { createValidator } from "./validator.middleware";

const schema = Joi.object({
    content: Joi.string()
      .alphanum()
      .min(1)
      .required(),
    at: Joi.date().iso().required(),
    messageId: Joi.string().min(10).required()  
})
export const DropAnonymousValidator = createValidator(schema)

export const createDropAnonymousHandler = (core: ApiCore)=>async (req: Request, res: Response) =>{
    const result = await core.dropAnonymous({
        content: req.body.content,
        at: req.body.at,
        messageId: req.body.messageId,
        expiresIn: {hours: 1}
    })
    if (isRight(result)){
        res.json(200, result.right)
        return;
    }
    res.json(500, result.left)
}
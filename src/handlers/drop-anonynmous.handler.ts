import {  Request, Response } from "restify";
import { ApiCore } from "../core/dependencies";
import { isRight, left, right } from "fp-ts/lib/Either";

export const dropAnonymousHandler = (core: ApiCore)=>async (req: Request, res: Response) =>{
    const result = await core.dropAnonymous({
        content: req.body.content,
        at: req.body.at,
        messageId: req.body.messageId,
        expiresIn: {hours: 1}
    })
    if (isRight(result)){
        res.send(200, result.right)
        return;
    }
    res.send(500, result.left)
}
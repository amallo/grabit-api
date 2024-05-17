import {  Request, Response } from "restify";
import { ApiCore } from "../core/dependencies";
import { isRight } from "fp-ts/lib/Either";

const schema: JSONSchemaType<MyData> = {
    type: "object",
    properties: {
      foo: {type: "integer"},
      bar: {type: "string", nullable: true}
    },
    required: ["foo"],
    additionalProperties: false
  }

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
import {  Next, Request, Response } from "restify";
import { ObjectSchema, StringSchema } from 'joi'
export const validateBody = (schema: ObjectSchema)=>(req: Request, res: Response, next: Next)=>{
  const result = schema.validate(req.body);
  if (result.error) 
    return res.json(400, result.error.details)
  next()
}


export const createValidator = (schema: ObjectSchema | StringSchema)=>{
    return {
        body : (req: Request, res: Response, next: Next)=> {
            const result = schema.validate(req.body);
            if (result.error) 
                return res.json(400, result.error.details)
            next()
        },
        params : (req: Request, res: Response, next: Next)=> {
            const result = schema.validate(req.params);
            if (result.error) 
                return res.json(400, result.error.details)
            next()
        }
    }
}
  
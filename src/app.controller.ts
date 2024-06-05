import { All, Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Res } from '@nestjs/common';
import { DropAnonymousTextMessageResponse, DropMessage, MessageExpiration } from './core/messages/usecases/drop-anonymous-message.usecase';
import { isLeft } from 'fp-ts/lib/Either';
import { Err } from './core/common/errors/err';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { GrabMessage, GrabMessageResponse } from './core/messages/usecases/grab-message.usecase';

class DropTextMessageBody  {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsISO8601()
  at: string

  @IsString()
  @IsNotEmpty()
  messageId: string
}

@Controller('api')
export class AppController {
  constructor(
    @Inject('DROP_MESSAGE') private  readonly dropMessage: DropMessage,
    @Inject('GRAB_MESSAGE') private  readonly grabMessage: GrabMessage
  ) {}

  @Post('drop')
  async drop(
    @Body() request: DropTextMessageBody,
): Promise<DropAnonymousTextMessageResponse | Err> {
    const result =  await this.dropMessage({
      at: request.at,
      content: request.content,
      expiresIn: {hours: 1},
      messageId: request.messageId
    });
    if (isLeft(result)){
      throw new HttpException(result.left, HttpStatus.FORBIDDEN);
    }
    return result.right
  }

  @All('grab/:receiptId')
  async grab(
    @Param()  params: {receiptId: string},
): Promise<GrabMessageResponse | Err> {
    const result =  await this.grabMessage(params.receiptId);
    if (isLeft(result)){
      throw new HttpException(result.left, HttpStatus.FORBIDDEN);
    }
    return result.right
  }
}
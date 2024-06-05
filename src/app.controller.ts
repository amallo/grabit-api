import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { DropAnonymousTextMessageResponse, DropMessage, MessageExpiration } from './core/messages/usecases/drop-anonymous-message.usecase';
import { isLeft } from 'fp-ts/lib/Either';
import { Err } from './core/common/errors/err';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

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
  constructor(@Inject('DROP_MESSAGE') private  readonly dropMessage: DropMessage) {}

  @Post('drop')
  async drop(
    @Body('request') request: DropTextMessageBody,
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
}

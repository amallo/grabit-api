import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Dependencies } from './core/dependencies';
import { FakeMessageRepository } from './core/messages/gateways/adapters/test/fake-message.repository';
import { FakeReceiptRepository } from './core/messages/gateways/adapters/test/fake-receipt.repository';
import { FakeReceiptUrlGenerator } from './core/messages/gateways/adapters/test/fake-url.generator';
import { createDropAnonymousTextMessage } from './core/messages/usecases/drop-anonymous-message.usecase';

describe('AppController', () => {
  let appController: AppController;
  let messageRepository: FakeMessageRepository
  let receiptRepository: FakeReceiptRepository
  let receiptUrlGenerator : FakeReceiptUrlGenerator
  beforeEach(async () => {
    messageRepository =  new FakeMessageRepository()
    receiptRepository = new FakeReceiptRepository()
    receiptUrlGenerator = new FakeReceiptUrlGenerator()
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: "DROP_MESSAGE",
          useFactory: (dependencies : Dependencies)=>{
            return createDropAnonymousTextMessage(dependencies)
          },
          inject: ["DEPENDENCIES"],
        },
        {
        provide: "DEPENDENCIES",
        useFactory: (): Dependencies=>{
          return {
            messageRepository,
            receiptRepository,
            receiptUrlGenerator
          }
        },
      },],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return delivery ticket', async() => {
      receiptRepository.willDeliverReceipt("message-0", "receipt-0")
      receiptUrlGenerator.willGenerateWithPrefix("http://grabit.com")
      expect(await appController.drop({
        at: '2024-06-05T11:36:57.986Z',
        content: 'Hellowwwww !!',
        messageId: 'message-0'
      })).toEqual({
        receipt: 'http://grabit.com/receipt-0',
        validUntil: '2024-06-05T12:36:57.986Z'
      });
    });
  });
});

import { NanoIdGenerator } from "./common/providers/nanoid.generator";
import { createDropAnonymousTextMessage } from "./messages/drop-anonymous-message.usecase";
import { FakeReceiptUrlGenerator } from "./messages/gateways/fake-url.generator";
import { EncryptedLowDbMessageStorage, LowDbMessageRepository, LowDbMessageStorage } from "./messages/gateways/low-db-message.repository";
import { LowDbReceiptRepository } from "./messages/gateways/low-db-receipt.repository";
import { MessageRepository } from "./messages/gateways/message.repository";
import { ReceiptRepository } from "./messages/gateways/receipt.repository";
import { UrlGenerator } from "./messages/gateways/url-generator";

export interface Dependencies {
    messageRepository: MessageRepository, 
    receiptRepository: ReceiptRepository, 
    receiptUrlGenerator: UrlGenerator
}

export const createDependencies = (): Dependencies =>{
    const storage = new EncryptedLowDbMessageStorage("toto", new LowDbMessageStorage())
    const messageRepository = new LowDbMessageRepository(storage)
    const idGenerator = new NanoIdGenerator()
    const receiptRepository = new LowDbReceiptRepository(idGenerator)
    const receiptUrlGenerator = new FakeReceiptUrlGenerator()
    receiptUrlGenerator.willGenerateWithPrefix("http://grabit.com")
    return {
        messageRepository,
        receiptRepository,
        receiptUrlGenerator
    }
}

export const createCore = (dependencies: Dependencies = createDependencies())=>{
    return {
        dropAnonymous: createDropAnonymousTextMessage(dependencies)
    }
}

export type ApiCore = ReturnType<typeof createCore>
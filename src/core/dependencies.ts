import { NanoIdGenerator } from "./common/providers/nanoid.generator";
import { createDropAnonymousTextMessage } from "./messages/drop-anonymous-message.usecase";
import { EncryptMessageRepository } from "./messages/gateways/adapters/encrypt-message.repository";
import { ArangoDbMessageRepository } from "./messages/gateways/adapters/arangodb/arangodb-message.repository";
import { ArangoDbReceiptRepository } from "./messages/gateways/adapters/arangodb/arangodb-receipt.repository";
import { FakeReceiptUrlGenerator } from "./messages/gateways/adapters/test/fake-url.generator";
import { MessageRepository } from "./messages/gateways/message.repository";
import { ReceiptRepository } from "./messages/gateways/receipt.repository";
import { UrlGenerator } from "./messages/gateways/url-generator";
import {Database} from 'arangojs'

export interface Dependencies {
    messageRepository: MessageRepository, 
    receiptRepository: ReceiptRepository, 
    receiptUrlGenerator: UrlGenerator
}

export const createDependencies = (): Dependencies =>{
    const db = new Database({ databaseName: 'grabit', auth: {
        username: 'root', password: 'openSesame'
    }});
    const clearMessageRepository = new ArangoDbMessageRepository(db)
    const messageRepository = new EncryptMessageRepository(clearMessageRepository, "strong password la mif")

    const idGenerator = new NanoIdGenerator()
    const receiptRepository = new ArangoDbReceiptRepository(db, idGenerator)
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
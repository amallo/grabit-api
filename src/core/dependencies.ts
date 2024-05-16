import { NanoIdGenerator } from "./common/providers/nanoid.generator";
import { createDropAnonymousTextMessage } from "./messages/drop-anonymous-message.usecase";
import { EncryptMessageRepository } from "./messages/gateways/adapters/encrypt-message.repository";
import { ArangoDbMessageRepository } from "./messages/gateways/adapters/arangodb/arangodb-message.repository";
import { ArangoDbReceiptRepository } from "./messages/gateways/adapters/arangodb/arangodb-receipt.repository";
import { MessageRepository } from "./messages/gateways/message.repository";
import { ReceiptRepository } from "./messages/gateways/receipt.repository";
import { UrlGenerator } from "./messages/gateways/url-generator";
import {Database} from 'arangojs'
import config from '../../config.json'
import { HostnameReceiptUrlGenerator } from "./messages/gateways/adapters/test/hostname-url.generator";

export interface Dependencies {
    messageRepository: MessageRepository, 
    receiptRepository: ReceiptRepository, 
    receiptUrlGenerator: UrlGenerator
}

export const createDependencies = (): Dependencies =>{
    const db = new Database({ databaseName: config.DATABASE_NAME, auth: {
        username: config.DATABASE_USER, 
        password: config.DATABASE_PASSWORD
    }});
    const clearMessageRepository = new ArangoDbMessageRepository(db)
    const messageRepository = new EncryptMessageRepository(clearMessageRepository, config.DATABASE_ENCRYPTION_AT_REST)

    const idGenerator = new NanoIdGenerator()
    const receiptRepository = new ArangoDbReceiptRepository(db, idGenerator)
    const receiptUrlGenerator = new HostnameReceiptUrlGenerator("http://grabit.com")
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
import { NanoIdGenerator } from "./common/providers/nanoid.generator";
import { EncryptMessageRepository } from "./messages/gateways/adapters/encrypt-message.repository";
import { ArangoDbMessageRepository } from "./messages/gateways/adapters/arangodb/arangodb-message.repository";
import { ArangoDbReceiptRepository } from "./messages/gateways/adapters/arangodb/arangodb-receipt.repository";
import { MessageRepository } from "./messages/gateways/message.repository";
import { ReceiptRepository } from "./messages/gateways/receipt.repository";
import { UrlGenerator } from "./messages/gateways/url-generator";
import {Database} from 'arangojs'
import { HostnameReceiptUrlGenerator } from "./messages/gateways/adapters/test/hostname-url.generator";
import { AppConfig } from "./common/config/config";

export interface Dependencies {
    messageRepository: MessageRepository, 
    receiptRepository: ReceiptRepository, 
    receiptUrlGenerator: UrlGenerator
}

export const createDependencies = (config: AppConfig): Dependencies =>{
    const db = new Database({ 
        url: `http://${process.env.ARANGO_HOST}:${process.env.ARANGO_PORT}`,
        databaseName: config.DATABASE_NAME,
        auth: {
            username: config.DATABASE_USER, 
            password: config.DATABASE_PASSWORD
        }
    });
    
    db.listCollections()
        .then((d)=> console.info("Db connection ok"))
        .catch((e)=> console.error("Db connection failure", e))
    
    const clearMessageRepository = new ArangoDbMessageRepository(db)
    const messageRepository = new EncryptMessageRepository(clearMessageRepository, config.DATABASE_ENCRYPTION_AT_REST)

    const idGenerator = new NanoIdGenerator()
    const receiptRepository = new ArangoDbReceiptRepository(db, idGenerator)
    const receiptUrlGenerator = new HostnameReceiptUrlGenerator(config.HOST_NAME)
    return {
        messageRepository,
        receiptRepository,
        receiptUrlGenerator
    }
}

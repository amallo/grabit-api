import { afterAll, beforeAll, expect, it } from "vitest";
import { ArangoDbMessageRepository } from "../adapters/arangodb/arangodb-message.repository";
import { NanoIdGenerator } from "../../../common/providers/nanoid.generator";
import { ArangoDbReceiptRepository } from "../adapters/arangodb/arangodb-receipt.repository";
import {Database} from 'arangojs'
import { AnonymousMessage } from "../../models/message.model";
import { EncryptMessageRepository } from "../adapters/encrypt-message.repository";

let db: Database
beforeAll(()=>{
    db = new Database({ databaseName: 'grabit', auth: {
        username: 'root', password: 'openSesame'
    }});
})
afterAll(async ()=>{
   // await db.dropDatabase("grabit")
})

it('drops and read a message', async ()=>{
    const idGenerator = new NanoIdGenerator()
    const messageRepository = new ArangoDbMessageRepository(db)
    const encryptedMessageRepository = new EncryptMessageRepository(messageRepository, "toto")

    const messageId = idGenerator.generate()
    const expectedMessage : AnonymousMessage= {
        at: new Date().toISOString(),
        content: 'Salut',
        id: messageId
    }
    await encryptedMessageRepository.dropAnonymous(expectedMessage)

    const receiptRepository = new ArangoDbReceiptRepository(db, idGenerator)
    const expectedReceipt = await receiptRepository.deliver(messageId, {expiresAt: new Date().toISOString()})
    
    const receipt = await receiptRepository.retrieve(expectedReceipt.id)
    expect(receipt).toEqual(expectedReceipt)

    const messsage = await encryptedMessageRepository.retrieve(messageId)
    expect(messsage).toEqual(expectedMessage)
    
})
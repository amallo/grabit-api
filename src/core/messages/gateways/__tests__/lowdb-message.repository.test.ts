import { expect, it } from "vitest";
import { EncryptedLowDbMessageStorage, LowDbMessageRepository, LowDbMessageStorage } from "../low-db-message.repository";
import { LowDbReceiptRepository } from "../low-db-receipt.repository";
import { FakeIdGenerator } from "../../../common/providers/fake-id.generator";

it('drops an encrypted anoymous message and retrieve by ticket', async ()=>{
    const storage = new EncryptedLowDbMessageStorage("toto", new LowDbMessageStorage())
    const lowDbMessageRepository = new LowDbMessageRepository(storage)

    const idGenerator = new FakeIdGenerator()
    idGenerator._willGenerateId = "receipt0"
    const receiptRepository = new LowDbReceiptRepository(idGenerator)


    await lowDbMessageRepository.dropAnonymous({at:"2024-04-04T10:52:19+02:00", content: "zeubi", id: "message0" })
    const message = await lowDbMessageRepository.retrieve("message0")
    const receipt = await receiptRepository.deliver("message0", {expiresAt: "2025-04-04T10:52:19+02:00"})
    
    expect(message).toEqual({at:"2024-04-04T10:52:19+02:00", content: "zeubi", id: "message0" })
    expect(receipt).toEqual({id:"receipt0", validUntil: "2025-04-04T10:52:19+02:00" })
})
import { expect, it } from "vitest";
import { EncryptedLowDbMessageStorage, LowDbMessageRepository, LowDbMessageStorage } from "../low-db-message.repository";

it('drops an encrypted anoymous message', async ()=>{
    const storage = new EncryptedLowDbMessageStorage("toto", new LowDbMessageStorage())
    const lowDbMessageRepository = new LowDbMessageRepository(storage)
    await lowDbMessageRepository.dropAnonymous({at:"2024-04-04T10:52:19+02:00", content: "zeubi", id: "message0" })
    const message = await lowDbMessageRepository.retrieve("message0")
    expect(message).toEqual({at:"2024-04-04T10:52:19+02:00", content: "zeubi", id: "message0" })
})
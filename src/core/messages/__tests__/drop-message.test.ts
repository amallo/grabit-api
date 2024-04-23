import { test } from 'vitest'
import { createMessageFixture } from './message.fixture'


test('drops an anonymous message', async () => {
    const fixture = createMessageFixture()
    fixture.givenMessageDelivery("message0", {
        id: "receipt0",
        validUntil: "2024-04-04T10:52:19+02:00"
    })
    await fixture.whenDroppingAnonymousMessage({content: "my pin code is 12345", at: "2024-01-04T10:52:19+02:00", messageId: "message0"})
    fixture.thenDroppedMessageShouldDeliveredWith({
        receipt: "receipt0",
        validUntil: "2024-04-04T10:52:19+02:00"
    })
    fixture.thenAnonymousMessageWasDropped({
        content: "my pin code is 12345",
        at: "2024-01-04T10:52:19+02:00",
        id: "message0"
    })
})
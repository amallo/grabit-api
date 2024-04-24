import { test } from 'vitest'
import { createMessageFixture } from './message.fixture'
import { Err } from '../../common/errors/err'


test('drops an anonymous message', async () => {
    const fixture = createMessageFixture()
    fixture.givenMessageDelivery("message0", {
        id: "receipt0",
        validUntil: "2024-04-04T10:52:19+02:00",
    })
    fixture.givenReceiptLinkPrefix("http://grabit.com/files")
    await fixture.whenDroppingAnonymousMessage({content: "my pin code is 12345", at: "2024-01-04T10:52:19+02:00", messageId: "message0"})
    fixture.thenDroppedMessageShouldDeliveredWith({
        receipt: "http://grabit.com/files/receipt0",
        validUntil: "2024-04-04T10:52:19+02:00"
    })
    fixture.thenAnonymousMessageWasDropped({
        content: "my pin code is 12345",
        at: "2024-01-04T10:52:19+02:00",
        id: "message0"
    })
})

test('fails to drop an anonymous message', async () => {
    const fixture = createMessageFixture()
    await fixture.whenDroppingAnonymousMessage(
        {content: "my pin code is 12345", at: "2024-01-04T10:52:19+02:00", messageId: "message0"},
        new Error("drop failure")
    )
    fixture.thenDropMessageErrorShouldEqual(new Err("DROP_MESSAGE_ERROR", {cause: new Error("drop failure")}))
})
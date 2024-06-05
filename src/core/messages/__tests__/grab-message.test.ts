
import { createMessageFixture } from './message.fixture'
import { Err } from '../../common/errors/err'


test('grabs message', async () => {
    const fixture = createMessageFixture()
    fixture.givenDeliveredReceipt({id: "receipt0", messageId: "message0", validUntil: '2024-01-04T08:52:19.000Z'})
    fixture.givenDroppedMessage({
        id: "message0",
        content: "my pin code is 12345",
        at: '2024-01-04T08:52:19.000Z',
        type: 'text'
    })
    const grabResult = await fixture.whenGrabbingMessage("receipt0")
    fixture.thenResult(grabResult).shouldEqual({
        content: 'my pin code is 12345',
        type: "text"
    })
})

test('cannot grab nonexistent receipt', async () => {
    const fixture = createMessageFixture()
    fixture.givenDroppedMessage({
        id: "message0",
        content: "my pin code is 12345",
        at: '2024-01-04T08:52:19.000Z',
        type: 'text'
    })
    const result = await fixture.whenGrabbingMessage("receipt0")
    fixture.thenResult(result).shouldFailWith(new Err("GRAB_MESSAGE_ERROR", {cause: new Error("receipt not found")}))
})
test('cannot grab nonexistent message', async () => {
    const fixture = createMessageFixture()
    fixture.givenDeliveredReceipt({id: "receipt0", messageId: "message0", validUntil: '2024-01-04T08:52:19.000Z'})
    const result = await fixture.whenGrabbingMessage("receipt0")
    fixture.thenResult(result).shouldFailWith(new Err("GRAB_MESSAGE_ERROR", {cause: new Error("message not found")}))
})
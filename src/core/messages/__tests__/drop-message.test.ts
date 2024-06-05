
import { createMessageFixture } from './message.fixture'
import { Err } from '../../common/errors/err'


test('drops an anonymous message', async () => {
    const fixture = createMessageFixture()
    fixture.givenWillDeliverReceipt("receipt0", "message0")
    
    fixture.givenWillGenerateReceiptLinkPrefix("http://grabit.com/files")
    const dropResult = await fixture.whenDroppingAnonymousMessage({
        content: "my pin code is 12345", 
        at: "2024-01-04T08:52:19.000Z", 
        messageId: "message0",
        expiresIn: {
            hours: 1
        }
    })
    fixture.thenResult(dropResult).shouldEqual({
        id: "http://grabit.com/files/receipt0",
        validUntil: "2024-01-04T09:52:19.000Z"
    })
    fixture.thenAnonymousMessageWasDroppedWithParams({
        content: "my pin code is 12345",
        at: "2024-01-04T08:52:19.000Z",
        id: "message0",
        type: 'text'
    })
})

test('fails to drop an anonymous message', async () => {
    const fixture = createMessageFixture()
    const dropResult = await fixture.whenDroppingAnonymousMessage(
        {
            content: "my pin code is 12345", 
            at: "2024-01-04T10:52:19+02:00", 
            messageId: "message0",
            expiresIn: {
                hours: 1
            }
        },
        {dropFailure: new Error("drop failure")}
    )
    fixture.thenResult(dropResult).shouldFailWith(new Err("DROP_MESSAGE_ERROR", {cause: new Error("drop failure")}))
})

test('fails to deliver receipt', async () => {
    const fixture = createMessageFixture()
    const dropResult = await fixture.whenDroppingAnonymousMessage(
        {
            content: "my pin code is 12345", 
            at: "2024-01-04T10:52:19+02:00", 
            messageId: "message0",
            expiresIn: {
                hours: 1
            }
        },
        {receiptFailure: new Error("receipt error")}
    )
    fixture.thenResult(dropResult).shouldFailWith(new Err("DROP_MESSAGE_ERROR", {cause: new Error("receipt error")}))
})
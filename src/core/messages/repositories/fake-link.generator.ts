export class FakeReceiptLinkGenerator {
    private withPrefix!: string
    willGenerateWithPrefix(prefix: string){
        this.withPrefix = prefix
    }
    generate(receiptId: string){
        return `${this.withPrefix}/${receiptId}`
    }
}
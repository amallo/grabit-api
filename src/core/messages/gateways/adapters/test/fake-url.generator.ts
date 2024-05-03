import { UrlGenerator } from "../../url-generator"

import {URL} from 'node:url'

export class FakeReceiptUrlGenerator implements UrlGenerator {
    private withPrefix!: string
    willGenerateWithPrefix(prefix: string){
        this.withPrefix = prefix
    }
    generate(receiptId: string): URL{
        return new URL(`${this.withPrefix}/${receiptId}`)
    }
}
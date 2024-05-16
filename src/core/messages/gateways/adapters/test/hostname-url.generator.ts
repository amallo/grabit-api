import { UrlGenerator } from "../../url-generator"

import {URL} from 'node:url'

export class HostnameReceiptUrlGenerator implements UrlGenerator {
    constructor(private prefix: string){}
    generate(receiptId: string): URL{
        return new URL(`${this.prefix}/${receiptId}`)
    }
}
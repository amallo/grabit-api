import { Low } from "lowdb";
import { AnonymousMessage } from "../models/message.model";
import { MessageRepository } from "./message.repository";
import { JSONFile } from 'lowdb/node'

import * as openpgp from 'openpgp';
import { stringToUint8Array, uint8ArrayToString } from "../../common/utils/strings/uint-array.utils";
import { WebStream } from "openpgp";

type AnonymousEncryptedMessage = Omit<AnonymousMessage, 'content'> & {content: WebStream<Uint8Array>}
type Data<T> = {
    messagesById: Record<string, T>
}
type Index = {
    ids: string[]
}

interface Storage<T extends {id: string}> {
    getItem(id: string): Promise<T | null>
    putItem(item: T): Promise<void>
}

export class LowDbMessageStorage<T extends {id: string}> implements Storage<T>{
    dbMessages!: Low<Data<T>>
    dbIndex!: Low<Index>
    constructor(){
        this.dbMessages = new Low(new JSONFile("messages.json"),  {messagesById: {}})
        this.dbIndex = new Low(new JSONFile("index.json"),  {ids: []})
    }
    async getItem(messageId: string): Promise<T | null> {
        await this.dbMessages.read()
        return Promise.resolve(this.dbMessages.data.messagesById[messageId])
    }
    async putItem(message: T): Promise<void> {
        this.dbMessages.data.messagesById[message.id] = message
        this.dbIndex.data.ids.push(message.id)
        await Promise.all([this.dbMessages.write(), this.dbIndex.write()])
    }
}

export class EncryptedLowDbMessageStorage implements Storage<AnonymousMessage>{
    constructor(private password: string, private vaultStorage: LowDbMessageStorage<AnonymousEncryptedMessage>){}
    async getItem(messageId: string): Promise<AnonymousMessage | null> {
       const message = await this.vaultStorage.getItem(messageId)
       if (!message) return null
       const encryptedContent = await openpgp.readMessage({
            armoredMessage: message.content // parse encrypted bytes
       });
       const { data: decrypted } = await openpgp.decrypt({
            message: encryptedContent,
            passwords: [this.password], // decrypt with password
        });
        if (!decrypted) return null
        return {
            at: message.at,
            id: message.id,
            content: decrypted.toString()
        }
    }
    async putItem(anonymous: AnonymousMessage): Promise<void> {
        const message = await openpgp.createMessage({ text: anonymous.content });
        const encrypted = await openpgp.encrypt({
            message, // input as Message object
            passwords: [this.password], // multiple passwords possible
        });
        this.vaultStorage.putItem({
            id: anonymous.id,
            at: anonymous.at,
            content: encrypted
        })
    }
}


export class LowDbMessageRepository implements MessageRepository{
    constructor(private storage: EncryptedLowDbMessageStorage){
    }
    async retrieve(messageId: string): Promise<AnonymousMessage | null> {
        return this.storage.getItem(messageId)
    }
    async dropAnonymous(message: AnonymousMessage): Promise<void> {
        this.storage.putItem(message)
    }
}

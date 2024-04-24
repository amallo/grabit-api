
import {URL} from 'node:url'
export interface UrlGenerator{
    generate(seed: string): URL
}
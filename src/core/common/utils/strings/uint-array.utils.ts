export const stringToUint8Array = (str: string): Uint8Array =>{
    const encoder = new TextEncoder();  // Utilise UTF-8 par défaut
    return encoder.encode(str);
}

export const uint8ArrayToString = (data: Uint8Array): string =>{
    const decoder = new TextDecoder('utf-8'); // UTF-8 est l'encodage par défaut
    return decoder.decode(data);
}
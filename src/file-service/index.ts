import * as fs from 'fs';

const readFileSync = (path: string): Buffer => {
    return fs.readFileSync(path)
}

const writeFileSync = (path: string, data: Buffer | Uint8Array) => {
    fs.writeFileSync(path, data)
}

export const FileService = {
    readFileSync,
    writeFileSync
}
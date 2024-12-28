import { WaveFile } from 'wavefile';
import { FileService } from '../file-service';

const normalizeWavFile = (path: string) => {
    const buffer = FileService.readFileSync(path)
    console.log(buffer)
    const wav = new WaveFile(buffer);
    wav.toSampleRate(16000);
    FileService.writeFileSync(path, wav.toBuffer())
}

export const WavService = {
    normalizeWavFile
}
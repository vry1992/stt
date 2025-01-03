// @ts-nocheck

import { WaveFile } from 'wavefile';
import { FileService } from '../file-service';
import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

const NAME_SYMBOLS_BLACK_LIST = [' ', '.'];

const getWavFile = (path: string): WaveFile => {
    const buffer = FileService.readFileSync(path);
    const wav = new WaveFile(buffer);
    return wav;
};

const padWithSilence = (samples: Int16Array, targetLength: number): Int16Array => {
    const silenceArray = new Int16Array(targetLength - samples.length).fill(0); // Silence for 16-bit PCM
    return new Int16Array([...samples, ...silenceArray]);
};

const joinChannels = (path1: string, path2: string, newName: string) => {

    const wav1 = getWavFile(path1);
    const wav2 = getWavFile(path2);

    if (wav1.fmt.sampleRate !== wav2.fmt.sampleRate || wav1.fmt.bitsPerSample !== wav2.fmt.bitsPerSample) {
        throw new Error('WAV files must have the same sample rate and bit depth');
    }

    const wav1Samples = wav1.getSamples(true, Int16Array);
    const wav2Samples = wav2.getSamples(true, Int16Array);

    const maxLength = Math.max(wav1Samples.length, wav2Samples.length);

    const paddedWav1Samples =
        wav1Samples.length < maxLength ? padWithSilence(wav1Samples, maxLength) : wav1Samples;

    const paddedWav2Samples =
        wav2Samples.length < maxLength ? padWithSilence(wav2Samples, maxLength) : wav2Samples;

    const stereoSamples: number[] = [];
    for (let i = 0; i < maxLength; i++) {
        stereoSamples.push(paddedWav1Samples[i], paddedWav2Samples[i]);
    }

    wav1.fmt.numChannels = 2;
    wav1.fmt.byteRate *= 2;
    wav1.fmt.blockAlign *= 2;
    wav1.data.chunkSize = stereoSamples.length * (wav1.fmt.bitsPerSample / 8);
    wav1.data.samples = new Uint8Array(new Int16Array(stereoSamples).buffer);

    const combinedBuffer = wav1.toBuffer();
    FileService.writeFileSync(path.join(__dirname, `../../../../temp/${newName}`), combinedBuffer);

    console.log('Stereo conversation WAV created:', newName);
};


const normalizeWavFile = (path: string) => {
    const buffer = FileService.readFileSync(path)
    const wav = new WaveFile(buffer);
    if (!wav.fmt) {
        throw new BadRequestException({error: 'The file is not wav format'})
    }
    wav.toSampleRate(16000);
    FileService.writeFileSync(path, wav.toBuffer())
}

const normalizeName = (oldName: string) => {
    return oldName.split('').filter((s) => !NAME_SYMBOLS_BLACK_LIST.includes(s)).join('').replace(/wav$/, '.wav')
}

export const WavService = {
    normalizeWavFile,
    normalizeName,
    joinChannels
}
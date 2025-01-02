// @ts-nocheck

import { WaveFile } from 'wavefile';
import { FileService } from '../file-service';
import { BadRequestException } from '@nestjs/common';
import * as path from 'path';

const NAME_SYMBOLS_BLACK_LIST = [' ', '.'];

const getWavFile = (path: string): WaveFile => {
    const buffer = FileService.readFileSync(path)
    const wav = new WaveFile(buffer);
    return wav;
}

const joinChannels = (path1: string, path2: string, newName: string) => {
    // Read the WAV files
    const first = getWavFile(path1);
    const second = getWavFile(path2);

    // Validate if both files are WAV files
    if (!first.fmt || !second.fmt) {
        throw new BadRequestException({ error: 'One of the files is not in WAV format' });
    }

    // Log fmt for both files to help diagnose
    console.log('First file fmt:', first.fmt);
    console.log('Second file fmt:', second.fmt);

    // Check if both files have the same sample rate and bit depth
    if (first.fmt.sampleRate !== second.fmt.sampleRate) {
        throw new BadRequestException({ error: 'Sample rates do not match' });
    }

    // Fallback to default bit depth if it's missing
    const bitsPerSample1 = first.fmt.bitsPerSample || 16; // Default to 16-bit if missing
    const bitsPerSample2 = second.fmt.bitsPerSample || 16; // Default to 16-bit if missing

    if (bitsPerSample1 !== bitsPerSample2) {
        throw new BadRequestException({ error: 'Bit depths do not match' });
    }

    // Get the audio data (samples)
    const audioData1 = first.data.samples;
    const audioData2 = second.data.samples;

    // If the lengths don't match, zero-pad the shorter array
    const maxLength = Math.max(audioData1.length, audioData2.length);

    // Zero-padding the shorter file to match the longer one
    const paddedAudioData1 = [...audioData1, ...new Array(maxLength - audioData1.length).fill(0)];
    const paddedAudioData2 = [...audioData2, ...new Array(maxLength - audioData2.length).fill(0)];

    // Combine the audio data (this assumes both files are mono and have the same sample rate and bit depth)
    const combinedAudioData = [];

    // Interleave the samples for stereo output (first channel, second channel)
    for (let i = 0; i < maxLength; i++) {
        // Push first audio channel (left)
        combinedAudioData.push(paddedAudioData1[i]);
        
        // Push second audio channel (right)
        combinedAudioData.push(paddedAudioData2[i]);
    }

    // Determine the type of the sample data based on the bit depth
    let finalAudioData;
    if (bitsPerSample1 === 16) {
        // Use Int16Array for 16-bit PCM data
        finalAudioData = new Int16Array(combinedAudioData);
    } else if (bitsPerSample1 === 32) {
        // Use Float32Array for 32-bit PCM data
        finalAudioData = new Float32Array(combinedAudioData);
    } else {
        throw new BadRequestException({ error: 'Unsupported bit depth' });
    }

    // Create a new WAV file with the combined data
    const newWav = new WaveFile();

    // The number of channels is now 2 (stereo)
    newWav.fromScratch(2, first.fmt.sampleRate, bitsPerSample1, finalAudioData);

    // Write the new WAV file to disk
    const outputBuffer = newWav.toBuffer();
    FileService.writeFileSync(path.join(process.cwd(), `temp/${newName}.wav`), outputBuffer);

    console.log(`New stereo WAV file created: ${newName}.wav`);
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
    return oldName.split('').filter((s) => !NAME_SYMBOLS_BLACK_LIST.includes(s)).join('').replace('wav', '.wav')
}

export const WavService = {
    normalizeWavFile,
    normalizeName,
    joinChannels
}
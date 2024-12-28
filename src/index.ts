import path from 'path'
import { TranscriptService } from './transcript-service';
import { WavService } from './wav-service';

// Need to provide exact path to your audio file.
const filePath = path.resolve(__dirname, './audio/audio.wav');

WavService.normalizeWavFile(filePath);

TranscriptService.transcript(filePath).then((t) => {
    console.log(t)
});

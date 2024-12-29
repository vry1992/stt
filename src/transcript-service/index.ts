import { nodewhisper } from 'nodejs-whisper'
import { MODELS_ENUM } from '../enums';

export const DEFAULT_OPTIONS = {
    modelName: MODELS_ENUM.LARGE_V1, //Downloaded models name
    autoDownloadModelName: MODELS_ENUM.LARGE_V1, // (optional) autodownload a model if model is not present
    verbose: false,
    removeWavFileAfterTranscription: true,
    withCuda: false, // (optional) use cuda for faster processing
    whisperOptions: {
        outputInText: false, // get output result in txt file
        outputInVtt: false, // get output result in vtt file
        outputInSrt: false, // get output result in srt file
        outputInCsv: false, // get output result in csv file
        translateToEnglish: false, //translate from source language to english
        language: 'ru', // source language
        wordTimestamps: false, // Word-level timestamps
        timestamps_length: 20, // amount of dialogue per timestamp pair
        splitOnWord: true, //split on word rather than on token
    },
}

type OptType = typeof DEFAULT_OPTIONS

const transcript = (filePath: string, options: OptType = DEFAULT_OPTIONS): Promise<string> => {
    return nodewhisper(filePath, options)
}

export const TranscriptService = {
    transcript
}
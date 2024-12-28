import path from 'path'
import { nodewhisper } from 'nodejs-whisper'
import { MODELS_ENUM } from '../enums';

const DEFAULT_OPTIONS = {
    modelName: MODELS_ENUM.LARGE_V1, //Downloaded models name
    autoDownloadModelName: MODELS_ENUM.LARGE_V1, // (optional) autodownload a model if model is not present
    //     verbose?: boolean
    removeWavFileAfterTranscription: true,
    // withCuda?: boolean // (optional) use cuda for faster processing
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

const transcript = (filePath: string, options = DEFAULT_OPTIONS) => {
    return nodewhisper(filePath, options)
}

export const TranscriptService = {
    transcript
}
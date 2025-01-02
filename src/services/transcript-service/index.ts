import * as path from 'path'
import { OptionsType, runCMDComand } from './helpers/whispler-cli-helper';
import { MODELS_PATH, MODELS } from '../transcript-service/constants';

const DEFAULT_OPTIONS : OptionsType = {
    model: path.join(MODELS_PATH, MODELS.large_v1),
    outputInText: false, // get output result in txt file
    outputInVtt: false, // get output result in vtt file
    outputInSrt: false, // get output result in srt file
    outputInCsv: false, // get output result in csv file
    translateToEnglish: false, //translate from source language to english
    language: 'ru', // source language
    wordTimestamps: false, // Word-level timestamps
    timestamps_length: 20, // amount of dialogue per timestamp pair
    splitOnWord: true, //split on word rather than on token
}

const transcript = (filePath: string, options = DEFAULT_OPTIONS) => {
    return runCMDComand(filePath,  options)
}

export const TranscriptService = {
    transcript
}
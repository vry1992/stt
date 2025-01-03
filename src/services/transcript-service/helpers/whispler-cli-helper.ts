import { WHISPER_CLI_PATH } from "../constants";
import { cd, exec } from "shelljs";


export type OptionsType = {
    model: string,
    outputInText: boolean, 
    outputInJson: boolean,// get output result in txt file
    outputInVtt: boolean, // get output result in vtt file
    outputInSrt: boolean, // get output result in srt file
    outputInCsv: boolean, // get output result in csv file
    translateToEnglish: boolean, //translate from source language to english
    language: 'ru', // source language
    wordTimestamps: boolean, // Word-level timestamps
    timestamps_length: number, // amount of dialogue per timestamp pair
    splitOnWord: boolean, //split on word rather than on token
}

export const createRunCommand = (filePath: string, options: OptionsType) => {
    const base = `whisper-cli -f ${filePath} -t 10`

    const commands = Object.entries(options).reduce((acc, [key, value]) => {
        if (!value) return acc;
        switch(key) {
            case 'model': 
                return [...acc, ` -m ${value}`];
            case 'language': 
                return [...acc, ` -l ${value}`];
            // case 'splitOnWord': 
            //     return [...acc, ` -sow ${value}`];
            // case 'outputInJson': 
            //     return [...acc, ` -oj ${value}`]; 
            // case 'wordTimestamps': 
            //     return [...acc, ` -ml ${value ? value : 1}`];
            default:
                return acc;
        }
    }, [base]).join('');

    return commands
};

export const runCMDComand = (filePath: string, options: OptionsType) => {
    const command = createRunCommand(filePath, options);
    cd(WHISPER_CLI_PATH);
    exec('chcp 65001');
    const process = exec(command, { async: true });
    return process
}
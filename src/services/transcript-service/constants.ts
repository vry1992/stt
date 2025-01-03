import * as path from 'path';

export const WHISPER_PATH = path.join(process.cwd(), 'src/cpp/whisper.cpp');
export const WHISPER_CLI_PATH = path.join(WHISPER_PATH, 'bin/Release')
export const MODELS_PATH = path.join(WHISPER_PATH, 'models');

export const MODELS = {
    large_v1: 'ggml-large-v1.bin'
}
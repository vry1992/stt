import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import { WavService } from './services/wav-service';
import { TranscriptService } from './services/transcript-service';

@Injectable()
export class AppService {

  transcribe(files: { audio?: Express.Multer.File[] }): any {
    const APP_PATH = __dirname;
    console.log(APP_PATH)
    if (!files || !files.audio.length || files.audio.length > 2) {
      throw new BadRequestException({ error: 'Please upload exactly one files' })
    }
    let firstPath = '';
    let secondPath = '';
    
    const [first, second] = files.audio;

    let concatName = ''



    if (first) {
      firstPath = path.join(APP_PATH, `../../temp/${first.originalname}`);
      WavService.normalizeWavFile(firstPath);
      // const firstProcess = TranscriptService.transcript(firstPath);

      // firstProcess.stdout.on('data', (data) => {
      //   console.log('first data => ', data)
      // })

      // firstProcess.stdout.on('end', (data) => {
      //   console.log('first END => ', data)
      // })
    }

    if (second) {
      secondPath = path.join(APP_PATH, `../../temp/${second.originalname}`);
      WavService.normalizeWavFile(secondPath);
      // const secondProcess = TranscriptService.transcript(secondPath);

      // secondProcess.stdout.on('data', (data) => {
      //   console.log('second data => ', data)
      // })

      // secondProcess.stdout.on('end', (data) => {
      //   console.log('second END => ', data)
      // })

      if (first) {
        concatName = WavService.normalizeName(first.originalname + '_' + second.originalname)
      }

    }

    if (first && second) {
      WavService.joinChannels(firstPath, secondPath, concatName);
      const stereoPath = path.join(APP_PATH, `../../temp/${concatName}`)
      // console.log('=>>>>', stereoPath)
      // const secondProcess = TranscriptService.transcript(stereoPath);

      // secondProcess.stdout.on('data', (data) => {
      //   console.log('second data => ', data)
      // })

      // secondProcess.stdout.on('end', (data) => {
      //   console.log('second END => ', data)
      // })
    }
  }
}

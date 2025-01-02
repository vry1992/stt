import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import { WavService } from './services/wav-service';
import { TranscriptService } from './services/transcript-service';

@Injectable()
export class AppService {

  transcribe(files: { audio?: Express.Multer.File[] }): any {
    const APP_PATH = process.cwd()
    if (!files || !files.audio.length || files.audio.length > 2) {
      throw new BadRequestException({ error: 'Please upload exactly one files' })
    }
    let firstPath = '';
    let secondPath = '';
    
    const [first, second] = files.audio;

    let concatName = ''

    if (first) {
      firstPath = path.resolve(APP_PATH, `./temp/${first.originalname}`);
      WavService.normalizeWavFile(firstPath);
      const firstProcess = TranscriptService.transcript(firstPath);

      firstProcess.stdout.on('data', (data) => {
        console.log('first data => ', data)
      })

      firstProcess.stdout.on('end', (data) => {
        console.log('first END => ', data)
      })
    }

    if (second) {
      secondPath = path.resolve(APP_PATH, `./temp/${second.originalname}`);
      WavService.normalizeWavFile(secondPath);
      if (firstPath) {
        concatName = first.originalname + '_' + second.originalname
        // WavService.joinChannels(firstPath, secondPath, concatName)
      }
      const secondProcess = TranscriptService.transcript(secondPath);

      secondProcess.stdout.on('data', (data) => {
        console.log('second data => ', data)
      })

      secondProcess.stdout.on('end', (data) => {
        console.log('second END => ', data)
      })

    }
    


    // const b = await TranscriptService.transcript(secondPath);
    // result[0] = a;
    // result[1] = b;
  }
}

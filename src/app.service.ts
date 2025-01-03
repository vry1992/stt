import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import { WavService } from './services/wav-service';
import { TranscriptService } from './services/transcript-service';
import { ChildProcess } from 'child_process';

@Injectable()
export class AppService {

  private stderrListener(proc: ChildProcess) {
    proc.stderr.on('data', (data) => {
      const dataStr = data.toString();
      if (dataStr.indexOf('whisper_print_progress_callback') >= 0) {
        const regexp = new RegExp(/\d{1,3}/)
        const percent = regexp.exec(data.toString())?.[0];

        console.log(percent)
      }
    });
  }


  private handleChannel(filePath: string) {
    console.log('START =>>>>>', filePath)
    return new Promise((resolve, reject) => {
      WavService.normalizeWavFile(filePath);
  
      const proc = TranscriptService.transcript(filePath);
  
      this.stderrListener(proc);
  
      proc.on('close', (code) => {
        console.log('\n\n\n\n\nFINISH ', filePath, '\n\n\n\n')
        resolve(true)
      });
    })
  }

  async transcribe(files: { audio?: Express.Multer.File[] }) {
    console.log('START TRANSCRIBING')
    if (!files || !files.audio.length || files.audio.length > 2) {
      throw new BadRequestException({ error: 'Please upload exactly one files' })
    }
    let firstPath = '';
    let secondPath = '';
    
    const [first, second] = files.audio;

    let concatName = ''

    if (first) {
      firstPath = path.join(__dirname, `../../temp/${first.originalname}`);
      this.handleChannel(firstPath)
        .then(() => {
          if (second) {
            secondPath = path.join(__dirname, `../../temp/${second.originalname}`);
            this.handleChannel(firstPath)
          }
        })
    }

    // if (first && second) {
    //   WavService.joinChannels(firstPath, secondPath, concatName);
    //   const stereoPath = path.join(APP_PATH, `../../temp/${concatName}`)
    //   // console.log('=>>>>', stereoPath)
    //   const secondProcess = TranscriptService.transcript(stereoPath);

    //   // secondProcess.stdout.on('data', (data) => {
    //   //   console.log('second data => ', data)
    //   // })

    //   // secondProcess.stdout.on('end', (data) => {
    //   //   console.log('second END => ', data)
    //   // })
    // }
  }
}

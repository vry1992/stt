import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WavService } from './services/wav-service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(__dirname)
  }

  @Post('transcribe')
  @UseInterceptors(FileFieldsInterceptor(
  [
    { name: 'audio', maxCount: 2 },
  ],
  {
    storage: diskStorage({
      destination: path.join(__dirname, '../../temp'),
      filename: (req, file, callback) => {
        const filename = WavService.normalizeName(file.originalname);
        file.originalname = filename;
        callback(null, filename);
      },
    }),
  }
))
  transcribe(@UploadedFiles() files: { audio?: Express.Multer.File[] }) {
    return this.appService.transcribe(files);
  }
}

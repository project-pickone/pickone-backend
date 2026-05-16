import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  public upload(file: Express.Multer.File): { url: string } {
    return { url: `/public/${file.filename}` };
  }
}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  public async hash(rawStr: string) {
    return await bcrypt.hash(rawStr, 10);
  }

  public async compare(rawStr: string, hashedStr: string) {
    return await bcrypt.compare(rawStr, hashedStr);
  }
}

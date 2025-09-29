import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { Repository } from 'src/enums';
import { FileRepository } from 'src/db/repositories/file.repository';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: Repository.FILE,
      useClass: FileRepository,
    }],
})
export class FileModule { }

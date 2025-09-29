import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { DESTINATION, Repository } from 'src/enums';
import { FileRepository } from 'src/db/repositories/file.repository';
import { FileEntity } from './entities/file.entity';
import fs from 'fs';
import { promises as pfs } from 'fs';
import { getExtension, getUniqFilename } from 'src/utils';

@Injectable()
export class FileService {
  constructor(
    @Inject(Repository.FILE)
    private readonly fileRepository: FileRepository,
  ) { }
  create(dto: CreateFileDto): Promise<FileEntity> {
    return this.fileRepository.createFile(dto);
  }

  findAll(size: number, page: number) {
    return this.fileRepository.findAll(size, page);
  }

  findOne(id: number): Promise<FileEntity> {
    return this.fileRepository.findOne(id);
  }

  async update(id: number, file: Express.Multer.File) {    
    const fileEntity = await this.findOne(+id);
    if (!fileEntity) throw new BadRequestException('File not found');
    
    const newFilename = getUniqFilename(file.originalname);
    const newPath = `${DESTINATION}/${newFilename}`;
    const extension = getExtension(file.originalname);
    const stream = fs.createWriteStream(newPath);
    stream.write(file.buffer);    
    await pfs.unlink(fileEntity.path);
    return await this.fileRepository.update(+id, { originalname: file.originalname, filename: newFilename, mimetype: file.mimetype, size: file.size, extension, path: newPath });
    
  }

  async remove(id: number) {
    const fileEntity = await this.findOne(+id);
    if (!fileEntity) throw new BadRequestException('File not found');

    await pfs.unlink(fileEntity.path);
    await this.fileRepository.remove(id);
  }
}

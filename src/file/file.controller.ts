import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Res, StreamableFile, BadRequestException, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Public } from 'src/auth/decorators/public.decorator';

import { getExtension, getUniqFilename } from 'src/utils';
import { DESTINATION } from 'src/enums';

const LIST_SIZE = 10;
const PAGE = 1;


@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: DESTINATION, 
      filename: (req, file, cb) => {        
        cb(null, getUniqFilename(file.originalname));
      },
    }),
  }))
  uploadFile(@Request() request: any, @UploadedFile() file: Express.Multer.File) {
    const { originalname, mimetype, filename, path, size } = file;
    const extension = getExtension(file.originalname);
    return this.fileService.create({ originalname, mimetype, filename, path, size, extension, userId: request.userSession?.userId })
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string) {
    const fileEntity = await this.fileService.findOne(+id);
    if (!fileEntity) throw new BadRequestException('File not found');
    const file = createReadStream(join(process.cwd(), fileEntity.path));
    return new StreamableFile(file);
  }

  @Get('list')
  findAll(@Query() params: any) {
    return this.fileService.findAll(Math.abs(+params.list_size) || LIST_SIZE, Math.abs(+params.page) || PAGE);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {   
    return this.fileService.update(+id, file);
  }


  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    await this.fileService.remove(+id);
  }
}

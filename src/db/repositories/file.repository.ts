import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { DB_CONNECTION } from '../db.module';
import { Table } from 'src/enums';
import { FileEntity } from 'src/file/entities/file.entity';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import { UpdateFileDto } from 'src/file/dto/update-file.dto';

@Injectable()
export class FileRepository {
  constructor(@Inject(DB_CONNECTION) private readonly db: Knex) { }

  async createFile(dto: CreateFileDto): Promise<FileEntity> {
    const [file] = await this.db(Table.FILES).insert(dto, '*');
    return file;
  }

  async findOne(id: number): Promise<FileEntity> {
    const file = await this.db(Table.FILES).select('*').where({id}).first();
    return file;
  }

  async findAll(size: number, page: number): Promise<FileEntity[]> {
    const files = await this.db(Table.FILES).select('*').limit(size).offset(size*(page-1));
    return files;
  }

  remove(id: number) {
    return this.db(Table.FILES).del().where({id});
  }

  async update(id: number, dto: UpdateFileDto): Promise<FileEntity> {
    const [file] = await this.db(Table.FILES).update(dto, '*').where({id});
    return file;
  }

}

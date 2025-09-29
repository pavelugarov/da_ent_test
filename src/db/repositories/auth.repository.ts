import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { DB_CONNECTION } from '../db.module';
import { Table } from 'src/enums';
import { CreateSessionDto } from '../dto/create-session';
import { UserEntity } from 'src/auth/enities/user.entry';
import { Session } from 'src/auth/enities/session.entry';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(@Inject(DB_CONNECTION) private readonly db: Knex) { }

  async createUser(login: string, password: string): Promise<UserEntity> {
    const [user] = await this.db(Table.USERS).insert({ login, password }, '*');
    return { id: user.id, login: user.login };
  }

  async findUserByCredintals(login: string, password: string): Promise<UserEntity | null> {
    const user = await this.db(Table.USERS).select('*').where({ login }).first();    
    if (!user) return null;
    const checkPassword: boolean = await bcrypt.compare(password, user.password);
    if (!checkPassword) return null;

    return { id: user.id, login: user.login };
  }

  async findUserByLogin(login: string): Promise<UserEntity | null> {

    const user = await this.db(Table.USERS).select('*').where({ login }).first();
    if (!user) return null;
    return user;
  }

  async createSession(dto: CreateSessionDto): Promise<void> {
    await this.db(Table.SESSIONS).insert(dto, '*');
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    const user = await this.db(Table.USERS).select('*').where({ id }).first();
    if (!user) return null;
    return { id: user.id, login: user.login };
  }

  async getUserSession(userId: number, sessionId: string): Promise<Session | null> {
    const session = await this.db(Table.SESSIONS).select('*').where({ userId, sessionId }).andWhere({ sessionId }).first();
    return session;
  }

  async updateSession(refreshToken: string, id: number): Promise<void> {
    await this.db(Table.SESSIONS).update({ refreshToken }, '*').where({ id });
  }

  async removeSession(id: number): Promise<void> {
    await this.db(Table.SESSIONS).del().where({ id });
  }
}

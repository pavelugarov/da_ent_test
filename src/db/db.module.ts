import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex from 'knex';
const CLIENT = 'pg';
const DIALECT = 'postgres';
export const DB_CONNECTION = 'DB_CONNECTION';
import 'dotenv/config';

export const dbProvider: Provider = {
  provide: 'DB_CONNECTION',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return knex({
      client: CLIENT,
      dialect: DIALECT,
      debug: false,
      connection: {
        multipleStatements: true,
        connectionString: config.get<string>('DATABASE_URL'),
        timezone: 'utc',
      },
    });
  },
};


@Module({
  imports: [ConfigModule],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}

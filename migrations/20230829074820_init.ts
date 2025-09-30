import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS public.users (
      id BIGSERIAL PRIMARY KEY,
      login text NOT NULL UNIQUE,
      password TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.sessions (
      id BIGSERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      "sessionId" uuid NOT NULL,
      "refreshToken" text NOT NULL,
      "lastAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE("userId", "sessionId")    
    );

    CREATE TABLE IF NOT EXISTS public.files (
      id BIGSERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      filename text NOT NULL,
      originalname text NOT NULL,
      extension text NOT NULL,
      mimetype text NOT NULL,
      size INTEGER NOT NULL,
      path text NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()      
    );
  `);
  
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    
  `);
}


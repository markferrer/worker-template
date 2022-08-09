import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

export type DbEngine = 'postgres' | 'mysql' | 'sqlite';
export type ClientType = 'prisma' | 'supabase'; // | 'postgrest'

export interface DatabaseSecrets {
  DATABASE_CLIENT: ClientType;
  DATABASE_ENGINE: DbEngine;
  DATABASE_URL: string;

  // Supabase specific
  DATABASE_KEY?: string;
  DATABASE_SCHEMA?: string;

  // Prisma + RDS read/write cluster specific
  // Note: Prisma Data Proxy was not working w/ RDS Aurora for some reason.
  //  However, it was worked for Neon.tech.
  DATABASE_WRITE_URL?: string;
  DATABASE_READ_URL?: string;
}

export interface IsSupabase extends SupabaseClient {}
export interface IsPrisma extends PrismaClient {}

import { PrismaClient } from '@prisma/client/edge';
import { createClient as supaCreateClient } from '@supabase/supabase-js';
import { DatabaseSecrets, IsPrisma, IsSupabase } from './types/db';

type InstanceType = 'read' | 'write';

interface CreateClientOptions {
  instanceType: InstanceType;
}

interface ClientMapping {
  supabase: {
    (env: DatabaseSecrets): IsSupabase;
  };
  prisma: {
    (env: DatabaseSecrets, options?: CreateClientOptions): IsPrisma;
  };
}

export const createSupabase = (env: DatabaseSecrets): IsSupabase => {
  // Make sure that we have the API key from Supabase
  if (!('DATABASE_KEY' in env)) {
    throw new Error(
      'DATABASE_KEY not found in env for Supabase client. Please assign the public-anon-key from your Supabase account to this environment variable.',
    );
  }

  // Supabase-js uses cross-fetch, which doesn't work in the Worker runtime,
  //  so, we override it with the fetch available in this runtime.
  const client = supaCreateClient(env.DATABASE_URL, env.DATABASE_KEY as string, {
    fetch: fetch.bind(globalThis),
    schema: env.DATABASE_SCHEMA,
  });
  return client;
};

// TODO: build a version that does not depend on the options param
export const createPrisma = (env: DatabaseSecrets, options?: CreateClientOptions): IsPrisma => {
  const connectionMap = {
    read: env.DATABASE_READ_URL,
    write: env.DATABASE_WRITE_URL,
  };

  // Some cluster configurations will have a separate read/write db instance.
  let databaseUrl: string;
  if (options) {
    databaseUrl = connectionMap[options.instanceType] as string;
  } else {
    databaseUrl = env.DATABASE_URL;
  }

  // Module type workers cannot access environment variables globally.
  //  This means that the env('DATABASE_URL') defined in schema.prisma won't work outside of local dev.
  //  We set the actual database url to be used on client creation here.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  return client;
};

// TODO: make a better version of this. I'm probably not doing this the best way.
export const createDataClient = <T extends IsSupabase | IsPrisma>(env: DatabaseSecrets, options?: CreateClientOptions): T => {
  const clientMap: ClientMapping = {
    supabase: createSupabase,
    prisma: createPrisma,
  };

  // Note: createSupabase does not take the options arg.
  const client = clientMap[env.DATABASE_CLIENT](env, options);

  return client as T;
};

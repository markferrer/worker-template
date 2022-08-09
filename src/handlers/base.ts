import { Context } from 'hono';
import { createDataClient } from '../utils/db';
import { DatabaseSecrets, IsSupabase } from '../types/db';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';

interface Handler {
  handle(): Promise<Response>;
}

export abstract class BaseHandler implements Handler {
  /**
   * Base request handler
   */

  constructor(protected c: Context, protected httpMethod?: HttpMethod) {
    if (!httpMethod) {
      this.httpMethod = c.req.method as HttpMethod;
    }
  }

  /**
   * Calls the appropriate handler for the HTTP method in context
   * or calls a custom handler class method.
   * @param customMethod method name to call (not an HTTP method)
   * @returns a Promise of Response
   */
  public async handle(customMethod?: string): Promise<Response> {
    return await this[(customMethod as keyof BaseHandler) ?? (this.httpMethod?.toLowerCase() as keyof BaseHandler)]();
  }

  // EXAMPLES
  // protected async get(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async post(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async patch(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async put(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async head(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async options(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async trace(): Promise<Response> {
  //   return this.notImplemented();
  // }
  // protected async connect(): Promise<Response> {
  //   return this.notImplemented();
  // }

  protected ok(data?: {}): Response {
    if (!data) {
      const data = {
        res: 'ok',
      };
    }
    return this.c.json(data);
  }

  protected notImplemented(): Response {
    const res = new Response(null, { status: 501 });
    return res;
  }
}

export abstract class BaseDbHandler extends BaseHandler {
  /**
   * Base request handler but with a database client
   */

  protected db;

  constructor(protected c: Context, protected httpMethod?: HttpMethod) {
    super(c, httpMethod);
    this.db = createDataClient<IsSupabase>(this.c.env as DatabaseSecrets);
  }
}

// Example
export class FooHandler extends BaseHandler {
  protected async get(): Promise<Response> {
    return this.ok();
  }
}

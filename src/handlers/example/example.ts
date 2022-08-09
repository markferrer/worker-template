import { v4 as uuidv4 } from 'uuid';
import { BaseDbHandler } from '../base';
import { User } from '@prisma/client/edge'; // Prisma generated model types

export class ExampleHandler extends BaseDbHandler {
  protected async get(): Promise<Response> {
    // DB call
    const users = await this.db.from<User>('User').select();

    return this.c.json({
      data: users,
    });
  }

  protected async post(): Promise<Response> {
    const emailUser = uuidv4();

    const newUserData = {
      email: `${emailUser}@test.com`,
      name: 'Test Test',
    };

    // DB call
    await this.db.from<User>('User').insert(newUserData);

    return this.ok();
  }
}

import { Hono } from 'hono';
import { ExampleHandler } from './example';

const app = new Hono();

app.get('/', async (c): Promise<Response> => new ExampleHandler(c).handle());
app.post('/', async (c): Promise<Response> => new ExampleHandler(c).handle());

// alternatively
// app.all('/', async(c): Promise<Response> => new ExampleHandler(c).handle());

export { app };

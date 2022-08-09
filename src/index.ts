import { Hono } from 'hono';
import { app as exampleApp } from './handlers/example/routes';

const app = new Hono();

app.route('/basepath', exampleApp);

export default app;

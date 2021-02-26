import { App } from './app';
import { TrendsController } from './controllers/trendsController';

const app = new App(
  [
    new TrendsController(),
  ],
  8000,
);

app.listen();
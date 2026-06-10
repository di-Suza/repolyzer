import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

// env.PORT is already converted to a number in config/env.js.
app.listen(env.PORT, () => {
  console.log(`API server running on http://localhost:${env.PORT}`);
});

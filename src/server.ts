import { config as loadEnv } from 'dotenv';

loadEnv({ path: `./envs/.env` });
loadEnv({ path: `./envs/.env.${process.env.ARUNDO_ENV}` });
loadEnv({
  path: `./envs/.env.${process.env.ARUNDO_ENV}.local`,
});

import express from 'express';
import path from 'path';

// const isProduction = process.env.NODE_ENV === 'production';

// middleware for local development (non-production)
const app = express();

app.use('/assets', express.static(path.join(__dirname, 'client', 'assets')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
  console.log(`Running commit: ${process.env.CURRENT_COMMIT}`);
});

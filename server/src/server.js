import app from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function startServer() {

  await connectDatabase();

  const PORT = ENV.PORT;
  app.listen(PORT, () => {
    console.log(`Server Express đang hoạt động ở chế độ [${ENV.NODE_ENV}] tại cổng: http://localhost:${PORT}`);
  });
}

startServer();

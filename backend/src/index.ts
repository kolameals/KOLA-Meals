import dotenv from 'dotenv';
import { app } from './app.js';
import logger from './config/logger.config.js';

dotenv.config();

const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 
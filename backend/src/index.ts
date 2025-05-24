import dotenv from 'dotenv';
import { app } from './app';
import logger from './config/logger.config';

dotenv.config();

const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 
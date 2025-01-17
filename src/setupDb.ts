import mongoose from 'mongoose';
import { config } from '@root/config';
import { adminService } from '@service/db/admin.service';
import Logger from 'bunyan';

const logger: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        logger.info('Successfully connected to the database');
        adminService.createAppServiceAdmin();
      })
      .catch((err) => {
        logger.error('Error connecting to database', err);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnected', connect);
};

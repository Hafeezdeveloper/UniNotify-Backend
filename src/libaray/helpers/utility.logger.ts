import {createLogger, format, transports} from 'winston';
import 'winston-mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const {combine, timestamp} = format;

const loggerTransports: transports.StreamTransportInstance[] = [];

// if (process.env.NODE_ENV === 'production') {
loggerTransports.push(
  new transports.MongoDB({
    db: process.env.MONGO_URI as string,
    options: {useUnifiedTopology: true},
    level: 'error',
  }),
);

// logs error in database
export const logger = createLogger({
  format: combine(timestamp(), format.errors({stack: true}), format.metadata()),
  transports: loggerTransports,
});

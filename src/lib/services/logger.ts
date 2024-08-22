import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: 'bot',
  transports: [
    new winston.transports.File({filename: 'logs/combined.log'}),
    new winston.transports.File({filename: 'logs/error.log', level: 'error'})
  ],
});

if (process.env.MODE !== "prod") {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({timestamp, level, message}) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    )
  }));
}

export {logger};

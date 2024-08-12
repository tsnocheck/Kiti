import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: 'bot',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(({timestamp, level, message}) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    }),
    new winston.transports.File({filename: 'combined.log'}),
    new winston.transports.File({filename: 'error.log', level: 'error'})
  ],
});

if (process.env.MODE !== "prod") {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }));
}

export {logger};

import winston from 'winston';
import { format } from 'date-fns';

const customTimestampFormat = winston.format((info) => {
	info.timestamp = format(new Date(), 'HH:mm');
	return info;
})();

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		customTimestampFormat,
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}]: ${message}`;
		})
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ timestamp, level, message }) => {
					return `${timestamp} [${level}]: ${message}`;
				})
			)
		}),
		new winston.transports.File({ filename: 'combined.log' })
	],
});

export { logger };

import winston from 'winston';

winston.loggers.add('default', {
	console: {
		colorize: 'true',
		handleExceptions: true,
		timestamp: true,
		json: true,
		level: 'debug',
		label: 'DEFAULT',
	}
});

export const Log = winston.loggers.get('default');

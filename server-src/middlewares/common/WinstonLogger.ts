import * as config from 'config';
import {Application} from 'express';
import * as winston from 'winston';
import {LoggerInstance} from 'winston';

export const winstonLogger: LoggerInstance = new winston.Logger();

process.on('unhandledRejection', (reason, p) => {
    winstonLogger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const level: string = process.env.LOG_LEVEL || config.get('loglevel');

export function setupLogging(app: Application) {
    /**
     * Development Logger
     * const env = server-config.util.getEnv('NODE_ENV');
     * error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
     */

    if (level === 'info') {
        winstonLogger.add(winston.transports.Console, {
            type: 'debug',
            colorize: true,
            prettyPrint: true,
            handleExceptions: true,
            humanReadableUnhandledException: true
        });
    }
}

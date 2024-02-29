//@ts-nocheck

import { ILogs } from '@/@types/logs';
import { Logs } from '@/models/logs';
import winston, { transports, format } from 'winston';

const LOGS_LEVELS = {
    emergency: 0, //system is unusable
    alert: 1, //action must be taken immediately
    critical: 2, //critical conditions
    error: 3, //error conditions
    warning: 4, //warning conditions
    notice: 5, //normal but significant condition
    info: 6, //informational messages
    debug: 7,  //debug level messages
};

type MongoTransportInfoParams = Pick<ILogs, 'level' | 'message' | 'data' | 'path' | 'timestamp'>

class MongoTransport extends winston.Transport {

    constructor(opts: object) {
        super(opts);
    }

    async log(info: MongoTransportInfoParams, callback: () => void) {

        setImmediate(() => {
            this.emit('logged', info);
        });

        const log = new Logs({
            level: info.level,
            message: info.message,
            data: info.data || {},
            path: info.path,
            timestamp: Date.now()
        });
        await log.save();

        callback();
    }
}

export const logger = winston.createLogger({
    levels: LOGS_LEVELS,
    format: format.combine(
        format.json(),
    ),
    transports: [
        new MongoTransport(),
    ]
});

const COLORS = {
    emergency: '\x1b[41m',
    alert: '\x1b[43m',
    critical: '\x1b[41m',
    error: '\x1b[41m',
    warning: '\x1b[43m',
    notice: '\x1b[43m',
    info: '\x1b[46m',
    debug: '\x1b[45m',
} as const;

const custom = format.printf((data) => {
    const message = `${COLORS[data.level as keyof COLORS]} ${data.level.toUpperCase()} \x1b[0m ${data.message}`;
    return !data.data ? message : message + `\n${JSON.stringify(data)}`;
});

if (process.env.BUILD !== 'prod') {
    logger.add(new transports.Console({ format: format.combine(custom), level: 'debug' }));
}
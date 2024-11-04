import winston from 'winston';
const { combine, printf } = winston.format;

/**
 * Creates a logger instance with the specified service name.
 * @param service - The name of the service.
 * @returns A winston.Logger instance.
 */
function createLogger(service: string): winston.Logger {
  return winston.createLogger({
    levels: winston.config.syslog.levels,
    defaultMeta: {
      service,
    },
    transports: [new winston.transports.Console()],
  });
}

const gitLogger = createLogger('gitLogger');
export default gitLogger;

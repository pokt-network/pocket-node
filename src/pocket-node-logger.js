const Winston = require('winston'),
      DEFAULT_LOG_FILE_PATH = 'pocket-node.log',
      PocketNodeLogFormat = Winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      });

module.exports.createServerLogger = function(logFilePath) {
  return Winston.createLogger({
    exitOnError: false,
    format: Winston.format.combine(
      Winston.format.timestamp(),
      Winston.format.colorize(),
      Winston.format.simple(),
      PocketNodeLogFormat
    ),
    transports: [
      new Winston.transports.Console(),
      new Winston.transports.File({ filename: logFilePath || DEFAULT_LOG_FILE_PATH })
    ]
  });
};

module.exports.createCommandLogger = function() {
  return Winston.createLogger({
    exitOnError: false,
    format: Winston.format.combine(
      Winston.format.colorize(),
      Winston.format.simple()
    ),
    transports: [
      new Winston.transports.Console()
    ]
  });
}

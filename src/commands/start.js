var PocketNodeServer = require('../server'),
    logger = require('../pocket-node-logger').createCommandLogger();

const cluster = require('cluster'),
      numCPUs = require('os').cpus().length;

module.exports = function(program) {
  var logPathFile = null;
  program
    .command('start')
    .description('Starts the Pocket Node API Server')
    .option('-p, --port [number]', 'Specify port [3000]', '3000')
    .option('-o, --output [filepath]', 'Specify log file path [pocket-node.log]', 'pocket-node.log')
    .option('-c, --cors', 'Enable CORS requests')
    .option('-w, --ws', 'Enable WebSocket requests')
    .option('-h, --http', 'Enable HTTP endpoints')
    .action(function (cmd) {
      if(cmd.ws !== true && cmd.http !== true) {
        logger.error('You need to enable either Websockets or HTTP, use --help to see how to enable them.');
        return;
      }

      if (cluster.isMaster) {
        logger.info(`Pocket Node Server started with PID: ${process.pid} on port: ${cmd.port}`);
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }
        cluster.on('exit', (deadWorker, code, signal) => {
          logger.info(`Pocket Node Worker ${process.pid} exited with code: ${code}`);
          var newWorker = cluster.fork();
          logger.info(`Started new Pocket Node Worker with PID: ${newWorker.process.pid}`);
        });
      } else {
        var workerServer = new PocketNodeServer(cmd.port, cmd.output, cmd.cors, cmd.ws, cmd.http);
        workerServer.start(function() {
          logger.info(`Started new Pocket Node Worker with PID: ${process.pid}`);
        });
      }
    });
}

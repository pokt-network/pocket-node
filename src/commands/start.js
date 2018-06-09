var PocketNodeServer = require('../server');

module.exports = function(program) {
  program
    .command('start')
    .option('-p, --port [number]', 'Specify port [3000]', '3000')
    .option('-o, --output [filepath]', 'Specify log file path [pocket-node.log]', 'pocket-node.log')
    .action(function (cmd) {
      new PocketNodeServer(cmd.port, cmd.output);
    });
}

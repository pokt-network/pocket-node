var PocketNodeServer = require('../server');

module.exports = function(program) {
  program
    .command('start')
    .option('-p, --port [number]', 'Specify port [3000]', '3000')
    .action(function (cmd) {
      new PocketNodeServer(cmd.port);
    });
}

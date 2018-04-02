module.exports = function(program) {
  program
    .command('install <plugin>')
    .action(function (plugin, cmd) {
      console.log('Installing: ' + plugin);
    });
}

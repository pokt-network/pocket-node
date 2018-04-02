module.exports = function(program) {
  program
    .command('configure <plugin> <path>')
    .action(function (plugin, path, cmd) {
      console.log('Configuring ' + plugin + ' with file: ' + path);
    });
}

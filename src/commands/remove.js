module.exports = function(program) {
  program
    .command('remove <plugin>')
    .action(function (plugin, cmd) {
      console.log('Removing ' + plugin + ' plugin');
    })
}

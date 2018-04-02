module.exports = function(program) {
  program
    .command('list')
    .action(function (cmd) {
      console.log('Listing plugins');
    });
}

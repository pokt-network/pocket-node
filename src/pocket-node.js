#!/bin/sh
':' //; exec "$(command -v nodejs --use-strict || command -v node --use-strict)" "$0" "$@"

var program = require('commander'),
    packageData = require('../package.json'),
    commands = require('./commands');

// Set version
program.version(packageData.version);

// Set description
program.description(packageData.description || 'A Pocket Network client for Pocket Nodes, which are the actors within the Pocket Network that execute the Relays.');

// Remove implicit command help
program.addImplicitHelpCommand = () => {};

// Setup 'start' command
commands.start(program);

// Setup 'install' command
commands.install(program);

// Setup 'list' command
commands.list(program);

// Setup 'configure' command
commands.configure(program);

// Setup 'remove' command
commands.remove(program);

// Parse inputs
program.parse(process.argv);

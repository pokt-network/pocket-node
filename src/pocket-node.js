#!/bin/sh
':' //; exec "$(command -v nodejs --use-strict || command -v node --use-strict)" "$0" "$@"

var program = require('commander'),
    packageData = require('../package.json'),
    commands = require('./commands'),
    PocketNodeConfig = require('./pocket-node-config');

// Set version
program.version(packageData.version);

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

// Setup 'setup' command
commands.setup(program);

// Parse inputs
program.parse(process.argv);

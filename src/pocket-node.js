#!/usr/bin/env node#!/usr/
var program = require('commander'),
    packageData = require('../package.json'),
    commands = require('./commands');

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

// Parse inputs
program.parse(process.argv);

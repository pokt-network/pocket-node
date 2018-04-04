var PocketNodeConfig = require('../pocket-node-config'),
    inquirer = require('inquirer');

const setupQuestions = [
  {
    type: 'confirm',
    name: 'is_registered',
    message: 'Have you registered your node at https://dashboard.pokt.network?',
    default: false
  },
  {
    type: 'input',
    name: 'eth_provider_url',
    message: "What's the URL of your Ethereum Node?"
  },
  {
    type: 'input',
    name: 'eth_network_id',
    message: "What's the Ethereum Network ID you're connecting to?"
  },
  {
    type: 'input',
    name: 'epoch_registry_api_address',
    message: "What's the EpochRegistryAPI Contract Address?"
  },
  {
    type: 'input',
    name: 'eth_account',
    message: "What's your Ethereum Account Address?"
  },
  {
    type: 'input',
    name: 'node_nonce',
    message: "What's your Node Nonce (You can get it from: https://dashboard.pokt.network)?"
  }
];

module.exports = function(program) {
  program
    .command('setup')
    .action(function (cmd) {
      inquirer.prompt(setupQuestions).then(async(answers) => {
        if (answers.is_registered === false) {
          console.error('Please register a node first');
        } else {
          // Delete confirm field
          delete answers.is_registered;

          // Register config
          var answerKeys = Object.keys(answers);
          for (var i = 0; i < answerKeys.length; i++) {
            await PocketNodeConfig.updateConfig(answerKeys[i], answers[answerKeys[i]]);
          }
          console.log('Pocket Node Setup Complete');
          console.log(JSON.stringify(answers, null, '  '));
        }
      });
    });
}

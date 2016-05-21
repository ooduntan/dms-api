var vorpal = require('vorpal')();
var cliHelper = require('./commander_helper');

vorpal
  .command('user', 'Logs in a user')
  .option('-u, --username <username>', 'Specifies username')
  .option('-p, --password <password>', 'Specifies user password')
  .action(function(args, callback) {
    cliHelper.command('login', 'loginData', this, args, 2, callback);
  });

vorpal
  .command('create', 'Creates new user')
  .option('-f, --firstname <firstname>', 'Specifies firstname')
  .option('-l, --lastname <lastname>', 'Specifies lastname')
  .option('-e, --email <eamil>', 'Specifies email')
  .option('-u, --username <username>', 'Specifies username')
  .option('-p, --password <password>', 'Specifies password')
  .option('-v, --vpassword <password>', 'comfirm password')
  .option('-r, --role <role>', 'Specifies the user role')
  .action(function(args, callback) {
    cliHelper.command('createUser', 'createData', this, args, 7, callback);
  });

vorpal
  .command('list', 'list all registered users')
  .option('-o, --offset <id>', 'Specifies the start offset')
  .action(function(args, callback) {

  });

vorpal
  .command('find', 'Finds a particular user')
  .option('-i, --id <id>', 'Specifies user ID')
  .action(function(args, callback) {

  });

vorpal
  .delimiter('dms ➜ ')
  .show();

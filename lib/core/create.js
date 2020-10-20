const program = require('commander');

const {
  createProject,
  addComponent
} = require('./actions');

const createCommands = () => {
  // 创建项目指令
  program
    .command('create <project> [otherArgs...]')
    .description('clone a repository into a newly created directory')
    .action(createProject);

  program
    .command('addcpn <name>')
    .description('add vue component, 例如: coderwhy addcpn NavBar -d src/components')
    .action(addComponent)

  program.command('test').action(() => {
    // terminal.spawn("npm", ['--version']);
    // terminal.exec("npm --version");
    // open('http://localhost:8080/');
  })
}

module.exports = createCommands;

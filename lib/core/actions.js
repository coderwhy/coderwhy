const { promisify } = require('util');
const path = require('path');

const program = require('commander');
const downloadRepo = promisify(require('download-git-repo'));
const open = require('open');

const log = require('../utils/log');
const terminal = require('../utils/terminal');
const { ejsCompile, writeFile } = require('../utils/file');
const repoConfig = require('../config/repo_config');

const createProject = async (project, otherArg) => {
  // 1.提示信息
  log.hint('coderwhy helps you create your project, please wait a moment~');

  // 2.clone项目从仓库
  await downloadRepo(repoConfig.vueGitRepo, project, { clone: true });

  // 3.执行终端命令npm install
  // terminal.exec('npm install', {cwd: `./${project}`});
  const npm = project.platform === 'win32' ? 'npm.cmd' : 'npm';
  await terminal.spawn(npm, ['install'], { cwd: `./${project}` });

  // 4.打开浏览器
  open('http://localhost:8080/');

  // 5.运行项目
  await terminal.spawn(npm, ['run', 'serve'], { cwd: `./${project}` });
}

const addComponent = async (name) => {
  console.log(name, program.dest);

  // 1.获取模块引擎的路径
  const templatePath = path.resolve(__dirname, '../template/component.vue.ejs');
  const result = await ejsCompile(templatePath, {name});

  // 2.写入文件中
  const targetPath = path.resolve(program.dest, `${name}.vue`);
  writeFile(targetPath, result);
}

module.exports = {
  createProject,
  addComponent
}
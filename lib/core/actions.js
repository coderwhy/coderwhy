const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const program = require('commander');
const downloadRepo = promisify(require('download-git-repo'));
const open = require('open');

const log = require('../utils/log');
const terminal = require('../utils/terminal');
const { ejsCompile, writeFile, mkdirSync } = require('../utils/file');
const repoConfig = require('../config/repo_config');

const createProject = async (project, otherArg) => {
  // 1.提示信息
  log.hint('coderwhy helps you create your project, please wait a moment~');

  // 2.clone项目从仓库
  await downloadRepo(repoConfig.vueGitRepo, project, { clone: true });

  // 3.执行终端命令npm install
  // terminal.exec('npm install', {cwd: `./${project}`});
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  await terminal.spawn(npm, ['install'], { cwd: `./${project}` });

  // 5.运行项目
  terminal.spawn(npm, ['run', 'serve'], { cwd: `./${project}` });

  // 4.打开浏览器
  open('http://localhost:8080/');
}

const handleEjsToFile = async (name, dest, template, filename) => {
  // 1.获取模块引擎的路径
  const templatePath = path.resolve(__dirname, template);
  const cpnPath = dest.replace('router', 'views').replace("src", "@") + `/${name}.vue`
  const routePath = dest.replace('/router', '').replace('src', '')
  const result = await ejsCompile(templatePath, {name, lowerName: name.toLowerCase(), cpnPath, routePath});

  // 2.写入文件中
  // 判断文件不存在,那么就创建文件
  mkdirSync(dest);
  const targetPath = path.resolve(dest, filename);
  writeFile(targetPath, result);
}

const addComponent = async (name, dest) => {
  handleEjsToFile(name, dest, '../template/component.vue.ejs', `${name}.vue`);
}
const addPage = async (name, dest) => {
  addComponent(name, dest);
  handleEjsToFile(name, dest, '../template/vue-router.js.ejs', 'router.js')
}

const addVue3TSComponent = async (name, dest) => {
  handleEjsToFile(name, dest, '../template/component3_ts.vue.ejs', `${name}.vue`);
}
const addVue3Page = async (name, dest) => {
  addVue3TSComponent(name, dest);
  let routerDest = dest.replace("views", "router")
  handleEjsToFile(name, routerDest, '../template/vue-router4.js.ejs', `${name}.ts`)
}

const addVue3PageSetup = async (name, dest) => {
  handleEjsToFile(name, dest, '../template/component3_ts_su.vue.ejs', `${name}.vue`);
  let routerDest = dest.replace("views", "router")
  handleEjsToFile(name, routerDest, '../template/vue-router4.js.ejs', `${name}.ts`)
}

const addStore = async (name, dest) => {
  handleEjsToFile(name, dest, '../template/vue-store.js.ejs', 'index.js')
  handleEjsToFile(name, dest, '../template/vue-types.js.ejs', 'types.js')
}

module.exports = {
  createProject,
  addComponent,
  addPage,
  addVue3Page,
  addVue3PageSetup,
  addStore
}
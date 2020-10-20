#!/usr/bin/env node
const program = require('commander');

const helpOptions = require('./lib/core/help');
const createCommands = require('./lib/core/create');

const log = require('./lib/utils/log');

// 定义显示模块的版本号
program.version(require('./package.json').version);

// 给help增加其他选项
helpOptions();

// 创建命令
createCommands();

// 解析终端指令
program.parse(process.argv);





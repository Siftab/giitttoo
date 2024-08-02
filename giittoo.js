#!/usr/bin/env node

import { initializeGitRepository } from './Utils/initializeGitRepository.js';
import { performGitCommands } from './Utils/performGitCommands.js';
import chalk from 'chalk';

const args = process.argv.slice(2);
const command = args[0];
const repositoryUrl = args[1];
const commitMessage = args[2] || 'Initial commit';
const branch = args[3] || 'main';

if (command === '-c' && repositoryUrl) {
  initializeGitRepository(repositoryUrl);
} else if (commitMessage) {
  performGitCommands(commitMessage, branch);
} else {
  console.error(chalk.red('Invalid command or missing arguments.'));
  process.exit(1);
}

#!/usr/bin/env node

import { initializeGitRepository } from './Utils/initializeGitRepository.js';
import { performGitCommands } from './Utils/performGitCommands.js';
import chalk from 'chalk';

const args = process.argv.slice(2);
const command = args[0];
const repositoryUrl = args[1];
const commitMessage = args.slice(2).join(' ') || 'Initial commit'; // Default commit message if not provided
const branch = args[3] || 'main';
console.log('Arguments:', args);
console.log('Commit Message:', commitMessage);


if (command === 'setup' && repositoryUrl) {
  initializeGitRepository(repositoryUrl);
} else if (command === '-c') { // Updated to '-c' for add, commit, push
  performGitCommands(commitMessage, branch);
} else {
  console.error(chalk.red('Invalid command or missing arguments.'));
  process.exit(1);
}

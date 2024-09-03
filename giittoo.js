#!/usr/bin/env node

import { initializeGitRepository } from './Utils/initializeGitRepository.js';
import { performGitCommands } from './Utils/performGitCommands.js';
import chalk from 'chalk';

const args = process.argv.slice(2);
const command = args[0];
const commitMessage = args.slice(1).join(' ') || 'Initial commit'; // Capture all remaining arguments as commit message
const branch = args[2] || 'main';

console.log('Arguments:', args);
console.log('Command:', command);
console.log('Commit Message:', commitMessage);
console.log('Branch:', branch);

if (command === 'setup') {
  const repositoryUrl = args[1];
  if (!repositoryUrl) {
    console.error(chalk.red('Repository URL is required for setup.'));
    process.exit(1);
  }
  initializeGitRepository(repositoryUrl, commitMessage);
} else if (command === '-c') {
  performGitCommands(commitMessage, branch);
} else {
  console.error(chalk.red('Invalid command or missing arguments.'));
  process.exit(1);
}

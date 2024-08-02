import path from 'path';
import fs from 'fs';
import { executeCommand } from './executeCommand.js';
import chalk from 'chalk';

export function initializeGitRepository(remoteUrl) {
  const gitDir = path.join(process.cwd(), '.git');

  // Check if the directory already contains a .git folder
  if (fs.existsSync(gitDir)) {
    console.log(chalk.red('Repository already initialized.'));
    process.exit(1);
  }

  // Initialize the git repository
  executeCommand('git init');
  executeCommand('git add .');
  executeCommand(`git commit -m "initializing"`);
  executeCommand('git branch -M main');
  executeCommand(`git remote add origin ${remoteUrl}`);
  const pushResult = executeCommand('git push -u origin main');
  console.log(chalk.green('Repository initialized and pushed successfully.'));
  console.log(chalk.yellow(pushResult));
}

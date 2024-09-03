import { execSync } from 'child_process';
import chalk from 'chalk';
import { executeCommand } from './executeCommand.js';

const checkmark = '\u2713'; // Checkmark symbol
const heavyCrossSign = '\u274C'; // Heavy multiplication X

export function performGitCommands(commitMessage, branch) {
  try {
    // Check the current branch
    const currentBranch = executeCommand('git branch --show-current').trim();

    if (currentBranch !== branch) {
      console.log(chalk.green(`Switching to branch => ${branch}...`));
      executeCommand(`git checkout ${branch}`);
      console.log(chalk.green(`Switched to branch ==> ${branch} ${checkmark}`));
    } else {
      console.log(chalk.green(`Current branch ==> ${branch}`));
    }

    // Execute git add
    console.log(chalk.green(`Adding changes...`));
    executeCommand('git add .');
    console.log(chalk.green(`Files added successfully ${checkmark}`));

    // Execute git commit with provided commit message
    console.log(chalk.green('Committing changes...'));
    try {
      const commitResult = execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
      console.log(chalk.green('Changes committed successfully.'));
      console.log(chalk.yellow(commitResult));
    } catch (commitError) {
      const errorOutput = commitError.stdout || commitError.stderr || commitError.message;
      if (errorOutput.includes('nothing to commit')) {
        console.error(chalk.red(`Nothing to commit, working tree clean ${heavyCrossSign}`));
        process.exit(1);
      } else {
        console.error(chalk.red(`Commit failed: ${errorOutput.toString()} ${heavyCrossSign}`));
        process.exit(1);
      }
    }

    // Execute git push
    console.log(chalk.green('Pushing changes...'));
    const pushResult = executeCommand(`git push origin ${branch}`);
    console.log(chalk.green(`Code pushed successfully ${checkmark}`));
    console.log(chalk.yellow(pushResult));
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;
    console.error(chalk.red(`Unexpected error: ${errorOutput.toString()} ${heavyCrossSign}`));
    process.exit(1);
  }
}

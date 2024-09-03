import { execSync } from 'child_process';
import chalk from 'chalk';
import { executeCommand } from './executeCommand.js';

const CHECKMARK = '\u2713'; // Define checkmark as a constant

export function performGitCommands(commitMessage, branch) {
  try {
    // Check the current branch
    const currentBranch = executeCommand('git branch --show-current').trim();

    if (currentBranch !== branch) {
      // Switch to the specified branch
      console.log(chalk.green(`Switching to branch => ${branch}...`));
      executeCommand(`git checkout ${branch}`);
      console.log(chalk.green(`Switched to branch ==> ${branch} ${CHECKMARK} ${CHECKMARK} ${CHECKMARK}`));
    } else {
      console.log(chalk.green(`Current branch ==> ${branch}`));
    }

    // Execute git add
    console.log(chalk.green(`Adding changes...`))
    executeCommand('git add .');
    console.log(chalk.green(`Files added successfully. ${CHECKMARK}`));

    // Execute git commit and handle "nothing to commit" scenario
    console.log(chalk.green('Committing changes...'));
    try {
      const commitResult = execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
      console.log(chalk.green('Changes committed successfully.'));
      console.log(chalk.yellow(commitResult));
    } catch (commitError) {
      const errorOutput = commitError.stdout || commitError.stderr || commitError.message;
      if (errorOutput.includes('nothing to commit')) {
        console.error(chalk.red('Nothing to commit, working tree clean.'));
        process.exit(1); // Exit with status 1 to indicate nothing was committed
      } else {
        console.error(chalk.red(errorOutput.toString()));
        process.exit(1);
      }
    }

    // Execute git push
    console.log(chalk.green('Pushing changes...'));
    const pushResult = executeCommand(`git push origin ${branch}`);
    console.log(chalk.yellow(pushResult));
  } catch (error) {
    // Log any errors and exit with the error code
    const errorOutput = error.stdout || error.stderr || error.message;
    console.error(chalk.red('Unexpected error:', errorOutput.toString()));
    process.exit(1);
  }
}

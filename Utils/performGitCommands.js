import { execSync } from 'child_process';
import chalk from 'chalk';
import { executeCommand } from './executeCommand.js';
import { promptUserToCreateBranch } from './promptUserToCreateBranch.js';
const checkmark = '\u2713'; // Constant for checkmark symbol



export async function performGitCommands(commitMessage, branch) {
  try {
    // Check the current branch
    const currentBranch = executeCommand('git branch --show-current').trim();

    if (currentBranch !== branch) {
      // Check if the branch exists
      try {
        executeCommand(`git show-branch remotes/origin/${branch}`);
        console.log(chalk.green(`Switching to branch => ${branch}...`));
        executeCommand(`git checkout ${branch}`);
        console.log(chalk.green(`Switched to branch ==> ${branch} ${checkmark} ${checkmark} ${checkmark}`));
      } catch (error) {
        console.log(chalk.red(`Branch "${branch}" does not exist.`));
        const shouldCreateBranch = await promptUserToCreateBranch(branch);

        if (shouldCreateBranch) {
          console.log(chalk.green(`Creating and switching to new branch => ${branch}...`));
          executeCommand(`git checkout -b ${branch}`);
          console.log(chalk.green(`Created and switched to branch ==> ${branch} ${checkmark}`));
        } else {
          console.error(chalk.red('Branch creation aborted by user.'));
          process.exit(1);
        }
      }
    } else {
      console.log(chalk.green(`Current branch ==> ${branch}`));
    }

    // Execute git add
    console.log(chalk.green(`Adding changes...`));
    executeCommand('git add .');
    console.log(chalk.green(`Files added successfully. ${checkmark}`));

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
    console.log(chalk.green('Code pushed successfully.'));
  } catch (error) {
    // Log any errors and exit with the error code
    const errorOutput = error.stdout || error.stderr || error.message;
    console.error(chalk.red('Unexpected error:', errorOutput.toString()));
    process.exit(1);
  }
}

import { execSync } from 'child_process';
import chalk from 'chalk';
import { executeCommand } from './executeCommand.js';
import { promptUserToCreateBranch } from './promptUserToCreateBranch.js';
import { icons } from './icons.js';



export async function performGitCommands(commitMessage, branch) {
  
  try {
    // Fetch the latest remote branches to ensure references are up to date
    console.log(chalk.green(`${icons.processingMark} Fetching latest`));
    executeCommand('git fetch origin');

    // Check the current branch
    const currentBranch = executeCommand('git branch --show-current').trim();
    console.log(chalk.green(`Current branch detected: ${currentBranch}`)); // Debugging output

    if (currentBranch !== branch) {
      // Check if the branch exists remotely using git ls-remote
      try {
        const remoteBranchCheck = execSync(`git ls-remote --heads origin ${branch}`, { encoding: 'utf-8' }).trim();
        
        if (remoteBranchCheck) {
          console.log(chalk.green(`Switching to branch => ${branch}...`));
          executeCommand(`git checkout ${branch}`);
          console.log(chalk.green(`${icons.processingMark} Switched to branch ==> ${branch} ${icons.checkmark}`));
        } else {
          console.log(chalk.red(`Branch "${branch}" does not exist on the remote.`));
          const shouldCreateBranch = await promptUserToCreateBranch(branch);

          if (shouldCreateBranch) {
            console.log(chalk.green(`${icons.processingMark} Creating and switching to new branch => ${branch}...`));
            executeCommand(`git checkout -b ${branch}`);
            console.log(chalk.green(`Created and switched to branch ==> ${branch} ${icons.checkmark}`));
          } else {
            console.error(chalk.red(`Branch creation aborted by user. ${icons.crossmark}`));
            process.exit(1);
          }
        }
      } catch (error) {
        console.error(chalk.red(`${icons.crossmark} Error checking remote branch: ${error.message} `));
        process.exit(1);
      }
    } else {
      console.log(chalk.green(`Already on branch ==> ${branch}`));
    }


    // Execute git add
    console.log(chalk.green('Adding changes...'));
    executeCommand('git add .');
    console.log(chalk.green(`Files added successfully. ${icons.checkmark}`));

    // Execute git commit and handle "nothing to commit" scenario
    console.log(chalk.green('Committing changes...'));
    try {
      const commitResult = execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
      console.log(chalk.green(`Changes committed successfully. ${icons.checkmark}`));
      console.log(chalk.yellow(commitResult));
    } catch (commitError) {
      const errorOutput = commitError.stdout || commitError.stderr || commitError.message;
      if (errorOutput.includes('nothing to commit')) {
        console.error(chalk.red(`Nothing to commit, working tree clean. ${icons.crossmark}`));
        process.exit(1); // Exit with status 1 to indicate nothing was committed
      } else {
        console.error(chalk.red(`${errorOutput.toString()} ${icons.crossmark}`));
        process.exit(1);
      }
    }

    // Execute git push
    console.log(chalk.green('Pushing changes...'));
    const pushResult = executeCommand(`git push origin ${branch}`);
    console.log(chalk.yellow(pushResult));
    console.log(chalk.green(`...pushed successfully. ${icons.checkmark}`));
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;
    console.error(chalk.red(`Unexpected error: ${errorOutput.toString()} ${icons.crossmark}`));
    process.exit(1);
  }
}

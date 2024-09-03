import { execSync } from 'child_process';
import chalk from 'chalk';
import { executeCommand } from './executeCommand.js';
import readline from 'readline';

const checkmark = '\u2713'; // Checkmark symbol
const heavyCrossSign = '\u274C'; // Heavy multiplication X

// Function to get user input from the terminal
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

export async function performGitCommands(commitMessage, branch) {
  try {
    // Check the current branch
    const currentBranch = executeCommand('git branch --show-current').trim();
    console.log(chalk.green(`Current branch detected: ${currentBranch}`)); // Debugging output

    if (currentBranch !== branch) {
      console.log(chalk.green(`Switching to branch => ${branch}...`));

      try {
        // Try to checkout the specified branch
        executeCommand(`git checkout ${branch}`);
        console.log(chalk.green(`Switched to branch ==> ${branch} ${checkmark}`));
      } catch (error) {
        // Enhanced error logging
        const errorOutput = error.message || error.stderr || error.stdout;
        console.error(chalk.red(`Error output: ${errorOutput}`)); // Log the entire error output

        // Handle the case where the branch does not exist
        if (errorOutput.includes(`pathspec '${branch}' did not match any file(s) known to git`)) {
          console.error(chalk.yellow(`Branch "${branch}" does not exist.`));

          // Ask user if they want to create a new branch
          const answer = await askQuestion(chalk.yellow(`Do you want to create a new branch "${branch}" and switch to it? (y/n): `));

          if (answer.toLowerCase() === 'y') {
            console.log(chalk.green(`Creating and switching to new branch => ${branch}...`));
            executeCommand(`git checkout -b ${branch}`);
            console.log(chalk.green(`New branch created and switched to ${branch} ${checkmark}`));
          } else {
            console.log(chalk.red(`Operation canceled by the user ${heavyCrossSign}`));
            process.exit(1);
          }
        } else {
          console.error(chalk.red(`Error switching branches: ${errorOutput.toString()} ${heavyCrossSign}`));
          process.exit(1);
        }
      }
    } else {
      console.log(chalk.green(`Already on branch ==> ${branch}`));
    }

    // Proceed with adding and committing changes
    console.log(chalk.green(`Adding changes...`));
    executeCommand('git add .');
    console.log(chalk.green(`Files added successfully ${checkmark}`));

    // Execute git commit with provided commit message
    console.log(chalk.green('Committing changes...'));
    try {
      const commitResult = execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
      console.log(chalk.green(`Changes committed successfully ${checkmark}`));
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
    console.log(chalk.green(`...pushed successfully ${checkmark}`));
    console.log(chalk.yellow(pushResult));
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;
    console.error(chalk.red(`Unexpected error: ${errorOutput.toString()} ${heavyCrossSign}`));
    process.exit(1);
  }
}

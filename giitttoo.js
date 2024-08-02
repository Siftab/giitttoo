#!/usr/bin/env node

const { execSync } = require('child_process');

const commitMessage = process.argv[2];
const branch = process.argv[3] || 'main';

if (!commitMessage) {
  console.error('You need to provide a commit message.');
  process.exit(1);
}

function executeCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8' });
  } catch (error) {
    let errorMessage = 'An error occurred';

    if (error.stdout) {
      errorMessage = error.stdout.toString();
    } else if (error.stderr) {
      errorMessage = error.stderr.toString();
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
    process.exit(1);
  }
}

try {
  // branch checking 
  const currentBranch = executeCommand('git branch --show-current').trim();

  if (currentBranch !== branch) {
    // Switch to the specified branch
    console.log(`Switching to branch ${branch}...`);
    executeCommand(`git checkout ${branch}`);
    console.log(`Switched to branch ${branch}`);
  } else {
    console.log(`Already on branch ${branch}`);
  }


  // Execute git add
  console.log('Adding changes...');
  executeCommand('git add .');
  console.log('Files added successfully.');

  // Execute git commit and handle "nothing to commit" scenario
  console.log('Committing changes...');
  try {
    const commitResult = execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
    console.log('Changes committed successfully.');
    console.log(commitResult);
  } catch (commitError) {
    const errorOutput = commitError.stdout || commitError.stderr || commitError.message;
    if (errorOutput.includes('nothing to commit')) {
      console.error('Nothing to commit, working tree clean.');
      process.exit(1); // Exit with status 1 to indicate nothing was committed
    } else {
      console.error(errorOutput.toString());
      process.exit(1);
    }
  }

  // Execute git push
  console.log('Pushing changes...');
  const pushResult = executeCommand(`git push origin ${branch}`);
  console.log(pushResult);
} catch (error) {
  // Log any errors and exit with the error code
  const errorOutput = error.stdout || error.stderr || error.message;
  console.error('Unexpected error:', errorOutput.toString());
  process.exit(1);
}

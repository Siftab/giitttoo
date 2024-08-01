#!/usr/bin/env node

const { execSync } = require('child_process');

const commitMessage = process.argv[2];
const branch = process.argv[3] || 'main';

if (!commitMessage) {
  console.error('You need to provide a commit message.');
  process.exit(1);
}

try {
  // Switch to the specified branch
  execSync(`git checkout ${branch}`, { encoding: 'utf-8' });
  console.log(`Switched to branch ${branch}`);

  // Execute git add
  execSync('git add .', { encoding: 'utf-8' });
  console.log('Files added successfully.');

  // Execute git commit and handle "nothing to commit" scenario
  try {
    const commitResult = execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
    console.log('Changes committed successfully.');
    console.log(commitResult);
  } catch (commitError) {
    if (commitError.stderr.toString().includes('nothing to commit')) {
      console.error('Nothing to commit, working tree clean.');
    } else {
      throw commitError;
    }
    process.exit(1);
  }

  // Execute git push
  const pushResult = execSync(`git push origin ${branch}`, { encoding: 'utf-8' });
  console.log(pushResult);
} catch (error) {
  // Log any errors and exit with the error code
  console.error(error.stderr.toString());
  process.exit(error.status || 1);
}

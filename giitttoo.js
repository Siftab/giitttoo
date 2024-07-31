#!/usr/bin/env node

const { execSync } = require('child_process');

const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error('You need to provide a commit message.');
  process.exit(1);
}

try {
  // Execute the git commands synchronously
  const result = execSync(`git add . && git commit -m "${commitMessage}" && git push`, { encoding: 'utf-8' });

  // Log the output from Git
  console.log(result);
} catch (error) {
  // Log any errors and exit with the error code
  console.error(error.stderr.toString());
  process.exit(error.status || 1);
}


// #!/usr/bin/env node

// const { exec } = require('child_process');

// const commitMessage = process.argv[2];

// if (!commitMessage) {
//   console.error('You need to provide a commit message.');
//   process.exit(1);
// }

// exec(`git add . && git commit -m "${commitMessage}" && git push`, (error, stdout, stderr) => {
//   if (stderr) {
//     // Forward stderr to the console, which includes Git's default error messages
//     console.error(stderr);
//   }
//   if (stdout) {
//     // Log stdout, which includes the standard output from Git
//     console.log(stdout);
//   }
//   if (error) {
//     // Exit with the error code provided by the Git command
//     console.log(error)
//     process.exit(error.code);
//   }
// });


# giittoo

## Description
`giittoo` is a simple command-line tool designed to streamline the process of adding, committing, and pushing changes to a Git repository. It automates these tasks with a single command, saving developers time and effort.It also supports initializing a new Git repository and setting up a remote URL.


## Features
- Automatically stages all changes
- Commits changes with a user-provided message
- Pushes commits to the remote repository
- Can make git setup with remote-url 

## Installation
You can install `giittoo` globally using npm:

```
npm install -g giittoo

```
## Usage
After installing giittoo, you can use it from the command line. Provide a commit message as an argument:

```
giittoo "Your commit message"
```
this command will :
- stages all files
- Commits changes with a user-provided message
- Pushes commits to the remote repository
if you dont provide branch name it will commit all changes to main branch as default ,if you want to push in diffrent branch ,just write your message beside the commit massage like :
```
giittoo "Your commit message" "develop"
```
it will switch to that specific branch and commit your changes ,but make sure you have written your branch name properly 


you can also use it for your git setup for new project. Provide a your repository Url message :

```
giittoo -c repository-url
```
This command will:

- Initialize a new Git repository
- Stage all changes
- Commit with the message "initializing"
- Set up the remote URL
- Push the initial commit to the main branch

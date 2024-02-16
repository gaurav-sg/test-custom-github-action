const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { execSync } = require('child_process');

async function run() {
    try {
      // Access the event payload
      const payload = github.context.payload;
      
      // Get the event name
      const eventName = github.context.eventName;
      
      console.log(`Event name: ${eventName}`);
      
      // Check if it's a pull_request event
      if (eventName === 'pull_request') {
        // Check the action (opened, closed, reopened, etc.)
        const action = payload.action;
        console.log(`Pull request action: ${action}`);

        // Get commit messages associated with the pull request
        const octokit = github.getOctokit(core.getInput('github_token'));
        const { data: commits } = await octokit.rest.pulls.listCommits({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: github.context.payload.pull_request.number
        });

        // Extract Jira issue keys from commit messages
        const keys = [];
        commits.forEach(commit => {
          const match = commit.commit.message.match(/FUZE-[0-9]*/g);
          if (match) {
            keys.push(...match);
          }
        });
        console.log(`Jira Keys: ${keys}`);
        if (keys.length === 0) {
          core.warning('No Jira issue keys found in commit messages.');
          return;
        }

      } else if (eventName === 'push') {
        // Handle push event
        console.log('Push event');
      } else {
        console.log('Unsupported event');
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  
  // Execute the action
  run();

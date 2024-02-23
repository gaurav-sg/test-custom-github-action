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
      await updateJiraTicketStatus('FUZE-1', 'FUZE-2');
      
      // Check if it's a pull_request event
      if (eventName === 'pull_request') {
        // Check the action (opened, closed, reopened, etc.)
        const action = payload.action;
        console.log(`Pull request action: ${action}`);

        // Get commit messages associated with the pull request
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

        const { data: commits } = await octokit.rest.pulls.listCommits({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: github.context.payload.pull_request.number
        });

        // Extract Jira issue keys from commit messages
        const keys = [];
        commits.forEach(commit => {
          console.log('commit messages : --> ', commit.commit.message);
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
        const commits = github.context.payload.commits;
        console.log('Commit Information : --> ', commits);
      } else {
        console.log('Unsupported event');
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }


  async function updateJiraTicketStatus(ticketId, statusId) {
    // @todo do via proper axios call / error handling etc
    // make token dynamic
    // before updating status check the current status of jira Ticket
    // const command = `curl -D- -u ${core.getInput('jira_username')}:${core.getInput('jira_token')} -X POST -H "Content-Type: application/json" --data '{"transition": {"id": "${core.getInput('new_status_id')}"}' ${core.getInput('jira_domain')}/rest/api/2/issue/${key}/transitions`;
    const command = `ls -ltr`;
    execSync(command);
    core.info(`Jira issue ${ticketId} status updated.`);
  }
  
  // Execute the action
  run();

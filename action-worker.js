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

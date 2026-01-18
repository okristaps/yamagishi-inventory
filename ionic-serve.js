#!/usr/bin/env node

// Wrapper script to handle Ionic CLI arguments for Next.js
const { spawn } = require('child_process');

// Filter out Ionic-specific arguments and convert to Next.js format
const args = process.argv.slice(2);
const filteredArgs = [];

let port = '8100';
let host = '0.0.0.0';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--host') {
    host = args[i + 1];
    i++; // skip next argument
  } else if (arg.startsWith('--host=')) {
    host = arg.split('=')[1];
  } else if (arg === '--port') {
    port = args[i + 1];
    i++; // skip next argument
  } else if (arg.startsWith('--port=')) {
    port = arg.split('=')[1];
  } else if (!arg.startsWith('--host') && !arg.startsWith('--port')) {
    filteredArgs.push(arg);
  }
}

// Start Next.js with proper arguments for network access
const nextArgs = ['dev', '--hostname', host, '--port', port, ...filteredArgs];

const child = spawn('npx', ['next', ...nextArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Error starting Next.js:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});
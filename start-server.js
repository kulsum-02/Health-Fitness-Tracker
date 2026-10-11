import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const backendDir = fs.existsSync(path.join(__dirname, 'backend', 'src', 'server.js'))
  ? path.join(__dirname, 'backend')
  : path.join(__dirname, '..', 'backend');

console.log(`[FullStack] Launching Node.js backend from: ${backendDir}`);

const child = spawn('node', ['src/server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});

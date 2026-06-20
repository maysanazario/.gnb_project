const { execSync } = require('child_process');
require('dotenv').config();

const port = process.env.PORT || 4000;

function killProcess(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGKILL');
    }
    console.log(`Stopped process ${pid} on port ${port}`);
  } catch (error) {
    console.warn(`Unable to stop process ${pid}: ${error.message}`);
  }
}

function findPids() {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr ":${port}"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      return [...new Set(
        output
          .split(/\r?\n/)
          .filter(Boolean)
          .map(line => line.trim().split(/\s+/).pop())
          .filter(Boolean)
      )].map(Number);
    }

    const output = execSync(`lsof -i tcp:${port} -t`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return [...new Set(output.split(/\r?\n/).filter(Boolean))].map(Number);
  } catch (error) {
    return [];
  }
}

const pids = findPids();

if (!pids.length) {
  console.log(`No process found on port ${port}.`);
  process.exit(0);
}

console.log(`Found ${pids.length} process(es) on port ${port}.`);
for (const pid of pids) {
  killProcess(pid);
}

process.exit(0);
